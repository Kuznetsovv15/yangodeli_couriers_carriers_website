import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { CtaPromptRoot } from "@/components/modals/CtaPromptRoot";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { buildCtaInlineScript } from "@/lib/cta-inline-script";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const base = "https://yango-deli.co.il";

  return {
    metadataBase: new URL(base),
    title: messages.meta.title,
    description: messages.meta.description,
    icons: { icon: "/logos/favicon-32.png" },
    alternates: {
      canonical: `${base}/${locale}`,
      languages: {
        he: `${base}/he`,
        en: `${base}/en`,
        ru: `${base}/ru`,
      },
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: `${base}/${locale}`,
      siteName: "Yango Deli",
      locale,
      images: [{ url: "/logos/yango-deli-logo.png", width: 300, height: 300 }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "he" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} className="h-full">
      <body className="h-full antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: buildCtaInlineScript(),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <CtaPromptRoot />
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
