import BlogContent from "./BlogContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// يفضل استخدام رابط الـ API الأساسي هنا
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-hyo9.onrender.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === "ar";

  try {
    // 1. تصحيح رابط الـ Fetch لمناداة الـ API
    const res = await fetch(`${API_BASE}/api/v1/posts/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Post not found");

    const post = await res.json();
    const siteName = isAr ? "سامح ضهير" : "Sameh Dheir";
    const defaultTitle = isAr ? "مدونة تقنية" : "Technical Blog";

    const title = post.title || defaultTitle;
    const description =
      post.description ||
      (isAr
        ? "مقالات تقنية في هندسة البرمجيات وتطوير الويب والذكاء الاصطناعي بواسطة سامح ضهير"
        : "Technical insights on software architecture, web development, and AI by Sameh Dheir");

    const imageUrl = post.coverImage || ""; 

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
        url: `https://sameh.dev/${locale}/blog/${slug}`,
        siteName: siteName,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
        locale: isAr ? "ar_EG" : "en_US",
        type: "article",
        publishedTime: post.createdAt,
        authors: ["Sameh Dheir"],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (e) {
    return {
      title: isAr ? "مقال | سامح ضهير" : "Post | Sameh Dheir",
      description: isAr ? "عرض المقال التقني" : "View technical article",
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