import { siteConfig } from "@/config/site";
import StoreProvider from "@/providers/StoreProvider";
import { THEME_KEY } from "@/config/theme";
import ThemeProvider from "@/providers/ThemeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    // Child pages set `title: "About"` and get "About | PixelGrade AI".
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: "/assets/main_logo.png",
    shortcut: "/assets/main_logo.png",
    apple: "/assets/main_logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the theme from the cookie so the server renders the correct theme
  // class AND antd (via AntdRegistry) inlines the matching CSS — no flash of
  // light inputs on reload while in dark mode. Dark is the default: the product
  // is designed dark, and only an explicit opt-out gives you light.
  const initialTheme =
    (await cookies()).get(THEME_KEY)?.value === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={initialTheme}
      style={{ colorScheme: initialTheme }}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AntdRegistry>
            <ThemeProvider initialTheme={initialTheme}>
              <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-black">
                {children}
              </div>
            </ThemeProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
