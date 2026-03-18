
-- Add missing storage policies (some already exist)
DO $$
BEGIN
  -- Try creating select policy
  BEGIN
    CREATE POLICY "Anyone can view clinic images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'clinic-images');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating update policy
  BEGIN
    CREATE POLICY "Admins can update clinic images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'clinic-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating delete policy
  BEGIN
    CREATE POLICY "Admins can delete clinic images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'clinic-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
