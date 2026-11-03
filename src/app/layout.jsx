import "@fontsource/quattrocento-sans/400.css";
import "@fontsource/quattrocento-sans/700.css";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";
import "../App.css";
import { SITE_URL } from "../lib/seo";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F43H1SG7V6"
        />
        <script
          id="google-analytics"
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
