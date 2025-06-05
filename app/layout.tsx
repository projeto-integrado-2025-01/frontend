import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'easyPay App',
  description: 'easyPay develpment',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
