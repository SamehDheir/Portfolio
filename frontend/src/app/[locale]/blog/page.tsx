import { Metadata } from "next";
import BlogArchivePage from "./BlogArchivePage";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale,
    namespace: "Archive",
  });

  return {
    title: `${t("title")} | Sameh Dheir`,
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} | Sameh Dheir`,
      description: t("subtitle"),
      url: `https://sameh.dev/${locale}/blog`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  return <BlogArchivePage />;
} 