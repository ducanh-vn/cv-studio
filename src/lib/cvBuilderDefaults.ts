import type { PortfolioData } from '@/lib/data';
import type { CVData } from '@/types/cvBuilder';
import { DEFAULT_QR_CONFIG } from '@/lib/cvQRCode';

export function createDefaultCVData(initialPortfolio: PortfolioData): CVData {
  return {
    name: initialPortfolio.profile.name || 'Nguyễn Đức Anh',
    role: initialPortfolio.profile.role || 'Frontend & Fullstack Developer',
    email: initialPortfolio.profile.email || 'contact@ducanh.dev',
    phone: '+84 988 123 456',
    location: initialPortfolio.profile.location || 'Hà Nội, Việt Nam',
    github: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
    linkedin: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
    website: 'https://ducanh.dev',
    avatar: initialPortfolio.profile.avatar || '',
    showAvatar: true,
    summary:
      initialPortfolio.profile.bio ||
      'Lập trình viên Fullstack với hơn 2 năm kinh nghiệm thực chiến phát triển các ứng dụng web hiện đại. Thế mạnh cốt lõi gồm TypeScript, React, Next.js, Node.js và kiến trúc RESTful APIs phân tán. Đam mê tối ưu hiệu năng Frontend, trải nghiệm người dùng mượt mà và viết mã nguồn sạch sẽ, dễ bảo trì.',
    skills: [...initialPortfolio.skills],
    timeline: [...initialPortfolio.timeline],
    projects: [...initialPortfolio.projects],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách Khoa Hà Nội (HUST)',
        degree: 'Cử nhân Kỹ thuật Phần mềm / Công nghệ Thông tin',
        year: '2020 — 2024',
        desc: 'Tốt nghiệp loại Giỏi (GPA 3.6/4.0). Tập trung nghiên cứu về kiến trúc ứng dụng web phân tán và tối ưu hiệu năng Frontend.',
      },
    ],
    customSections: [
      {
        id: 'custom_cert',
        title: 'Chứng chỉ & Giải thưởng',
        titleEn: 'Certifications & Awards',
        type: 'list',
        items: [
          {
            id: 'cert-1',
            title: 'AWS Certified Solutions Architect – Associate',
            subtitle: 'Amazon Web Services (AWS)',
            date: '2024',
            desc: 'Chứng chỉ thiết kế kiến trúc đám mây an toàn, mở rộng và tối ưu chi phí.',
          },
          {
            id: 'cert-2',
            title: 'Giải Nhì – Cuộc thi Sáng tạo Công nghệ Trẻ Bách Khoa',
            subtitle: 'Đại học Bách Khoa Hà Nội',
            date: '2023',
            desc: 'Xây dựng giải pháp web quản lý thông minh với kiến trúc phân tán thời gian thực.',
          },
        ],
      },
    ],
    customLinks: [
      {
        id: 'link-gh',
        platform: 'github',
        label: 'github.com/ducanh-vn',
        url: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-in',
        platform: 'linkedin',
        label: 'linkedin.com/in/ducanh-vn',
        url: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-web',
        platform: 'website',
        label: 'ducanh.dev',
        url: 'https://ducanh.dev',
        enabled: true,
      },
      {
        id: 'link-lc',
        platform: 'leetcode',
        label: 'leetcode.com/ducanh',
        url: 'https://leetcode.com/ducanh',
        enabled: true,
      },
    ],
    qrConfig: { ...DEFAULT_QR_CONFIG },
  };
}

