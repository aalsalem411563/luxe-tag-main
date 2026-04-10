import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <Gift className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-serif text-4xl text-foreground mb-3">Smart Gift Tags</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Elegant NFC-powered gift messages for unforgettable moments.
        </p>
        <div className="w-16 h-px bg-primary mx-auto mb-8" />
        <Link
          to="/gift/demo"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-sans font-medium tracking-wide uppercase text-sm hover:bg-gold-light transition-colors"
        >
          Try a Demo Gift
        </Link>
      </div>
    </div>
  );
};

export default Index;
