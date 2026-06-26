import '@fontsource/quattrocento-sans/400.css'
import '@fontsource/quattrocento-sans/700.css'
import '../index.css'
import '../App.css'

// oxlint-disable-next-line react/only-export-components
export const metadata = {
  title: 'Pattoo Castle',
  description: 'A luxury Jamaican villa in Negril.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
