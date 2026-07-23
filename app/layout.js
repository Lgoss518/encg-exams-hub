export const metadata = {
  title: 'ENCG Exams Hub',
  description: 'Ressources académiques ENCG Casablanca',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
