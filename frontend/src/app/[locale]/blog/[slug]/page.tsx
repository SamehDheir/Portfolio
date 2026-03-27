import BlogContent from "./BlogContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === "ar";

  try {
    const res = await fetch(`http://localhost:3000/api/v1/posts/${slug}`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) throw new Error("Post not found");
    
    const post = await res.json();
    const siteName = isAr ? "سامح ضهير" : "Sameh Dheir";
    const defaultTitle = isAr ? "مدونة تقنية" : "Technical Blog";

    // تحسين النصوص المعروضة في محركات البحث بناءً على اللغة
    const title = post.title || defaultTitle;
    const description = post.description || (isAr 
        ? "مقالات تقنية في هندسة البرمجيات وتطوير الويب والذكاء الاصطناعي بواسطة سامح ضهير" 
        : "Technical insights on software architecture, web development, and AI by Sameh Dheir");

    return {
      title: `${title} | ${siteName}`,
      description: description,
      alternates: {
        canonical: `/${locale}/blog/${slug}`,
        languages: {
          en: `/en/blog/${slug}`,
          ar: `/ar/blog/${slug}`,
        },
      },
      openGraph: {
        title: title,
        description: description,
        url: `https://sameh.dev/${locale}/blog/${slug}`, // يفضل وضع الـ domain الأساسي هنا
        siteName: siteName,
        images: post.coverImg ? [
          {
            url: `http://localhost:3000${post.coverImg}`,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
        locale: isAr ? "ar_EG" : "en_US",
        type: "article",
        publishedTime: post.createdAt,
        authors: ["Sameh Dheir"],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: post.coverImg ? [`http://localhost:3000${post.coverImg}`] : [],
      }
    };
  } catch (e) {
    return { 
      title: isAr ? "مقال | سامح ضهير" : "Post | Sameh Dheir",
      description: isAr ? "عرض المقال التقني" : "View technical article"
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  return (
    <main>
      <BlogContent slug={slug} />
    </main>
  );
}