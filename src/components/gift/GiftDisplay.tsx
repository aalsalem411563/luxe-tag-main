import { useState } from "react";
import { Heart } from "lucide-react";

interface GiftDisplayProps {
  tag: {
    sender_name: string | null;
    message: string | null;
    image_url: string | null;
  };
}

export const GiftDisplay = ({ tag }: GiftDisplayProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Thank you so much for the lovely gift, ${tag.sender_name}! 💐`
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Decorative top */}
        <div className="text-center mb-8">
          <div className="w-12 h-px bg-primary mx-auto mb-4" />
          <p className="text-primary text-xs tracking-[0.3em] uppercase font-sans">A Gift For You</p>
          <div className="w-12 h-px bg-primary mx-auto mt-4" />
        </div>

        {!isOpened ? (
          <>
            <div className="w-full flex flex-col items-center">
              {/* 3D Envelope Centered */}
              <iframe
                src="https://my.spline.design/envelopecopy-7WFlL7fvFSJOLwgySo5ethrP/"
                width="100%"
                height="450px"
                frameBorder="0"
                style={{
                  border: "none",
                  background: "transparent",
                  pointerEvents: "auto",
                  borderRadius: "1rem",
                  boxShadow: "0 8px 32px rgba(212, 175, 55, 0.06)",
                }}
                allow="autoplay; fullscreen"
                title="3D Envelope"
                className="mb-8"
              ></iframe>

              {/* Open Gift Button */}
              <button
                onClick={() => setIsOpened(true)}
                className="mt-2 px-8 py-3 rounded-full bg-gold text-background font-serif text-lg font-bold shadow-lg animate-pulse transition-all ease-out duration-300 hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold-dark"
                style={{
                  letterSpacing: "0.06em",
                  boxShadow: "0 2px 24px 0 rgba(212, 175, 55, 0.24)",
                }}
              >
                افتح الهدية <span aria-label="gift" role="img">🎁</span>
              </button>
            </div>
          </>
        ) : (
          // Fade-in slide-up animation for gift reveal
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Image */}
            {tag.image_url && (
              <div className="rounded-2xl overflow-hidden border border-gold mb-8 shadow-lg">
                <img
                  src={tag.image_url}
                  alt="Gift"
                  className="w-full h-64 object-cover"
                  style={{
                    background:
                      "linear-gradient(135deg, hsla(41, 77%, 66%, 0.04), hsla(41, 77%, 66%, 0.08))",
                  }}
                />
              </div>
            )}

            {/* Message */}
            <div className="text-center space-y-6 mb-10">
              <p className="font-serif text-2xl text-foreground italic leading-relaxed tracking-tight">
                "{tag.message}"
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-px bg-gold/50" />
                <Heart className="w-4 h-4 text-gold fill-gold" />
                <div className="w-8 h-px bg-gold/50" />
              </div>
              <p className="text-gold font-serif text-xl">— {tag.sender_name}</p>
            </div>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-primary-foreground py-3 rounded-xl font-sans font-medium tracking-wide uppercase text-base text-center hover:bg-gold-dark transition-colors shadow-md"
              style={{
                letterSpacing: "0.08em",
                boxShadow: "0 2px 24px 0 rgba(212,175,55,0.15)",
              }}
            >
              Say Thank You 💬
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
