
-- Create tags table
CREATE TABLE public.tags (
  id TEXT NOT NULL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'empty' CHECK (status IN ('empty', 'locked')),
  sender_name TEXT,
  message TEXT,
  image_url TEXT,
  creator_cookie TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags (needed for gift viewing)
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);

-- Anyone can update tags (anonymous users fill in gifts)
CREATE POLICY "Anyone can update tags" ON public.tags FOR UPDATE USING (true);

-- Anyone can insert tags
CREATE POLICY "Anyone can insert tags" ON public.tags FOR INSERT WITH CHECK (true);

-- Storage bucket for gift images
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-images', 'gift-images', true);

CREATE POLICY "Anyone can upload gift images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gift-images');

CREATE POLICY "Anyone can view gift images" ON storage.objects FOR SELECT USING (bucket_id = 'gift-images');
