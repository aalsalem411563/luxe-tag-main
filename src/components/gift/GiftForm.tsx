import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Upload, Send } from "lucide-react";

interface GiftFormProps {
  tagId: string;
  onSubmit: (data: { sender_name: string; message: string; image_url: string }) => Promise<void>;
  isSubmitting: boolean;
  initialData?: { sender_name: string; message: string; image_url: string };
}

export const GiftForm = ({ tagId, onSubmit, isSubmitting, initialData }: GiftFormProps) => {
  const [senderName, setSenderName] = useState(initialData?.sender_name || "");
  const [message, setMessage] = useState(initialData?.message || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    
    const ext = file.name.split(".").pop();
    const path = `${tagId}/${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage.from("gift-images").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }
    
    const { data } = supabase.storage.from("gift-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim() || !imageUrl) return;
    await onSubmit({ sender_name: senderName.trim(), message: message.trim(), image_url: imageUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-foreground mb-2">Create Your Gift</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Add a personal touch to your present</p>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div
            className="relative border border-border rounded-lg overflow-hidden cursor-pointer group transition-colors hover:border-primary/50"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 flex flex-col items-center justify-center gap-3 bg-secondary/30">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                  Upload an image
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2 tracking-wide uppercase font-sans">Your Name</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-sans"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2 tracking-wide uppercase font-sans">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none font-sans"
              placeholder="Write a heartfelt message..."
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading || !imageUrl || !senderName.trim() || !message.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-sans font-medium tracking-wide uppercase text-sm flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Seal Your Gift
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
