import '@fontsource/quattrocento-sans/400.css'
import '@fontsource/quattrocento-sans/700.css'
import 'aos/dist/aos.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../index.css'
import '../App.css'
import { SITE_URL } from '../lib/seo'

// oxlint-disable-next-line react/only-export-components
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pattoo Castle Jamaica',
    template: '%s | Pattoo Castle Jamaica',
  },
  description:
    'Discover Pattoo Castle, a private luxury villa in Negril, Jamaica with ocean views, refined stays, events, and Caribbean hospitality.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
