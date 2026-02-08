import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Phone } from "lucide-react";
import { CLINIC } from "@/lib/constants";

const Blog = () => {
  const [search, setSearch] = useState("");

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = blogs?.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Insights</h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Educational articles and updates on fertility, reproductive health, and women&apos;s wellness.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="self-start md:self-auto border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </a>
            </Button>
          </div>
          <div className="mt-8 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-5 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/insights/${post.slug}`}>
                    <div className="aspect-video bg-muted">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {post.category && (
                        <>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {post.category}
                          </span>
                          <span>·</span>
                        </>
                      )}
                      <span>{post.publish_date}</span>
                      <span>·</span>
                      <span>{post.reading_time} min read</span>
                    </div>
                    <Link to={`/insights/${post.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="text-sm text-primary font-medium mt-3 inline-block hover:underline"
                    >
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {search ? "No articles found matching your search." : "No articles published yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
