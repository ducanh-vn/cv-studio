import React from 'react';
import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/data';
import CVBuilderClient from '@/components/CVBuilderClient';

export const metadata: Metadata = {
  title: 'CV Studio — Professional CV & Resume Builder SaaS',
  description: 'Nền tảng tạo và xuất CV chuyên nghiệp với 14 mẫu giao diện chuẩn ATS, Tech Linter & phân tích JD Matcher.',
};

export const revalidate = 0; // Always fresh

export default function HomePage() {
  const portfolioData = getPortfolioData();

  return <CVBuilderClient initialPortfolio={portfolioData} />;
}