export function createDefaultEnglishCVData(initialPortfolio: PortfolioData): CVData {
  return {
    name: 'NGUYEN DUC ANH',
    role: 'Frontend & Fullstack Developer',
    email: initialPortfolio.profile.email || 'contact@ducanh.dev',
    phone: '+84 988 123 456',
    location: 'Hanoi, Vietnam',
    github: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
    linkedin: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
    website: 'https://ducanh.dev',
    avatar: initialPortfolio.profile.avatar || '',
    showAvatar: true,
    summary:
      'Passionate Software Engineer specialized in developing modern web applications. Core strengths include TypeScript, React, Next.js, Node.js, and distributed RESTful APIs. Dedicated to frontend performance engineering, fluid user experiences, and maintainable, scalable clean code.',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Tailwind CSS',
      'Docker',
      'RESTful API',
      'Socket.io',
      'Git / GitHub',
      'PostgreSQL',
      'MongoDB',
      'Redux / Zustand',
      'CI/CD Basics',
      'Vite',
      'Linux',
    ],
    timeline: [
      {
        id: '1',
        period: '2024 — PRESENT',
        role: 'Fullstack Web Developer',
        desc: 'Architected and engineered Nha Tro Pro (cloud boarding house management platform with TypeScript, React, and Tailwind) and real-time instant messaging Chat App.',
      },
      {
        id: '2',
        period: '2023 — 2024',
        role: 'Frontend & Backend Engineer',
        desc: 'Developed Fullstack Blog System (39+ commits featuring robust JWT authentication and RESTful APIs), e-commerce applications, and scalable backend microservices.',
      },
    ],
    projects: [
      {
        id: 'nhatropro',
        num: '01',
        title: 'Nha Tro Pro',
        category: 'Highlight Project',
        year: '2024',
        desc: 'Intelligent boarding room management platform featuring intuitive search filters, real-time occupancy monitoring, and optimized UX.',
        badges: ['TypeScript', 'React', 'Tailwind CSS', 'Vite', 'Vercel'],
        liveDemo: 'https://nhatropro-lldr.vercel.app',
        github: 'https://github.com/ducanh-vn/nhatropro',
        features: [
          {
            title: 'Dashboard & Room Management',
            detail: 'Track vacant rooms, tenant contracts, billing statements, and monthly utility readings.',
          },
          {
            title: 'Smart Filter & Location Search',
            detail: 'Instant filtering by geographic area, price range, and amenities with zero latency.',
          },
          {
            title: 'Fully Responsive UI',
            detail: 'Engineered seamless cross-device mobile, tablet, and desktop experiences with Tailwind CSS.',
          },
          {
            title: 'Strict TypeScript Architecture',
            detail: 'Type-safe code structure minimizing runtime errors and enhancing team maintainability.',
          },
        ],
      },
      {
        id: 'chatapp',
        num: '02',
        title: 'Real-time Chat App',
        category: 'Realtime App',
        year: '2024',
        desc: 'High-concurrency instant messaging web app with WebSocket streaming, live presence status, and an elegant conversational interface.',
        badges: ['React.js', 'Socket.io', 'Node.js', 'Vercel'],
        liveDemo: 'https://chat-app-snowy-sigma.vercel.app',
        github: 'https://github.com/ducanh-vn/chat-app',
        features: [
          {
            title: 'Real-time Socket.io Sync',
            detail: 'Instant bi-directional message synchronization across active clients without page reloads.',
          },
          {
            title: 'Live Presence & Typing Indicator',
            detail: 'Shows online/offline status and real-time typing indicators for connected peers.',
          },
          {
            title: 'Minimalist Chat Interface',
            detail: 'Distraction-free messaging layout designed for speed, clarity, and comfort.',
          },
        ],
      },
      {
        id: 'blog',
        num: '03',
        title: 'Fullstack Blog System',
        category: 'Fullstack API',
        year: '39 Commits',
        desc: 'End-to-end blogging platform supporting rich article authoring, secure JWT authentication, role-based access control, and clean RESTful API.',
        badges: ['Node.js', 'Express', 'JavaScript', 'REST API'],
        liveDemo: 'https://github.com/ducanh-vn/fullstack_blog_app',
        github: 'https://github.com/ducanh-vn/fullstack_blog_app',
        features: [
          {
            title: 'Secure Auth & RBAC',
            detail: 'Session tokens and JWT verification for author roles and administrative operations.',
          },
          {
            title: 'Complete Article CRUD',
            detail: 'Authoring, editing, category tagging, and publication lifecycle workflows.',
          },
          {
            title: '39+ Commits Development Log',
            detail: 'Demonstrates consistent code iteration, test coverage, and modular design.',
          },
        ],
      },
      {
        id: 'vanhoa',
        num: '04',
        title: 'Community Hall Manager',
        category: 'Management',
        year: '2026',
        desc: 'Enterprise management portal for community centers, coordinating departmental activities, event schedules, and public equipment inventory.',
        badges: ['TypeScript', 'React', 'Tailwind CSS'],
        liveDemo: 'https://github.com/ducanh-vn/quan-ly-nha-van-hoa',
        github: 'https://github.com/ducanh-vn/quan-ly-nha-van-hoa',
        features: [
          {
            title: 'Event Scheduling & Hall Booking',
            detail: 'Conflict-free community scheduling and automated room reservations.',
          },
          {
            title: 'Facility & Asset Inventory',
            detail: 'Auditing and monitoring of AV systems, seating, lighting, and shared facilities.',
          },
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Hanoi University of Science and Technology (HUST)',
        degree: 'Bachelor of Science in Software Engineering / Information Technology',
        year: '2020 — 2024',
        desc: 'Graduated with High Distinction (GPA 3.6/4.0). Specializing in distributed web architectures and frontend performance engineering.',
      },
    ],
    customSections: [
      {
        id: 'custom_cert',
        title: 'Certifications & Awards',
        titleEn: 'Certifications & Awards',
        type: 'list',
        items: [
          {
            id: 'cert-1',
            title: 'AWS Certified Solutions Architect – Associate',
            subtitle: 'Amazon Web Services (AWS)',
            date: '2024',
            desc: 'Certified in architecting distributed, resilient, and secure cloud systems.',
          },
          {
            id: 'cert-2',
            title: '2nd Place – HUST Student Innovation Hackathon',
            subtitle: 'Hanoi University of Science and Technology',
            date: '2023',
            desc: 'Architected high-concurrency smart management web platform with low latency.',
          },
        ],
      },
    ],
    customLinks: [
      {
        id: 'link-gh',
        platform: 'github',
        label: 'github.com/ducanh-vn',
        url: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-in',
        platform: 'linkedin',
        label: 'linkedin.com/in/ducanh-vn',
        url: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-web',
        platform: 'website',
        label: 'ducanh.dev',
        url: 'https://ducanh.dev',
        enabled: true,
      },
      {
        id: 'link-lc',
        platform: 'leetcode',
        label: 'leetcode.com/ducanh',
        url: 'https://leetcode.com/ducanh',
        enabled: true,
      },
    ],
    qrConfig: { ...DEFAULT_QR_CONFIG },
  };
}
