import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GiftForm } from "@/components/gift/GiftForm";
import { GiftDisplay } from "@/components/gift/GiftDisplay";
import { GiftCreatorView } from "@/components/gift/GiftCreatorView";
import { GiftLoading } from "@/components/gift/GiftLoading";

const COOKIE_KEY = "gift_creator_cookies";

function getCreatorCookies(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setCreatorCookie(tagId: string, cookie: string) {
  const cookies = getCreatorCookies();
  cookies[tagId] = cookie;
  localStorage.setItem(COOKIE_KEY, JSON.stringify(cookies));
}

const GiftPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: tag, isLoading, error } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: { sender_name: string; message: string; image_url: string }) => {
      const cookie = crypto.randomUUID();
      
      if (!tag) {
        // Create tag
        const { error } = await supabase.from("tags").insert({
          id: id!,
          status: "locked",
          sender_name: payload.sender_name,
          message: payload.message,
          image_url: payload.image_url,
          creator_cookie: cookie,
        });
        if (error) throw error;
      } else {
        // Update existing
        const { error } = await supabase
          .from("tags")
          .update({
            status: "locked",
            sender_name: payload.sender_name,
            message: payload.message,
            image_url: payload.image_url,
            creator_cookie: cookie,
          })
          .eq("id", id!);
        if (error) throw error;
      }
      
      setCreatorCookie(id!, cookie);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tag", id] }),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { sender_name: string; message: string; image_url: string }) => {
      const { error } = await supabase
        .from("tags")
        .update({
          sender_name: payload.sender_name,
          message: payload.message,
          image_url: payload.image_url,
        })
        .eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tag", id] }),
  });

  if (isLoading) return <GiftLoading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-serif text-lg">Something went wrong.</p>
      </div>
    );
  }

  // Empty state - show form
  if (!tag || tag.status === "empty") {
    return (
      <GiftForm
        tagId={id!}
        onSubmit={(data) => submitMutation.mutateAsync(data)}
        isSubmitting={submitMutation.isPending}
      />
    );
  }

  // Locked - check if creator
  const cookies = getCreatorCookies();
  const isCreator = cookies[id!] === tag.creator_cookie;

  if (isCreator) {
    return (
      <GiftCreatorView
        tag={tag}
        tagId={id!}
        onUpdate={(data) => updateMutation.mutateAsync(data)}
        isUpdating={updateMutation.isPending}
      />
    );
  }

  // Receiver view
  return <GiftDisplay tag={tag} />;
};

export default GiftPage;
