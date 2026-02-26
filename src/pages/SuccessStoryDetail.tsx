import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const SuccessStoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: story, isLoading } = useQuery({
    queryKey: ["success-story", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="container py-16 md:py-24 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Story Not Found</h1>
          <p className="text-muted-foreground mb-6">The story you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link to="/success-stories">Back to Success Stories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(story.title);

  return (
    <Layout>
      <article className="py-12 md:py-20">
        <div className="container max-w-3xl">
          <Link to="/success-stories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Success Stories
          </Link>

          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{story.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {format(new Date(story.created_at), "MMMM d, yyyy")}
            </span>
          </div>

          {story.photo_url && (
            <img
              src={story.photo_url}
              alt={story.title}
              className="w-full rounded-lg mb-8 object-cover max-h-96"
            />
          )}

          {story.video_url && (
            <video src={story.video_url} className="w-full rounded-lg mb-8" controls />
          )}

          {story.content ? (
            <div
              className="blog-content prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          ) : story.description ? (
            <p className="text-foreground/90 leading-relaxed">{story.description}</p>
          ) : null}

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm font-semibold mb-3">Share this story</p>
            <div className="flex gap-2">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">Facebook</a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">X / Twitter</a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default SuccessStoryDetail;
