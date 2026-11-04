import localFont from "next/font/local";
import Script from "next/script";
import "@fontsource/biz-udpmincho/latin-400.css";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";
import "../App.css";
import { SITE_URL } from "../lib/seo";

const bodyFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/quattrocento-sans/files/quattrocento-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/quattrocento-sans/files/quattrocento-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-quattrocento",
  display: "swap",
});

// oxlint-disable-next-line react/only-export-components
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pattoo Castle Jamaica",
    template: "%s | Pattoo Castle Jamaica",
  },
  description:
    "Discover Pattoo Castle, a private luxury villa in Negril, Jamaica with ocean views, refined stays, events, and Caribbean hospitality.",
  verification: {
    google: "1oJTxPPnigQjHFg-Dx7eafXrCFZnE9rmARE0sXjtprg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={bodyFont.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <link rel="preload" href="/fonts/denton-v1/regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-F43H1SG7V6"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F43H1SG7V6');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
