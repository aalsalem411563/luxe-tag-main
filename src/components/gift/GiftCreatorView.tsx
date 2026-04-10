import { useState } from "react";
import { GiftForm } from "./GiftForm";
import { Heart, Pencil } from "lucide-react";

interface GiftCreatorViewProps {
  tag: {
    sender_name: string | null;
    message: string | null;
    image_url: string | null;
  };
  tagId: string;
  onUpdate: (data: { sender_name: string; message: string; image_url: string }) => Promise<void>;
  isUpdating: boolean;
}

export const GiftCreatorView = ({ tag, tagId, onUpdate, isUpdating }: GiftCreatorViewProps) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <GiftForm
        tagId={tagId}
        onSubmit={async (data) => {
          await onUpdate(data);
          setEditing(false);
        }}
        isSubmitting={isUpdating}
        initialData={{
          sender_name: tag.sender_name || "",
          message: tag.message || "",
          image_url: tag.image_url || "",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Decorative top */}
        <div className="text-center mb-6">
          <div className="w-12 h-px bg-primary mx-auto mb-4" />
          <p className="text-primary text-xs tracking-[0.3em] uppercase font-sans">Your Gift</p>
          <div className="w-12 h-px bg-primary mx-auto mt-4" />
        </div>

        {tag.image_url && (
          <div className="rounded-lg overflow-hidden border border-border mb-6">
            <img src={tag.image_url} alt="Gift" className="w-full h-64 object-cover" />
          </div>
        )}

        <div className="text-center space-y-4 mb-8">
          <p className="font-serif text-xl text-foreground italic leading-relaxed">
            "{tag.message}"
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-primary/50" />
            <Heart className="w-3 h-3 text-primary fill-primary" />
            <div className="w-8 h-px bg-primary/50" />
          </div>
          <p className="text-primary font-serif text-lg">— {tag.sender_name}</p>
        </div>

        <button
          onClick={() => setEditing(true)}
          className="w-full border border-primary text-primary py-3 rounded-lg font-sans font-medium tracking-wide uppercase text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit Gift
        </button>
      </div>
    </div>
  );
};
