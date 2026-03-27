import BlogContent from "./BlogContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  
  try {
    const res = await fetch(`http://localhost:3000/api/v1/posts/${slug}`);
    const post = await res.json();
    
    return {
      title: `${post.title || 'Blog'} | Sameh Dheir`,
      description: post.summary || "Technical insights by Sameh Dheir",
    };
  } catch (e) {
    return { title: "Blog Post | Sameh Dheir" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogContent slug={slug} />;
}