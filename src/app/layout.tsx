import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";
import { KopistoChatbot } from "@/components/kopisto/KopistoChatbot";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// خط Milan Display Black للنسخة العربية
const milanDisplay = localFont({
  src: "./fonts/Milan-Display-Black.otf",
  variable: "--font-milan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kopisto - ألعاب تعليمية للأطفال | Educational Games for Kids",
  description: "مغامرات تعليمية ممتعة مع كوبيستو! ألعاب تفاعلية تنمي مهارات طفلك في الرياضيات واللغة والعلوم بطريقة مرحة ومسلية.",
  keywords: ["كوبيستو", "Kopisto", "ألعاب تعليمية", "أطفال", "تعلم", "ترفيه", "educational games", "kids"],
  authors: [{ name: "Kopisto" }],
  icons: {
    icon: "/kopisto-small.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/kopisto-idle.webp" as="image" type="image/webp" />
        <link rel="preload" href="/kopisto-run.webp" as="image" type="image/webp" />
        <link rel="preload" href="/kopisto-idle-flip.webp" as="image" type="image/webp" />
        <link rel="preload" href="/kopisto-run-flip.webp" as="image" type="image/webp" />
      </head>
      <body
        className={`${fredoka.variable} ${milanDisplay.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: 'var(--font-milan), var(--font-fredoka), sans-serif' }}
      >
        <LanguageProvider>
          {children}
          <KopistoChatbot />
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
