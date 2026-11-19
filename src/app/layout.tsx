import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Studio — Professional CV & Resume Builder SaaS',
  description: 'Nền tảng tạo và xuất CV chuyên nghiệp với 14 mẫu giao diện chuẩn ATS, bộ chuẩn hóa Tech Linter & phân tích độ khớp JD.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Caveat:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        />
      </head>
      <body className="bg-[#090D16] text-[#f5f5f5] antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
