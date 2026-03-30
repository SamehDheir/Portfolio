import { Metadata } from "next";
import BlogArchivePage from "./BlogArchivePage"; 
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Archive" });

  return {
    title: `${t("title")} | Sameh Dheir`,
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} | Sameh Dheir`,
      description: t("subtitle"),
      url: `https://sameh.dev/${params.locale}/blog`,
      type: "website",
    },
  };
}

export default function Page() {
  return <BlogArchivePage />;
}