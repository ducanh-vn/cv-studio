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
      <body className="bg-[#090D16] text-[#f5f5f5] antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
