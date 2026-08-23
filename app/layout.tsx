import './globals.css';

export const metadata = {
  title: 'Vercel + Datadog Demo',
  description: 'A beginner demo showing Vercel hosting and Datadog browser logs.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
