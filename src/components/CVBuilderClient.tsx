'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Phone,
  Globe,
  Sparkles,
  Check,
  FileText,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  FolderGit2,
  Camera,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Type,
  Palette,
  Grid,
  Bold,
  Italic,
  Underline,
  List,
  SlidersHorizontal,
  Eye,
  EyeOff,
  GripVertical,
  LayoutTemplate,
  X,
  Layers,
  CheckCircle2,
  Clock,
  Award,
  Terminal,
  Save,
  Loader2,
  Upload,
  Minimize2,
  Maximize2,
  FileJson,
  FileDown,
  FileUp,
  Copy,
  Database,
  AlertCircle,
  Lightbulb,
  Search,
  Gauge,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Target,
  Undo2,
  Redo2,
  FileEdit,
  Sliders,
  PlusCircle,
  Globe2,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Building,
  RefreshCw,
  QrCode,
  ExternalLink,
  Share2,
  PhoneCall,
  Link as LinkIcon,
  Send,
  Wand2,
  CheckCheck,
  SpellCheck,
  Zap,
} from 'lucide-react';
import {
  exportCVToImage,
  ImageExportFormat,
  ExportResolution,
} from '@/lib/exportImage';
import {
  CVProfile,
  loadProfilesFromStorage,
  saveProfilesToStorage,
  duplicateCVProfile,
  createNewCVProfile,
} from '@/lib/cvProfiles';
import { PortfolioData, ProjectItem, TimelineItem } from '@/lib/data';
import {
  BULLET_CATEGORIES,
  TECH_BULLET_POINTS,
  TechBulletPoint,
} from '@/lib/techBulletPoints';
import { evaluateCVStrength, CVStrengthEvaluation, ChecklistItem } from '@/lib/cvStrength';
import {
  analyzeJDMatch,
  JDMatchResult,
  SAMPLE_JDS,
  SampleJD,
  TECH_CATEGORY_META,
  TechCategory,
  MatchedKeyword,
  MissingKeyword,
} from '@/lib/jdMatcher';
import {
  CustomTechLink,
  TechLinkPlatform,
  PlatformMeta,
  TECH_PLATFORM_META,
  POPULAR_LINK_PRESETS,
  detectLinkPlatform,
  ensureCustomLinks,
  getActiveTechLinks,
  formatLinkDisplay,
} from '@/lib/customTechLinks';
import TechLinkIcon from '@/components/TechLinkIcon';
import { ParsedCVResult, SAMPLE_CV_TEXTS } from '@/lib/cvParser';
import CoverLetterCanvas from '@/components/CoverLetterCanvas';
import {
  CoverLetterData,
  CoverLetterPreset,
  COVER_LETTER_PRESETS,
  createSyncedCoverLetter,
  DEFAULT_COVER_LETTER_VI,
  DEFAULT_COVER_LETTER_EN,
} from '@/lib/coverLetter';
import {
  CVQRConfig,
  QRPosition,
  QRColorMode,
  DEFAULT_QR_CONFIG,
  ensureQRConfig,
  getQRTargetText,
  generateQRDataUrl,
  getDefaultQRLabel,
} from '@/lib/cvQRCode';
import CVQRCodeBlock, { CVQRCodeFooter } from '@/components/CVQRCodeBlock';
import {
  lintCVTechnologies,
  TechLintIssue,
  lintAndFormatText,
  normalizeSingleSkill,
  TECH_STANDARDS_REGISTRY,
  safeReplaceTechName,
  sanitizeCVTechStuttering,
} from '@/lib/techLinter';
import {
  CVTypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  COMPACT_TYPOGRAPHY_PRESET,
  SPACIOUS_TYPOGRAPHY_PRESET,
} from '@/lib/cvTypography';
import { CVTypographySliders } from '@/components/CVTypographySliders';

import type {
  EducationItem,
  StandardSectionKey,
  SectionKey,
  CustomSectionItem,
  CanvasBgThemeId,
  CanvasBgThemeOption,
  CustomSection,
  CustomSectionPreset,
  SectionMetaItem,
  CVData,
  TemplateId,
  Language,
  CVFontFamily,
  CVFontOption,
  CVSnapshot,
  TemplateDef,
  CVBuilderClientProps,
} from '@/types/cvBuilder';

import {
  CANVAS_BG_THEMES,
  CUSTOM_SECTION_PRESETS,
  CV_SECTIONS,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  CV_FONT_OPTIONS,
  TEMPLATES_COLLECTION,
} from '@/constants/cvConstants';

import { cvTranslations } from '@/data/cvTranslations';
import { formatPeriod } from '@/lib/cvFormatters';

export type {
  EducationItem,
  StandardSectionKey,
  SectionKey,
  CustomSectionItem,
  CanvasBgThemeId,
  CanvasBgThemeOption,
  CustomSection,
  CustomSectionPreset,
  SectionMetaItem,
  CVData,
  TemplateId,
  Language,
  CVFontFamily,
  CVFontOption,
  CVSnapshot,
  TemplateDef,
  CVBuilderClientProps,
};

export {
  CANVAS_BG_THEMES,
  CUSTOM_SECTION_PRESETS,
  CV_SECTIONS,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  CV_FONT_OPTIONS,
  TEMPLATES_COLLECTION,
  cvTranslations,
  formatPeriod,
};

import {
  CVReadOnlyContext,
  InlineEditable,
  CVSkeletonLoading,
  ItemControls,
  AvatarBlock,
  CustomSectionRenderer,
} from '@/components/canvas';

export {
  CVReadOnlyContext,
  InlineEditable,
  CVSkeletonLoading,
  ItemControls,
  AvatarBlock,
  CustomSectionRenderer,
};

import {
  printDocument,
  generateExportFileName,
  exportDocumentImage,
} from '@/lib/cvExport';

import {
  createFullBackupPayload,
  createSingleProfileBackupPayload,
  downloadJsonFile,
  copyJsonToClipboard,
  readJsonFile,
  parseImportJsonString,
  type ImportPreviewResult,
} from '@/lib/cvBackup';

import {
  formatDateStamp,
  sanitizeFileName,
} from '@/lib/cvFormatters';

export {
  printDocument,
  generateExportFileName,
  exportDocumentImage,
  createFullBackupPayload,
  createSingleProfileBackupPayload,
  downloadJsonFile,
  copyJsonToClipboard,
  readJsonFile,
  parseImportJsonString,
  formatDateStamp,
  sanitizeFileName,
};
export type { ImportPreviewResult };

import {
  RabbitTemplate,
  CascadeTemplate,
  ChickenTemplate,
  IconicTemplate,
  DeckerTemplate,
  BubblesTemplate,
  BasicTemplate,
  CrispTemplate,
  EnfoldTemplate,
  EditorialTemplate,
  CVTemplateSwitch,
  type CVTemplateProps,
  type CVTemplateSwitchProps,
} from '@/components/templates';

export {
  RabbitTemplate,
  CascadeTemplate,
  ChickenTemplate,
  IconicTemplate,
  DeckerTemplate,
  BubblesTemplate,
  BasicTemplate,
  CrispTemplate,
  EnfoldTemplate,
  EditorialTemplate,
  CVTemplateSwitch,
};
export type { CVTemplateProps, CVTemplateSwitchProps };

import {
  TemplateGalleryModal,
  CVParserModal,
  NewProfileModal,
  DataBackupModal,
  TechBulletsModal,
  CVStrengthModal,
  JDMatcherModal,
  TechLinterModal,
  PublicShareModal,
  ContactCandidateModal,
  MobileQRModal,
} from '@/components/modals';

export {
  TemplateGalleryModal,
  CVParserModal,
  NewProfileModal,
  DataBackupModal,
  TechBulletsModal,
  CVStrengthModal,
  JDMatcherModal,
  TechLinterModal,
  PublicShareModal,
  ContactCandidateModal,
  MobileQRModal,
};

import { RecruiterTopbar, EditorTopbar } from '@/components/topbar';
import {
  SidebarRail,
  DesignTab,
  ContentTab,
  LayoutTab,
  AiAtsTab,
  DataTab,
  CoverLetterTab,
} from '@/components/sidebar';

export {
  RecruiterTopbar,
  EditorTopbar,
  SidebarRail,
  DesignTab,
  ContentTab,
  LayoutTab,
  AiAtsTab,
  DataTab,
  CoverLetterTab,
};

export default function CVBuilderClient({
  initialPortfolio,
  isPublicView = false,
}: CVBuilderClientProps) {
  // Initial default CV data
  const defaultCVData: CVData = {
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

  const defaultEnglishCVData: CVData = {
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

  // Bilingual State (VI ⟷ EN)
  const [lang, setLang] = useState<Language>('vi');
  const [cvVi, setCvVi] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));
  const [cvEn, setCvEn] = useState<CVData>(() => sanitizeCVTechStuttering(defaultEnglishCVData));
  const [rawCv, setCvState] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));

  // Public Share & Recruiter Mode States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareLinkEnabled, setIsShareLinkEnabled] = useState(true);
  const [shareQrDataUrl, setShareQrDataUrl] = useState('');
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPublicQrModalOpen, setIsPublicQrModalOpen] = useState(false);
  const [privacyHidePhone, setPrivacyHidePhone] = useState(false);
  const [privacyHideLocation, setPrivacyHideLocation] = useState(false);
  const [shareAllowDownload, setShareAllowDownload] = useState(true);
  const [shareIncludeCoverLetter, setShareIncludeCoverLetter] = useState(true);
  const [publicTemplateMenuOpen, setPublicTemplateMenuOpen] = useState(false);
  const [shareOrigin, setShareOrigin] = useState('');
  const shareModalRef = useRef<HTMLDivElement>(null);

  // Memoized CV with privacy masking for public view
  const cv = useMemo(() => {
    if (!isPublicView) return rawCv;
    return {
      ...rawCv,
      phone: privacyHidePhone
        ? (lang === 'en' ? '+84 ••• ••• ••• (Hidden for privacy)' : '+84 ••• ••• ••• (Bảo mật riêng tư)')
        : rawCv.phone,
      location: privacyHideLocation
        ? (lang === 'en' ? 'Vietnam (Relocation available)' : 'Việt Nam')
        : rawCv.location,
    };
  }, [rawCv, isPublicView, privacyHidePhone, privacyHideLocation, lang]);

  // Wrapper for setCv that keeps both active state and corresponding language profile in sync
  const setCv = (updater: CVData | ((prev: CVData) => CVData)) => {
    setCvState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (lang === 'vi') {
        setCvVi(next);
      } else {
        setCvEn(next);
      }
      return next;
    });
  };

  const t = cvTranslations[lang];

  // Language Switcher Handler
  const handleSwitchLanguage = (newLang: Language) => {
    if (newLang === lang) return;
    if (newLang === 'en') {
      setCvVi(rawCv);
      setCvState(cvEn);
      setLang('en');
      if (selectedSampleJdId) {
        const found = SAMPLE_JDS.find((s) => s.id === selectedSampleJdId);
        if (found) setJdInputText(found.descriptionEn);
      }
      setToastMessage('Đã chuyển sang CV Tiếng Anh (English CV)!');
    } else {
      setCvEn(rawCv);
      setCvState(cvVi);
      setLang('vi');
      if (selectedSampleJdId) {
        const found = SAMPLE_JDS.find((s) => s.id === selectedSampleJdId);
        if (found) setJdInputText(found.descriptionVi);
      }
      setToastMessage('Đã chuyển sang CV Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLang = () => {
    handleSwitchLanguage(lang === 'vi' ? 'en' : 'vi');
  };

  // Quick sync contact info between language profiles
  const syncContactInfoBetweenLangs = () => {
    if (lang === 'vi') {
      setCvEn((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Anh!');
    } else {
      setCvVi((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [template, setTemplate] = useState<TemplateId>('rabbit');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'popular' | 'sidebar' | 'ats' | 'creative'>('all');
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'data'>('profile');

  // Matching Cover Letter State
  const [docMode, setDocMode] = useState<'cv' | 'cover_letter'>('cv');
  const [coverLetterVi, setCoverLetterVi] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('vi', defaultCVData)
  );
  const [coverLetterEn, setCoverLetterEn] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('en', defaultEnglishCVData)
  );
  const [activeCoverLetterPresetId, setActiveCoverLetterPresetId] = useState<string>('frontend-focus');
  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState<boolean>(false);
  const currentCoverLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;

  // Tech Nomenclature Linter & Auto-Capitalize State
  const [showTechLinterModal, setShowTechLinterModal] = useState(false);
  const [techLinterFilter, setTechLinterFilter] = useState<'all' | 'skills' | 'timeline' | 'projects' | 'summary' | 'custom' | 'cover_letter'>('all');
  const [techLinterCategory, setTechLinterCategory] = useState<string>('all');
  const [techLinterActiveTab, setTechLinterActiveTab] = useState<'issues' | 'playground' | 'registry'>('issues');
  const [techRegistrySearch, setTechRegistrySearch] = useState('');
  const [playgroundInput, setPlaygroundInput] = useState('Em co kinh nghiem su dung nodejs, reactjs, typescript va viet restful apis tren github.');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [playgroundReplacements, setPlaygroundReplacements] = useState<{ original: string; replacement: string; def: any }[]>([]);
  const [autoLintOnSave, setAutoLintOnSave] = useState(true);
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());

  // JSON Data Management State (Export & Import)
  const [showDataModal, setShowDataModal] = useState(false);
  const [dataModalTab, setDataModalTab] = useState<'export' | 'import'>('export');
  const [importPreview, setImportPreview] = useState<{
    type: 'full' | 'single';
    data: any;
    meta?: any;
    summary: {
      name?: string;
      role?: string;
      hasVi?: boolean;
      hasEn?: boolean;
      viName?: string;
      enName?: string;
      template?: string;
      timelineCount: number;
      projectsCount: number;
      skillsCount: number;
      eduCount: number;
    };
  } | null>(null);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Tech Bullet Points Library Modal State
  const [showTechModal, setShowTechModal] = useState(false);
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>('all');
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [techTarget, setTechTarget] = useState<{ type: 'timeline' | 'project'; id: string; title?: string } | null>(null);
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [insertedBulletId, setInsertedBulletId] = useState<string | null>(null);

  // CV Strength & ATS Checklist State
  const [showStrengthModal, setShowStrengthModal] = useState(false);
  const [strengthFilter, setStrengthFilter] = useState<'all' | 'pending' | 'passed'>('all');

  // Compute live CV Strength evaluation
  const cvStrength = useMemo(() => evaluateCVStrength(cv, lang), [cv, lang]);

  // JD Matcher & Keyword Gap State
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedSampleJdId, setSelectedSampleJdId] = useState<string | null>(SAMPLE_JDS[0].id);
  const [jdInputText, setJdInputText] = useState(SAMPLE_JDS[0].descriptionVi);
  const [jdFilter, setJdFilter] = useState<'all' | 'missing' | 'matched'>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [addedSkillKeyword, setAddedSkillKeyword] = useState<string | null>(null);

  // Compute live JD Match evaluation
  const jdMatchResult = useMemo(
    () => analyzeJDMatch(jdInputText, cv, lang),
    [jdInputText, cv, lang]
  );

  // Compute live Tech Nomenclature Lint Report
  const techLintReport = useMemo(() => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    // Filter out user-ignored issues
    const filteredIssues = rawReport.issues.filter((iss) => !ignoredIssueIds.has(iss.id));
    return {
      ...rawReport,
      totalIssuesCount: filteredIssues.length,
      issues: filteredIssues,
    };
  }, [cv, docMode, lang, coverLetterVi, coverLetterEn, ignoredIssueIds]);

  // Fix All Tech Issues in 1-Click
  const handleFixAllTechIssues = () => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    const count = rawReport.totalIssuesCount;
    if (count === 0) return;

    setCv(rawReport.cleanCv);
    if (docMode === 'cover_letter' && rawReport.cleanCoverLetter) {
      if (lang === 'vi') {
        setCoverLetterVi(rawReport.cleanCoverLetter);
      } else {
        setCoverLetterEn(rawReport.cleanCoverLetter);
      }
    }

    setIgnoredIssueIds(new Set());
    setToastMessage(
      lang === 'en'
        ? `Successfully standardized ${count} tech brand names!`
        : `Đã chuẩn hóa thành công ${count} danh pháp công nghệ theo chuẩn quốc tế!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fix Single Issue
  const handleFixSingleTechIssue = (issue: TechLintIssue) => {
    if (issue.section === 'skills') {
      setCv((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s === issue.original ? issue.replacement : s)),
      }));
    } else if (issue.section === 'summary') {
      setCv((prev) => ({
        ...prev,
        summary: safeReplaceTechName(prev.summary, issue.original, issue.replacement),
      }));
    } else if (issue.section === 'timeline') {
      setCv((prev) => ({
        ...prev,
        timeline: prev.timeline.map((item) => {
          if (item.id !== issue.targetId) return item;
          return {
            ...item,
            role: issue.field === 'role' ? safeReplaceTechName(item.role, issue.original, issue.replacement) : item.role,
            desc: issue.field === 'desc' ? safeReplaceTechName(item.desc, issue.original, issue.replacement) : item.desc,
          };
        }),
      }));
    } else if (issue.section === 'projects') {
      setCv((prev) => ({
        ...prev,
        projects: prev.projects.map((proj) => {
          if (proj.id !== issue.targetId) return proj;
          if (issue.field === 'badges') {
            return {
              ...proj,
              badges: proj.badges.map((b) => (b === issue.original ? issue.replacement : b)),
            };
          }
          if (issue.field === 'desc') {
            return {
              ...proj,
              desc: safeReplaceTechName(proj.desc, issue.original, issue.replacement),
            };
          }
          if (issue.field === 'features' && proj.features) {
            return {
              ...proj,
              features: proj.features.map((f) => ({
                title: safeReplaceTechName(f.title, issue.original, issue.replacement),
                detail: safeReplaceTechName(f.detail, issue.original, issue.replacement),
              })),
            };
          }
          return proj;
        }),
      }));
    } else if (issue.section === 'custom') {
      setCv((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((sec) => {
          if (sec.id === issue.targetId && issue.field === 'content' && sec.content) {
            return { ...sec, content: safeReplaceTechName(sec.content, issue.original, issue.replacement) };
          }
          if (sec.items) {
            return {
              ...sec,
              items: sec.items.map((it) => (it.id === issue.targetId ? { ...it, desc: safeReplaceTechName(it.desc || '', issue.original, issue.replacement) } : it)),
            };
          }
          return sec;
        }),
      }));
    } else if (issue.section === 'cover_letter' && issue.field) {
      if (lang === 'vi') {
        setCoverLetterVi((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      } else {
        setCoverLetterEn((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      }
    }

    setToastMessage(
      lang === 'en'
        ? `Standardized: "${issue.original}" ➔ "${issue.replacement}"`
        : `Đã chuẩn hóa: "${issue.original}" ➔ "${issue.replacement}"`
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleIgnoreTechIssue = (issueId: string) => {
    setIgnoredIssueIds((prev) => new Set([...Array.from(prev), issueId]));
  };

  // Quick 1-Click Normalization for Skills in Drawer
  const handleQuickLintSkills = () => {
    const nextSkills = cv.skills.map((s) => normalizeSingleSkill(s).normalized);
    setCv((prev) => ({ ...prev, skills: nextSkills }));
    setToastMessage(lang === 'en' ? 'Standardized all skill names!' : 'Đã chuẩn hóa toàn bộ danh pháp trong mục Kỹ năng!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Playground tester
  const handleRunPlayground = () => {
    if (!playgroundInput.trim()) return;
    const { cleanText, replacements } = lintAndFormatText(playgroundInput);
    setPlaygroundOutput(cleanText);
    setPlaygroundReplacements(replacements);
  };

  const handleSelectSampleJD = (sample: SampleJD) => {
    setSelectedSampleJdId(sample.id);
    setJdInputText(lang === 'en' ? sample.descriptionEn : sample.descriptionVi);
  };

  const handleAddKeywordToSkills = (keywordName: string) => {
    if (!cv.skills.some((s) => s.toLowerCase() === keywordName.toLowerCase())) {
      const nextSkills = [...cv.skills, keywordName];
      setCv((prev) => ({ ...prev, skills: nextSkills }));
      setAddedSkillKeyword(keywordName);
      setTimeout(() => setAddedSkillKeyword(null), 2000);
      setToastMessage(lang === 'en' ? `Added "${keywordName}" to Skills` : `Đã thêm "${keywordName}" vào mục Kỹ năng`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleCopyKeyword = (keywordName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(keywordName);
      setCopiedKeyword(keywordName);
      setTimeout(() => setCopiedKeyword(null), 2000);
    }
  };

  // Custom Tech Links Action Handlers
  const handleAddCustomLink = (platform?: TechLinkPlatform, presetUrl?: string, presetLabel?: string) => {
    const p = platform || 'website';
    const newId = `link-${Date.now()}`;
    const meta = TECH_PLATFORM_META[p];
    const newLink: CustomTechLink = {
      id: newId,
      platform: p,
      url: presetUrl || (meta ? (meta.placeholder.startsWith('http') ? meta.placeholder : `https://${meta.placeholder}`) : 'https://'),
      label: presetLabel || (meta ? meta.defaultLabel : 'Link'),
      enabled: true,
    };
    const currentLinks = ensureCustomLinks(cv);
    setCv({ ...cv, customLinks: [...currentLinks, newLink] });
    setToastMessage(lang === 'en' ? `Added ${meta?.name || p} link` : `Đã thêm liên kết ${meta?.name || p}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleUpdateCustomLink = (id: string, updates: Partial<CustomTechLink>) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => {
      if (l.id !== id) return l;
      const next = { ...l, ...updates };
      if (updates.url && !updates.platform) {
        const detected = detectLinkPlatform(updates.url);
        if (detected !== 'custom' && detected !== l.platform) {
          next.platform = detected;
        }
        const pMeta = TECH_PLATFORM_META[next.platform];
        if (!updates.label && (!l.label || l.label === pMeta?.defaultLabel)) {
          next.label = formatLinkDisplay(updates.url, next.platform);
        }
      }
      return next;
    });
    setCv({ ...cv, customLinks: updated });
  };

  const handleToggleCustomLink = (id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setCv({ ...cv, customLinks: updated });
  };

  const handleRemoveCustomLink = (id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.filter((l: CustomTechLink) => l.id !== id);
    setCv({ ...cv, customLinks: updated });
  };

  const handleMoveCustomLink = (index: number, direction: 'up' | 'down') => {
    const currentLinks = ensureCustomLinks(cv);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentLinks.length) return;
    const copy = [...currentLinks];
    const [removed] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, removed);
    setCv({ ...cv, customLinks: copy });
  };

  // Style Settings
  const [accentColor, setAccentColor] = useState<'blue' | 'yellow' | 'emerald' | 'slate' | 'rose'>('blue');
  const [fontFamily, setFontFamily] = useState<CVFontFamily>('inter');
  const [zoom, setZoom] = useState<number>(90);

  // Canvas Workspace Background Theme State (Figma Dot Grid, Portfolio Luxury, etc.)
  const [canvasBgTheme, setCanvasBgTheme] = useState<CanvasBgThemeId>('figma-dots');
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const bgPickerRef = useRef<HTMLDivElement>(null);

  // Load saved canvas background preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cv_canvas_bg_theme') as CanvasBgThemeId | null;
      if (saved && CANVAS_BG_THEMES.some((t) => t.id === saved)) {
        setCanvasBgTheme(saved);
      }
    }
  }, []);

  // Close bg picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bgPickerRef.current && !bgPickerRef.current.contains(e.target as Node)) {
        setIsBgPickerOpen(false);
      }
    };
    if (isBgPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBgPickerOpen]);

  const handleSelectCanvasBgTheme = (themeId: CanvasBgThemeId) => {
    setCanvasBgTheme(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_canvas_bg_theme', themeId);
    }
  };

  const currentCanvasBg = useMemo(() => {
    return CANVAS_BG_THEMES.find((t) => t.id === canvasBgTheme) || CANVAS_BG_THEMES[0];
  }, [canvasBgTheme]);
  const [newSkillText, setNewSkillText] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // 1-Page Fit / Compact Mode State
  const [isCompact, setIsCompact] = useState(false);

  // Fine-grain Typography & Margins Config State
  const [typographyConfig, setTypographyConfig] = useState<CVTypographyConfig>(DEFAULT_TYPOGRAPHY_CONFIG);

  // Load saved typography from localStorage on mount (hydration safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ducanh_cv_typography_config');
      if (saved) {
        try {
          setTypographyConfig({ ...DEFAULT_TYPOGRAPHY_CONFIG, ...JSON.parse(saved) });
        } catch (e) {}
      }
    }
  }, []);

  // Sync typography to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ducanh_cv_typography_config', JSON.stringify(typographyConfig));
    }
  }, [typographyConfig]);

  // Section Reordering and Visibility State
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(DEFAULT_SECTION_VISIBILITY);

  // Section Navigation Horizontal Scroll State & Ref
  const sectionTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkSectionTabsScroll = () => {
    if (!sectionTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sectionTabsRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const handleScrollSectionTabs = (direction: 'left' | 'right') => {
    if (!sectionTabsRef.current) return;
    const offset = direction === 'left' ? -140 : 140;
    sectionTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkSectionTabsScroll, 250);
  };

  const handleSectionTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!sectionTabsRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      sectionTabsRef.current.scrollLeft += e.deltaY;
      checkSectionTabsScroll();
    }
  };

  const moveSection = (key: SectionKey, direction: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(key);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
    setToastMessage(lang === 'en' ? 'Section order updated' : 'Đã thay đổi thứ tự mục');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleSectionVisibility = (key: SectionKey) => {
    setSectionVisibility((prev) => {
      const nextVisible = !prev[key];
      const next = { ...prev, [key]: nextVisible };
      const meta = CV_SECTIONS.find((s) => s.key === key);
      const name = lang === 'en' ? meta?.labelEn : meta?.labelVi;
      setToastMessage(
        nextVisible
          ? `${name}: ${lang === 'en' ? 'Visible' : 'Đang hiển thị'}`
          : `${name}: ${lang === 'en' ? 'Hidden' : 'Đã ẩn'}`
      );
      setTimeout(() => setToastMessage(null), 2000);
      return next;
    });
  };

  const resetSections = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setSectionVisibility(DEFAULT_SECTION_VISIBILITY);
    setToastMessage(lang === 'en' ? 'Sections reset to default' : 'Đã khôi phục thứ tự các mục mặc định');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Modern Canva/Figma Layout State
  const [activeRailTab, setActiveRailTab] = useState<'design' | 'content' | 'layout' | 'ai-ats' | 'data' | 'cover_letter'>('design');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [contentSubTab, setContentSubTab] = useState<string>('profile');
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  useEffect(() => {
    if (activeRailTab === 'content') {
      const timer = setTimeout(() => {
        checkSectionTabsScroll();
        if (sectionTabsRef.current) {
          const activeEl = sectionTabsRef.current.querySelector<HTMLElement>('[data-active="true"]');
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [drawerTab, activeRailTab]);

  useEffect(() => {
    const handleResize = () => checkSectionTabsScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persistence & Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo History State (Snapshots of full CV & Design state)
  const [undoHistory, setUndoHistory] = useState<CVSnapshot[]>([
    {
      cv: defaultCVData,
      template: 'rabbit',
      accentColor: 'blue',
      fontFamily: 'inter',
      isCompact: false,
      sectionOrder: DEFAULT_SECTION_ORDER,
      sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    },
  ]);
  const [undoHistoryIndex, setUndoHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Export High-Res Image & Document Hub State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportResolution, setExportResolution] = useState<ExportResolution>(2);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  // Multiple CV Profiles State
  const [profiles, setProfiles] = useState<CVProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState<string>('');
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState('');
  const [newProfileCloneFromCurrent, setNewProfileCloneFromCurrent] = useState(true);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const lastRecordedSnapRef = useRef<string>('');

  // CV Parser / PDF & Doc Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'upload' | 'paste' | 'sample'>('upload');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importRawText, setImportRawText] = useState('');
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedCVResult | null>(null);
  const [importPreviewTab, setImportPreviewTab] = useState<'profile' | 'skills' | 'timeline' | 'projects' | 'education'>('profile');
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Personal Dynamic QR Code DataURL State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrCopied, setQrCopied] = useState<boolean>(false);

  // Continuous History Recording Engine
  useEffect(() => {
    if (isLoading) return;

    const currentSnap: CVSnapshot = {
      cv,
      template,
      accentColor,
      fontFamily,
      isCompact,
      typography: typographyConfig,
      sectionOrder,
      sectionVisibility,
    };
    const snapStr = JSON.stringify(currentSnap);

    // Initial snapshot once loaded
    if (!lastRecordedSnapRef.current) {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory([currentSnap]);
      setUndoHistoryIndex(0);
      return;
    }

    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      lastRecordedSnapRef.current = snapStr;
      return;
    }

    if (snapStr === lastRecordedSnapRef.current) return;

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    // Debounce: 400ms so typing text groups into coherent undo units
    historyTimeoutRef.current = setTimeout(() => {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory((prevHistory) => {
        const currentSlice = prevHistory.slice(0, undoHistoryIndex + 1);
        const updated = [...currentSlice, currentSnap];
        if (updated.length > 50) updated.shift();
        return updated;
      });
      setUndoHistoryIndex((prevIdx) => {
        return Math.min(prevIdx + 1, 49);
      });
    }, 400);

    return () => {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    };
  }, [cv, template, accentColor, fontFamily, isCompact, typographyConfig, sectionOrder, sectionVisibility, isLoading, undoHistoryIndex]);

  const handleUndo = () => {
    if (undoHistoryIndex > 0) {
      const prevIdx = undoHistoryIndex - 1;
      const snap = undoHistory[prevIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(prevIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Undo applied (Ctrl+Z)' : 'Đã hoàn tác (Ctrl+Z)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleRedo = () => {
    if (undoHistoryIndex < undoHistory.length - 1) {
      const nextIdx = undoHistoryIndex + 1;
      const snap = undoHistory[nextIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(nextIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Redo applied (Ctrl+Y)' : 'Đã làm lại (Ctrl+Y)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Listen to keyboard shortcuts (Escape to exit preview, Ctrl+Z / Ctrl+Y for undo/redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPreviewMode) setIsPreviewMode(false);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, undoHistoryIndex, undoHistory, lang]);

  const toggleCompactMode = () => {
    const next = !isCompact;
    setIsCompact(next);
    if (next) {
      setTypographyConfig(COMPACT_TYPOGRAPHY_PRESET);
    } else {
      setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
    }
    setToastMessage(next ? (lang === 'en' ? 'Fit 1-Page mode enabled!' : 'Đã bật chế độ Vừa khít 1 trang A4 (Compact)!') : (lang === 'en' ? 'Standard mode enabled' : 'Đã chuyển sang chế độ Tiêu chuẩn'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Spacing Density Config (Normal vs Compact 1-Page Fit)
  const pad = {
    header: isCompact ? 'py-4 px-6' : 'p-8',
    body: isCompact ? 'p-5' : 'p-8',
    sectionGap: isCompact ? 'space-y-3.5' : 'space-y-6',
    itemGap: isCompact ? 'space-y-2' : 'space-y-4',
    itemSubGap: isCompact ? 'space-y-0.5' : 'space-y-1',
    cardPad: isCompact ? 'p-2.5' : 'p-3',
    gridGap: isCompact ? 'gap-5' : 'gap-8',
    textDesc: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    textSummary: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    timelineLine: isCompact ? 'space-y-3.5' : 'space-y-5',
    sidebarPad: isCompact ? 'p-5 space-y-4' : 'p-7 space-y-6',
  };

  // Hidden Avatar File Input Ref
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality square center crop & compression to max 500x500
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
        const width = img.width;
        const height = img.height;
        const minDimension = Math.min(width, height);
        const startX = (width - minDimension) / 2;
        const startY = (height - minDimension) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, MAX_SIZE, MAX_SIZE);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setCv((prev) => ({
            ...prev,
            avatar: dataUrl,
            showAvatar: true,
          }));
          setToastMessage('Đã tải lên và cập nhật ảnh thẻ mới thành công!');
          setTimeout(() => setToastMessage(null), 3500);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setCv((prev) => ({ ...prev, avatar: '' }));
    setToastMessage('Đã gỡ ảnh thẻ.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Export Full Multi-Language CV Package (.json)
  const handleExportFullJSON = () => {
    const payload = createFullBackupPayload({
      cv,
      cvVi,
      cvEn,
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
    });
    const dateStr = formatDateStamp();
    downloadJsonFile(payload, `cv-full-backup-${dateStr}.json`);
    setToastMessage(lang === 'en' ? 'Exported full CV backup (.json) successfully!' : 'Đã xuất trọn gói dữ liệu CV (.json) thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Export Active Language Profile Only (.json)
  const handleExportCurrentProfileJSON = () => {
    const payload = createSingleProfileBackupPayload({
      cv,
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
    });
    const dateStr = formatDateStamp();
    const safeName = (cv.name || 'cv').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadJsonFile(payload, `cv-${lang}-${safeName}-${dateStr}.json`);
    setToastMessage(lang === 'en' ? `Exported ${lang.toUpperCase()} CV profile (.json) successfully!` : `Đã xuất hồ sơ CV ${lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'} (.json) thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. Copy JSON to Clipboard
  const handleCopyJSON = async () => {
    const payload = createFullBackupPayload({
      cv,
      cvVi,
      cvEn,
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
    });
    await copyJsonToClipboard(payload);
    setToastMessage(t.copyJsonBtn + ' — ' + (lang === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào bộ nhớ tạm!'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Process Uploaded JSON File
  const processImportFile = async (file: File) => {
    try {
      const raw = await readJsonFile(file);
      const preview = parseImportJsonString(raw);
      setImportPreview(preview);
      setImportErrorMsg(null);
    } catch (err: any) {
      if (err.message === 'FILE_TYPE_INVALID') {
        setImportErrorMsg(lang === 'en' ? 'Please select a valid .json file.' : 'Vui lòng chọn tệp có định dạng .json');
      } else if (err.message === 'FILE_READ_ERROR') {
        setImportErrorMsg(lang === 'en' ? 'Failed to read file.' : 'Không thể đọc tệp đã chọn.');
      } else if (err.message === 'INVALID_CV_SCHEMA') {
        setImportErrorMsg(t.importInvalidMsg);
      } else {
        setImportErrorMsg(lang === 'en' ? `Failed to parse JSON file: ${err.message}` : `Lỗi đọc file JSON: ${err.message}`);
      }
    }
  };

  const handleJSONFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImportFile(file);
    }
    e.target.value = '';
  };

  // 5. Apply Imported Data to State & Storage
  const handleApplyImport = () => {
    if (!importPreview) return;

    if (importPreview.type === 'full') {
      const p = importPreview.data;
      if (p.cvVi) setCvVi(p.cvVi);
      if (p.cvEn) setCvEn(p.cvEn);
      if (p.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === p.template)) {
        setTemplate(p.template);
      }
      if (p.accentColor) setAccentColor(p.accentColor);
      if (p.fontFamily) setFontFamily(p.fontFamily);
      if (p.isCompact !== undefined) setIsCompact(p.isCompact);
      if (p.sectionOrder) setSectionOrder(p.sectionOrder);
      if (p.sectionVisibility) setSectionVisibility(p.sectionVisibility);

      if (p.lang === 'en' && p.cvEn) {
        setLang('en');
        setCvState(p.cvEn);
      } else {
        setLang('vi');
        setCvState(p.cvVi || p.cv);
      }
    } else if (importPreview.type === 'single') {
      const single = importPreview.data as CVData;
      setCvState(single);
      if (lang === 'vi') {
        setCvVi(single);
      } else {
        setCvEn(single);
      }
      if (importPreview.meta?.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === importPreview.meta.template)) {
        setTemplate(importPreview.meta.template);
      }
      if (importPreview.meta?.accentColor) setAccentColor(importPreview.meta.accentColor);
      if (importPreview.meta?.fontFamily) setFontFamily(importPreview.meta.fontFamily);
      if (importPreview.meta?.isCompact !== undefined) setIsCompact(importPreview.meta.isCompact);
      if (importPreview.meta?.sectionOrder) setSectionOrder(importPreview.meta.sectionOrder);
      if (importPreview.meta?.sectionVisibility) setSectionVisibility(importPreview.meta.sectionVisibility);
    }

    setImportPreview(null);
    setImportErrorMsg(null);
    setShowDataModal(false);

    setToastMessage(t.importSuccessMsg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load saved CV from localStorage or /api/cv on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // 1. Check localStorage first for instant restoration
        const local = localStorage.getItem('ducanh_cv_data');
        if (local) {
          const parsed = JSON.parse(local);
          const savedLang: Language = parsed.lang === 'en' ? 'en' : 'vi';
          if (parsed.cvVi) setCvVi(sanitizeCVTechStuttering({ ...parsed.cvVi, customLinks: ensureCustomLinks(parsed.cvVi) }));
          if (parsed.cvEn) setCvEn(sanitizeCVTechStuttering({ ...parsed.cvEn, customLinks: ensureCustomLinks(parsed.cvEn) }));
          setLang(savedLang);

          if (savedLang === 'en') {
            const base = sanitizeCVTechStuttering(parsed.cvEn || parsed.cv || defaultEnglishCVData);
            setCvState({ ...base, customLinks: ensureCustomLinks(base) });
          } else {
            const base = sanitizeCVTechStuttering(parsed.cvVi || parsed.cv || defaultCVData);
            setCvState({ ...base, customLinks: ensureCustomLinks(base) });
          }
          if (parsed.template) setTemplate(parsed.template);
          if (parsed.accentColor) setAccentColor(parsed.accentColor);
          if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
          if (parsed.isCompact !== undefined) setIsCompact(parsed.isCompact);
          if (parsed.sectionOrder) {
            const loadedOrder: SectionKey[] = [...parsed.sectionOrder];
            const customSecs: CustomSection[] = parsed.cv?.customSections || parsed.cvVi?.customSections || defaultCVData.customSections || [];
            customSecs.forEach((cs) => {
              if (!loadedOrder.includes(cs.id)) loadedOrder.push(cs.id);
            });
            setSectionOrder(loadedOrder);
          }
          if (parsed.sectionVisibility) {
            setSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY, ...parsed.sectionVisibility });
          }
        }

        // 2. Fetch /api/cv to sync from server if available
        const res = await fetch('/api/cv');
        const data = await res.json();
        if (data.success && data.cv) {
          const serverLang: Language = data.cv.lang === 'en' ? 'en' : 'vi';
          if (data.cv.cvVi) setCvVi({ ...data.cv.cvVi, customLinks: ensureCustomLinks(data.cv.cvVi) });
          if (data.cv.cvEn) setCvEn({ ...data.cv.cvEn, customLinks: ensureCustomLinks(data.cv.cvEn) });

          if (serverLang === 'en' && data.cv.cvEn) {
            setCvState({ ...data.cv.cvEn, customLinks: ensureCustomLinks(data.cv.cvEn) });
            setLang('en');
          } else if (data.cv.cvVi) {
            setCvState({ ...data.cv.cvVi, customLinks: ensureCustomLinks(data.cv.cvVi) });
          } else {
            setCvState({ ...data.cv, customLinks: ensureCustomLinks(data.cv) });
          }
          if (data.cv.template) setTemplate(data.cv.template);
          if (data.cv.accentColor) setAccentColor(data.cv.accentColor);
          if (data.cv.fontFamily) setFontFamily(data.cv.fontFamily);
          if (data.cv.isCompact !== undefined) setIsCompact(data.cv.isCompact);
          if (data.cv.sectionOrder) {
            const loadedOrder: SectionKey[] = [...data.cv.sectionOrder];
            const customSecs: CustomSection[] = data.cv.customSections || data.cv.cvVi?.customSections || defaultCVData.customSections || [];
            customSecs.forEach((cs) => {
              if (!loadedOrder.includes(cs.id)) loadedOrder.push(cs.id);
            });
            setSectionOrder(loadedOrder);
          }
          if (data.cv.sectionVisibility) {
            setSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY, ...data.cv.sectionVisibility });
          }
        }

        // 3. Initialize Multiple CV Profiles
        const baseVi = (local ? JSON.parse(local).cvVi : null) || (data?.success && data.cv?.cvVi ? data.cv.cvVi : defaultCVData);
        const baseEn = (local ? JSON.parse(local).cvEn : null) || (data?.success && data.cv?.cvEn ? data.cv.cvEn : defaultEnglishCVData);
        const baseSettings = {
          template: (local ? JSON.parse(local).template : null) || (data?.success && data.cv?.template) || 'rabbit',
          accentColor: (local ? JSON.parse(local).accentColor : null) || (data?.success && data.cv?.accentColor) || 'blue',
          fontFamily: (local ? JSON.parse(local).fontFamily : null) || (data?.success && data.cv?.fontFamily) || 'inter',
          isCompact: (local ? JSON.parse(local).isCompact : false) || (data?.success && data.cv?.isCompact) || false,
          sectionOrder: (local ? JSON.parse(local).sectionOrder : null) || (data?.success && data.cv?.sectionOrder) || DEFAULT_SECTION_ORDER,
          sectionVisibility: (local ? JSON.parse(local).sectionVisibility : null) || (data?.success && data.cv?.sectionVisibility) || DEFAULT_SECTION_VISIBILITY,
          activeLang: ((local ? JSON.parse(local).lang : null) || (data?.success && data.cv?.lang) || 'vi') as Language,
        };

        const { profiles: loadedProfiles, activeProfileId: initialActiveId } = loadProfilesFromStorage(
          baseVi,
          baseEn,
          baseSettings
        );
        setProfiles(loadedProfiles);
        setActiveProfileId(initialActiveId);
      } catch (err) {
        console.warn('Could not load saved CV:', err);
      } finally {
        // Smooth transition to prevent flicker
        setTimeout(() => setIsLoading(false), 350);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (isLoading || !activeProfileId) return;

    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      // Update current profile in profiles list
      setProfiles((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = prev.map((p) => {
          if (p.id === activeProfileId) {
            return {
              ...p,
              updatedAt: new Date().toISOString(),
              cvVi: activeCvVi,
              cvEn: activeCvEn,
              activeLang: lang,
              coverLetterVi,
              coverLetterEn,
              template,
              accentColor,
              fontFamily,
              isCompact,
              sectionOrder,
              sectionVisibility,
            };
          }
          return p;
        });
        saveProfilesToStorage(next, activeProfileId);
        return next;
      });

      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        })
      );
    } catch (e) {
      // ignore quota errors
    }
  }, [cv, cvVi, cvEn, lang, coverLetterVi, coverLetterEn, template, accentColor, fontFamily, isCompact, sectionOrder, sectionVisibility, activeProfileId, isLoading]);

  // Save changes explicitly to server & localStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      // Save locally
      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        })
      );

      // Save to server API
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(lang === 'en' ? 'CV saved & updated successfully!' : 'Đã lưu và cập nhật CV thành công!');
      } else {
        setToastMessage(lang === 'en' ? 'Saved to local browser storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
      }
    } catch (e) {
      console.error(e);
      setToastMessage(lang === 'en' ? 'Saved to local browser storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Update handlers
  const updateTimelineItem = (id: string, field: keyof TimelineItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.timeline.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.timeline];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, timeline: list });
  };

  const addTimelineItem = (index: number = cv.timeline.length - 1) => {
    const newItem: TimelineItem = {
      id: `exp-${Date.now()}`,
      period: lang === 'en' ? '2024 — PRESENT' : '2024 — HIỆN TẠI',
      role: lang === 'en' ? 'Fullstack Software Engineer' : 'Fullstack Software Engineer',
      desc: lang === 'en'
        ? 'Architected core system modules, optimized database performance, and crafted intuitive user interfaces.'
        : 'Phát triển các module chức năng chính, tối ưu hoá cơ sở dữ liệu và xây dựng giao diện người dùng thân thiện.',
    };
    const list = [...cv.timeline];
    list.splice(index + 1, 0, newItem);
    setCv({ ...cv, timeline: list });
  };

  const deleteTimelineItem = (id: string) => {
    setCv({ ...cv, timeline: cv.timeline.filter((t) => t.id !== id) });
  };

  const updateProjectItem = (id: string, field: keyof ProjectItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveProjectItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.projects.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, projects: list });
  };

  const addProjectItem = (index: number = cv.projects.length - 1) => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      num: `0${cv.projects.length + 1}`,
      title: lang === 'en' ? 'New Project Title' : 'Tên dự án mới',
      category: 'Web Application',
      year: new Date().getFullYear().toString(),
      desc: lang === 'en'
        ? 'Brief overview of technological solution, challenges solved, and key impact achieved...'
        : 'Mô tả ngắn gọn về giải pháp công nghệ, thách thức và kết quả đạt được của dự án...',
      badges: ['React', 'TypeScript', 'Node.js'],
      liveDemo: '',
      github: '',
    };
    const list = [...cv.projects];
    list.splice(index + 1, 0, newProj);
    setCv({ ...cv, projects: list });
  };

  const deleteProjectItem = (id: string) => {
    setCv({ ...cv, projects: cv.projects.filter((p) => p.id !== id) });
  };

  const updateEducationItem = (id: string, field: keyof EducationItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveEducationItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.education.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.education];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, education: list });
  };

  const addEducationItem = (index: number = cv.education.length - 1) => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: lang === 'en' ? 'University / Institution Name' : 'Tên trường / Học viện',
      degree: lang === 'en' ? 'Degree / Major Field of Study' : 'Chuyên ngành / Bằng cấp',
      year: '2020 — 2024',
      desc: lang === 'en' ? 'Notable academic achievements, honors, or thesis topic.' : 'Thành tích nổi bật, xếp loại hoặc chứng chỉ liên quan.',
    };
    const list = [...cv.education];
    list.splice(index + 1, 0, newEdu);
    setCv({ ...cv, education: list });
  };

  const deleteEducationItem = (id: string) => {
    setCv({ ...cv, education: cv.education.filter((e) => e.id !== id) });
  };

  // Custom Sections Handlers
  const addCustomSection = (presetId?: string) => {
    const preset = CUSTOM_SECTION_PRESETS.find((p) => p.presetId === presetId);
    const newId = `custom_${Date.now()}`;
    const newSec: CustomSection = {
      id: newId,
      title: preset ? (lang === 'en' ? preset.templateEn.title : preset.templateVi.title) : (lang === 'en' ? 'New Section' : 'Mục mới'),
      titleEn: preset ? preset.templateEn.title : 'New Section',
      type: preset ? preset.type : 'list',
      content: preset?.type === 'text' ? (lang === 'en' ? preset.templateEn.content : preset.templateVi.content) : '',
      items: preset?.type === 'list'
        ? (lang === 'en' ? preset.templateEn.items : preset.templateVi.items)?.map((it, idx) => ({
            ...it,
            id: `item-${Date.now()}-${idx}`,
          }))
        : [
            {
              id: `item-${Date.now()}-0`,
              title: lang === 'en' ? 'Title / Name' : 'Tên mục / Chứng chỉ / Hoạt động',
              subtitle: lang === 'en' ? 'Organization / Issuer' : 'Tổ chức / Đơn vị cấp',
              date: '2024',
              desc: lang === 'en' ? 'Description of responsibilities or impact' : 'Mô tả chi tiết hoặc thành tựu đạt được',
            },
          ],
    };

    setCv((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec],
    }));

    setSectionOrder((prev) => [...prev, newId]);
    setSectionVisibility((prev) => ({ ...prev, [newId]: true }));

    setToastMessage(lang === 'en' ? `Added section: ${newSec.title}` : `Đã thêm mục: ${newSec.title}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const removeCustomSection = (sectionId: string) => {
    const sec = cv.customSections?.find((s) => s.id === sectionId);
    const title = sec?.title || 'Mục tùy chỉnh';
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== sectionId),
    }));
    setSectionOrder((prev) => prev.filter((k) => k !== sectionId));
    setSectionVisibility((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setToastMessage(lang === 'en' ? `Removed: ${title}` : `Đã xóa: ${title}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
  };

  const updateCustomSectionContent = (sectionId: string, content: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, content } : s)),
    }));
  };

  const addCustomSectionItem = (sectionId: string, afterIndex?: number) => {
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: lang === 'en' ? 'Title / Award / Certificate' : 'Tên mục / Chứng chỉ / Giải thưởng',
      subtitle: lang === 'en' ? 'Issuer / Organization' : 'Đơn vị cấp / Tổ chức',
      date: '2024',
      desc: lang === 'en' ? 'Description or key achievements.' : 'Mô tả chi tiết hoặc thành tựu đạt được.',
    };
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentItems = [...(sec.items || [])];
        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < currentItems.length) {
          currentItems.splice(afterIndex + 1, 0, newItem);
        } else {
          currentItems.push(newItem);
        }
        return { ...sec, items: currentItems };
      }),
    }));
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
        };
      }),
    }));
  };

  const deleteCustomSectionItem = (sectionId: string, itemId: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).filter((it) => it.id !== itemId),
        };
      }),
    }));
  };

  const moveCustomSectionItem = (sectionId: string, index: number, direction: 'up' | 'down') => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const items = [...(sec.items || [])];
        if (direction === 'up' && index === 0) return sec;
        if (direction === 'down' && index === items.length - 1) return sec;
        const target = direction === 'up' ? index - 1 : index + 1;
        const temp = items[index];
        items[index] = items[target];
        items[target] = temp;
        return { ...sec, items };
      }),
    }));
  };

  // Tech Bullet Points Modal Handlers
  const handleOpenTechModal = (target?: { type: 'timeline' | 'project'; id: string; title?: string }) => {
    if (target) {
      setTechTarget(target);
    } else {
      if (cv.timeline.length > 0) {
        setTechTarget({ type: 'timeline', id: cv.timeline[0].id, title: cv.timeline[0].role });
      } else if (cv.projects.length > 0) {
        setTechTarget({ type: 'project', id: cv.projects[0].id, title: cv.projects[0].title });
      } else {
        setTechTarget(null);
      }
    }
    setShowTechModal(true);
  };

  const handleCopyBullet = (bullet: TechBulletPoint) => {
    const text = lang === 'en' ? bullet.textEn : bullet.textVi;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBulletId(bullet.id);
      setTimeout(() => setCopiedBulletId(null), 2000);
      setToastMessage(lang === 'en' ? 'Copied tech bullet point to clipboard!' : 'Đã sao chép gợi ý chuẩn công nghệ vào bộ nhớ tạm!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleInsertBullet = (bullet: TechBulletPoint) => {
    const text = lang === 'en' ? bullet.textEn : bullet.textVi;
    if (!techTarget) {
      handleCopyBullet(bullet);
      return;
    }

    if (techTarget.type === 'timeline') {
      const targetItem = cv.timeline.find((item) => item.id === techTarget.id);
      if (targetItem) {
        const currentDesc = (targetItem.desc || '').trim();
        let updatedDesc = '';
        if (!currentDesc) {
          updatedDesc = `• ${text}`;
        } else {
          updatedDesc = currentDesc.endsWith('\n') 
            ? `${currentDesc}• ${text}`
            : `${currentDesc}\n• ${text}`;
        }
        updateTimelineItem(techTarget.id, 'desc', updatedDesc);
        setInsertedBulletId(bullet.id);
        setTimeout(() => setInsertedBulletId(null), 2000);
        setToastMessage(lang === 'en' ? `Inserted bullet into "${targetItem.role}"!` : `Đã chèn gợi ý vào "${targetItem.role}"!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } else if (techTarget.type === 'project') {
      const targetProj = cv.projects.find((proj) => proj.id === techTarget.id);
      if (targetProj) {
        const currentDesc = (targetProj.desc || '').trim();
        let updatedDesc = '';
        if (!currentDesc) {
          updatedDesc = `• ${text}`;
        } else {
          updatedDesc = currentDesc.endsWith('\n') 
            ? `${currentDesc}• ${text}`
            : `${currentDesc}\n• ${text}`;
        }
        updateProjectItem(techTarget.id, 'desc', updatedDesc);
        setInsertedBulletId(bullet.id);
        setTimeout(() => setInsertedBulletId(null), 2000);
        setToastMessage(lang === 'en' ? `Inserted bullet into "${targetProj.title}"!` : `Đã chèn gợi ý vào dự án "${targetProj.title}"!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const updateSkill = (index: number, value: string) => {
    const list = [...cv.skills];
    list[index] = value;
    setCv({ ...cv, skills: list });
  };

  const removeSkill = (index: number) => {
    setCv({ ...cv, skills: cv.skills.filter((_, i) => i !== index) });
  };

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    setCv({ ...cv, skills: [...cv.skills, name.trim()] });
  };

  // Color Theme Configuration
  const colorMap = {
    blue: {
      primary: '#0284c7', // Sky / Cyan Blue
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
      border: '#0284c7',
      lightBg: '#f0f9ff',
      sidebarBg: '#0f172a',
      gradient: 'from-[#06b6d4] to-[#0284c7]',
    },
    yellow: {
      primary: '#ca8a04',
      badgeBg: '#fef08a',
      badgeText: '#713f12',
      border: '#eab308',
      lightBg: '#fefce8',
      sidebarBg: '#1c1917',
      gradient: 'from-[#facc15] to-[#ca8a04]',
    },
    emerald: {
      primary: '#059669',
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
      border: '#10b981',
      lightBg: '#ecfdf5',
      sidebarBg: '#064e3b',
      gradient: 'from-[#34d399] to-[#059669]',
    },
    slate: {
      primary: '#0f172a',
      badgeBg: '#f1f5f9',
      badgeText: '#0f172a',
      border: '#334155',
      lightBg: '#f8fafc',
      sidebarBg: '#18181b',
      gradient: 'from-[#475569] to-[#0f172a]',
    },
    rose: {
      primary: '#be123c',
      badgeBg: '#ffe4e6',
      badgeText: '#881337',
      border: '#f43f5e',
      lightBg: '#fff1f2',
      sidebarBg: '#4c0519',
      gradient: 'from-[#fb7185] to-[#be123c]',
    },
  };

  const activeColor = colorMap[accentColor];

  // Font family styles with backward compatibility
  const fontClass = {
    inter: 'font-inter',
    bevietnam: 'font-bevietnam',
    jakarta: 'font-jakarta',
    roboto: 'font-roboto',
    merriweather: 'font-merriweather',
    jetbrains: 'font-jetbrains',
    // Legacy compatibility
    sans: 'font-inter',
    serif: 'font-merriweather',
    mono: 'font-jetbrains',
  }[fontFamily] || 'font-inter';

  // Dynamic QR Code Generation
  const activeQrConfig = ensureQRConfig(cv.qrConfig);

  useEffect(() => {
    if (!activeQrConfig.enabled) {
      setQrDataUrl('');
      return;
    }

    let isMounted = true;
    const targetText = getQRTargetText(activeQrConfig, cv);
    const colorHex = activeQrConfig.colorMode === 'accent' ? activeColor.primary : '#0F172A';

    generateQRDataUrl(targetText, {
      color: colorHex,
      size: 200,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeQrConfig.enabled,
    activeQrConfig.targetType,
    activeQrConfig.customUrl,
    activeQrConfig.colorMode,
    cv.website,
    cv.linkedin,
    cv.github,
    cv.email,
    cv.phone,
    cv.name,
    activeColor.primary,
  ]);

  const handleUpdateQRConfig = (patch: Partial<CVQRConfig>) => {
    setCv((prev) => {
      const current = ensureQRConfig(prev.qrConfig);
      return {
        ...prev,
        qrConfig: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const handleUpdateQRTargetUrl = (newVal: string) => {
    const currentTarget = activeQrConfig.targetType;
    if (currentTarget === 'website') {
      setCv((prev) => ({
        ...prev,
        website: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'linkedin') {
      setCv((prev) => ({
        ...prev,
        linkedin: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'github') {
      setCv((prev) => ({
        ...prev,
        github: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else {
      handleUpdateQRConfig({ customUrl: newVal });
    }
  };

  const handleCopyQRUrl = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setQrCopied(true);
    setToastMessage(lang === 'en' ? 'Link copied to clipboard!' : 'Đã sao chép liên kết!');
    setTimeout(() => {
      setQrCopied(false);
      setToastMessage(null);
    }, 2000);
  };

  // Public URL & Dynamic QR Generation for Share Link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setShareOrigin(origin);

      // Read query params if in public view or page loaded
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      const urlTpl = params.get('tpl') || params.get('template');
      const urlDoc = params.get('doc');
      const urlHidePhone = params.get('hidePhone');
      const urlHideLoc = params.get('hideLoc');

      if (urlLang === 'en' || urlLang === 'vi') {
        if (urlLang !== lang) {
          handleSwitchLanguage(urlLang as Language);
        }
      }
      if (urlTpl && TEMPLATES_COLLECTION.some((t) => t.id === urlTpl)) {
        setTemplate(urlTpl as TemplateId);
      }
      if (urlDoc === 'cover_letter' || urlDoc === 'letter') {
        setDocMode('cover_letter');
      }
      if (urlHidePhone === '1' || urlHidePhone === 'true') {
        setPrivacyHidePhone(true);
      }
      if (urlHideLoc === '1' || urlHideLoc === 'true') {
        setPrivacyHideLocation(true);
      }
    }
  }, []);

  // Compute live shareable public URL with query options
  const sharePublicUrl = useMemo(() => {
    const origin = shareOrigin;
    if (!origin) return '/cv/view';
    const params = new URLSearchParams();
    if (lang === 'en') params.set('lang', 'en');
    if (template !== 'rabbit') params.set('tpl', template);
    if (privacyHidePhone) params.set('hidePhone', '1');
    if (privacyHideLocation) params.set('hideLoc', '1');
    const qs = params.toString();
    return `${origin}/cv/view${qs ? `?${qs}` : ''}`;
  }, [shareOrigin, lang, template, privacyHidePhone, privacyHideLocation]);

  // Generate QR code whenever sharePublicUrl updates
  useEffect(() => {
    if (!sharePublicUrl || sharePublicUrl === '/cv/view') return;
    let isMounted = true;
    generateQRDataUrl(sharePublicUrl, {
      color: '#0F172A',
      size: 240,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setShareQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sharePublicUrl]);

  // Share Actions Handlers
  const handleCopyShareUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sharePublicUrl);
      setIsShareCopied(true);
      setToastMessage(lang === 'en' ? 'Public link copied to clipboard!' : 'Đã sao chép liên kết xem trực tuyến công khai!');
      setTimeout(() => {
        setIsShareCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      lang === 'en'
        ? `Check out the interactive resume and portfolio of ${cv.name} (${cv.role}):`
        : `Xem hồ sơ CV trực tuyến & portfolio của ${cv.name} (${cv.role}):`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      lang === 'en'
        ? `[Resume] ${cv.name} - ${cv.role}`
        : `[Hồ sơ ứng tuyển] ${cv.name} - ${cv.role}`
    );
    const body = encodeURIComponent(
      lang === 'en'
        ? `Dear Hiring Team,\n\nPlease find my verified digital resume and credentials at:\n${sharePublicUrl}\n\nBest regards,\n${cv.name}`
        : `Kính gửi Quý nhà tuyển dụng,\n\nEm xin gửi đường link xem trực tuyến hồ sơ CV và portfolio của em tại:\n${sharePublicUrl}\n\nTrân trọng,\n${cv.name}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownloadShareQr = () => {
    if (!shareQrDataUrl) return;
    const a = document.createElement('a');
    a.href = shareQrDataUrl;
    a.download = `QR_${(cv.name || 'CV').replace(/\s+/g, '_')}_Public_View.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToastMessage(lang === 'en' ? 'Downloaded QR image!' : 'Đã tải ảnh mã QR xem trực tuyến!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Print Action
  const handlePrint = () => {
    if (isLoading) {
      setToastMessage(lang === 'en' ? 'CV is still loading, please wait a moment...' : 'Hồ sơ đang tải, vui lòng chờ trong giây lát...');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setIsExportMenuOpen(false);
    printDocument();
  };

  // High-Resolution Image Export Handler (PNG / JPG 300 DPI)
  const handleExportImage = async (format: ImageExportFormat, resolution: ExportResolution = exportResolution) => {
    setIsExportingImage(true);
    setIsExportMenuOpen(false);
    const isCoverLetter = docMode === 'cover_letter';
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const targetElementId = isCoverLetter ? 'cover-letter-paper' : 'cv-paper';
    const baseName = isCoverLetter
      ? (currentLetter.senderName || cv.name || 'Nguyen_Duc_Anh')
      : (cv.name || 'Nguyen_Duc_Anh');
    const fileName = generateExportFileName({
      baseName,
      docType: isCoverLetter ? 'CoverLetter' : 'CV',
      template,
      lang,
      resolution,
    });

    setToastMessage(
      lang === 'en'
        ? `Rendering high-res ${format.toUpperCase()} (${resolution === 2 ? '300 DPI' : resolution + 'x'})...`
        : `Đang xử lý xuất ảnh ${format.toUpperCase()} (${resolution === 2 ? 'chuẩn 300 DPI' : resolution + 'x'})...`
    );

    try {
      const result = await exportDocumentImage({
        elementId: targetElementId,
        format,
        resolution,
        fileName,
        quality: 0.95,
      });

      if (result.success) {
        setToastMessage(
          lang === 'en'
            ? `Exported ${format.toUpperCase()} image successfully!`
            : `Đã tải ảnh ${format.toUpperCase()} sắc nét về máy thành công!`
        );
      } else {
        setToastMessage(result.error || (lang === 'en' ? 'Failed to export image.' : 'Có lỗi khi xuất ảnh.'));
      }
    } catch (err: any) {
      setToastMessage(err?.message || (lang === 'en' ? 'Export failed.' : 'Xuất ảnh thất bại.'));
    } finally {
      setIsExportingImage(false);
    }
  };

  // Matching Cover Letter Action Handlers
  const handleUpdateCoverLetterField = (field: keyof CoverLetterData, value: string) => {
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({ ...prev, [field]: value }));
    } else {
      setCoverLetterEn((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleApplyCoverLetterPreset = (preset: CoverLetterPreset) => {
    setActiveCoverLetterPresetId(preset.id);
    const data = lang === 'en' ? preset.dataEn : preset.dataVi;
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({
        ...prev,
        ...data,
      }));
    } else {
      setCoverLetterEn((prev) => ({
        ...prev,
        ...data,
      }));
    }
    setToastMessage(
      lang === 'en'
        ? `Applied "${preset.titleEn}" cover letter preset!`
        : `Đã áp dụng mẫu thư: "${preset.titleVi}"!`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncCoverLetterWithCV = () => {
    const activeCv = cv;
    const updater = (prev: CoverLetterData): CoverLetterData => ({
      ...prev,
      senderName: activeCv.name || prev.senderName,
      senderRole: activeCv.role || prev.senderRole,
      senderEmail: activeCv.email || prev.senderEmail,
      senderPhone: activeCv.phone || prev.senderPhone,
      senderLocation: activeCv.location || prev.senderLocation,
      senderWebsite: activeCv.website || prev.senderWebsite,
    });

    if (lang === 'vi') {
      setCoverLetterVi(updater);
    } else {
      setCoverLetterEn(updater);
    }
    setToastMessage(
      lang === 'en'
        ? 'Cover letter sender info synchronized from CV!'
        : 'Đã đồng bộ thông tin ứng viên từ CV vào Thư xin việc!'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCoverLetterText = () => {
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const fullText = [
      `${currentLetter.senderName.toUpperCase()}`,
      `${currentLetter.senderRole} | ${currentLetter.senderEmail} | ${currentLetter.senderPhone} | ${currentLetter.senderLocation}`,
      currentLetter.senderWebsite ? `Website: ${currentLetter.senderWebsite}` : '',
      '',
      `${currentLetter.date}`,
      '',
      `Kính gửi: ${currentLetter.recipientName}`,
      `${currentLetter.recipientRole}`,
      `${currentLetter.companyName}`,
      `${currentLetter.companyAddress}`,
      '',
      `V/v: Ứng tuyển vị trí ${currentLetter.jobTitle}`,
      '',
      `${currentLetter.salutation}`,
      '',
      `${currentLetter.opening}`,
      '',
      `${currentLetter.body1}`,
      '',
      `${currentLetter.body2}`,
      '',
      `${currentLetter.closing}`,
      '',
      `${currentLetter.signOff}`,
      `${currentLetter.senderName}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setIsCoverLetterCopied(true);
      setToastMessage(
        lang === 'en'
          ? 'Cover letter text copied to clipboard!'
          : 'Đã sao chép toàn bộ nội dung thư xin việc vào bộ nhớ tạm!'
      );
      setTimeout(() => {
        setIsCoverLetterCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  // Multiple CV Profiles Action Handlers
  const handleSwitchProfile = (targetProfileId: string) => {
    if (targetProfileId === activeProfileId) {
      setIsProfileMenuOpen(false);
      return;
    }

    // 1. Sync current active state into profiles list
    const activeCvVi = lang === 'vi' ? cv : cvVi;
    const activeCvEn = lang === 'en' ? cv : cvEn;

    const updatedProfiles = profiles.map((p) => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          activeLang: lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typography: typographyConfig,
          sectionOrder,
          sectionVisibility,
        };
      }
      return p;
    });

    // 2. Locate target profile
    const target = updatedProfiles.find((p) => p.id === targetProfileId);
    if (!target) return;

    // 3. Load target profile into active state
    const targetVi = sanitizeCVTechStuttering({ ...target.cvVi, customLinks: ensureCustomLinks(target.cvVi) });
    const targetEn = sanitizeCVTechStuttering({ ...target.cvEn, customLinks: ensureCustomLinks(target.cvEn) });
    setCvVi(targetVi);
    setCvEn(targetEn);
    setLang(target.activeLang || 'vi');
    setCvState(target.activeLang === 'en' ? targetEn : targetVi);
    if (target.coverLetterVi) setCoverLetterVi(target.coverLetterVi);
    if (target.coverLetterEn) setCoverLetterEn(target.coverLetterEn);
    setTemplate((target.template as TemplateId) || 'rabbit');
    setAccentColor((target.accentColor as any) || 'blue');
    setFontFamily((target.fontFamily as CVFontFamily) || 'inter');
    setIsCompact(target.isCompact ?? false);
    if (target.typography) {
      setTypographyConfig(target.typography);
    } else {
      setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
    }
    setSectionOrder(target.sectionOrder?.length ? (target.sectionOrder as SectionKey[]) : DEFAULT_SECTION_ORDER);
    setSectionVisibility(target.sectionVisibility || DEFAULT_SECTION_VISIBILITY);

    setActiveProfileId(target.id);
    setProfiles(updatedProfiles);
    saveProfilesToStorage(updatedProfiles, target.id);
    setIsProfileMenuOpen(false);

    setToastMessage(
      lang === 'en'
        ? `Switched to profile: ${target.name}`
        : `Đã chuyển sang phiên bản: ${target.name}`
    );
  };

  const handleDuplicateProfile = (sourceId: string) => {
    const source = profiles.find((p) => p.id === sourceId);
    if (!source) return;

    // Sync current active data if duplicating active
    let sourceData = source;
    if (source.id === activeProfileId) {
      sourceData = {
        ...source,
        cvVi: lang === 'vi' ? cv : cvVi,
        cvEn: lang === 'en' ? cv : cvEn,
        activeLang: lang,
        coverLetterVi,
        coverLetterEn,
        template,
        accentColor,
        fontFamily,
        isCompact,
        typography: typographyConfig,
        sectionOrder,
        sectionVisibility,
      };
    }

    const cloned = duplicateCVProfile(sourceData);
    const nextProfiles = [...profiles, cloned];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, cloned.id);
    handleSwitchProfile(cloned.id);

    setToastMessage(
      lang === 'en'
        ? `Duplicated profile: ${cloned.name}`
        : `Đã nhân bản phiên bản: ${cloned.name}`
    );
  };

  const handleCreateNewProfile = () => {
    if (!newProfileName.trim()) return;

    const baseVi = newProfileCloneFromCurrent ? (lang === 'vi' ? cv : cvVi) : defaultCVData;
    const baseEn = newProfileCloneFromCurrent ? (lang === 'en' ? cv : cvEn) : defaultEnglishCVData;

    const created = createNewCVProfile(
      newProfileName,
      newProfileRole,
      baseVi,
      baseEn,
      {
        template: newProfileCloneFromCurrent ? template : 'rabbit',
        accentColor: newProfileCloneFromCurrent ? accentColor : 'blue',
        fontFamily: newProfileCloneFromCurrent ? fontFamily : 'inter',
        isCompact: newProfileCloneFromCurrent ? isCompact : false,
        typography: newProfileCloneFromCurrent ? typographyConfig : DEFAULT_TYPOGRAPHY_CONFIG,
        sectionOrder: newProfileCloneFromCurrent ? sectionOrder : DEFAULT_SECTION_ORDER,
        sectionVisibility: newProfileCloneFromCurrent ? sectionVisibility : DEFAULT_SECTION_VISIBILITY,
        activeLang: lang,
        coverLetterVi: newProfileCloneFromCurrent ? coverLetterVi : createSyncedCoverLetter('vi', baseVi),
        coverLetterEn: newProfileCloneFromCurrent ? coverLetterEn : createSyncedCoverLetter('en', baseEn),
      }
    );

    const nextProfiles = [...profiles, created];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, created.id);
    handleSwitchProfile(created.id);

    setShowNewProfileModal(false);
    setNewProfileName('');
    setNewProfileRole('');

    setToastMessage(
      lang === 'en'
        ? `Created new profile: ${created.name}`
        : `Đã tạo phiên bản CV mới: ${created.name}`
    );
  };

  const handleRenameProfile = (profileId: string, newName: string) => {
    if (!newName.trim()) return;

    const nextProfiles = profiles.map((p) => {
      if (p.id === profileId) {
        return {
          ...p,
          name: newName.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, activeProfileId);
    setEditingProfileId(null);
    setEditingProfileName('');

    setToastMessage(lang === 'en' ? 'Profile renamed!' : 'Đã đổi tên phiên bản thành công!');
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      alert(lang === 'en' ? 'Cannot delete the only remaining profile!' : 'Không thể xóa phiên bản CV duy nhất còn lại!');
      return;
    }

    const target = profiles.find((p) => p.id === profileId);
    const confirmMsg =
      lang === 'en'
        ? `Are you sure you want to delete profile "${target?.name}"?`
        : `Bạn có chắc chắn muốn xóa phiên bản "${target?.name}" không?`;

    if (!confirm(confirmMsg)) return;

    const remaining = profiles.filter((p) => p.id !== profileId);
    let nextActiveId = activeProfileId;
    if (activeProfileId === profileId) {
      nextActiveId = remaining[0].id;
    }

    setProfiles(remaining);
    saveProfilesToStorage(remaining, nextActiveId);

    if (activeProfileId === profileId) {
      handleSwitchProfile(nextActiveId);
    }

    setToastMessage(lang === 'en' ? 'Profile deleted.' : 'Đã xóa phiên bản CV.');
  };

  // CV Parser Action Handlers
  const handleParseFile = async (file: File) => {
    setIsParsingCV(true);
    setParseError(null);
    setImportFile(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to parse file.' : 'Không thể trích xuất nội dung từ file.'));
      }
      setParsedResult(data.result);
      setImportPreviewTab('profile');
    } catch (err: any) {
      setParseError(err.message || (lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi phân tích file.'));
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleParseRawText = async (text: string, title?: string) => {
    if (!text || text.trim().length < 20) {
      setParseError(lang === 'en' ? 'Please paste at least 20 characters of CV content.' : 'Vui lòng dán ít nhất 20 ký tự nội dung CV.');
      return;
    }
    setIsParsingCV(true);
    setParseError(null);
    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: title || (lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán') }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to parse text.' : 'Không thể phân tích nội dung văn bản.'));
      }
      setParsedResult(data.result);
      setImportPreviewTab('profile');
    } catch (err: any) {
      setParseError(err.message || (lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi trích xuất.'));
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleApplyImportedCV = (mode: 'new_profile' | 'overwrite_current') => {
    if (!parsedResult) return;
    const importedCV = parsedResult.cv;
    const targetLang = parsedResult.detectedLang;

    if (mode === 'new_profile') {
      const profileName = parsedResult.fileName
        ? `CV ${parsedResult.fileName.replace(/\.[^/.]+$/, '')}`
        : `CV ${importedCV.name || 'Imported'}`;

      const baseVi = targetLang === 'vi' ? importedCV : { ...defaultCVData, ...importedCV };
      const baseEn = targetLang === 'en' ? importedCV : { ...defaultEnglishCVData, ...importedCV };

      const newProfile = createNewCVProfile(
        profileName,
        importedCV.role || 'Software Engineer',
        baseVi,
        baseEn,
        {
          activeLang: targetLang,
          template: template || 'rabbit',
          accentColor: accentColor || 'blue',
          fontFamily: fontFamily || 'inter',
          isCompact: isCompact,
          sectionOrder: sectionOrder,
          sectionVisibility: sectionVisibility,
        }
      );

      const nextProfiles = [...profiles, newProfile];
      saveProfilesToStorage(nextProfiles, newProfile.id);
      setProfiles(nextProfiles);
      handleSwitchProfile(newProfile.id);
      setShowImportModal(false);
      setParsedResult(null);
      setImportFile(null);
      setImportRawText('');
      setToastMessage(lang === 'en' ? 'Created new CV Profile from imported file!' : 'Đã tạo phiên bản CV mới từ file trích xuất thành công!');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      if (targetLang === 'vi') {
        setCvVi(importedCV);
        if (lang === 'vi') setCvState(importedCV);
      } else {
        setCvEn(importedCV);
        if (lang === 'en') setCvState(importedCV);
      }
      setShowImportModal(false);
      setParsedResult(null);
      setImportFile(null);
      setImportRawText('');
      setToastMessage(lang === 'en' ? 'CV updated from imported file!' : 'Đã cập nhật dữ liệu CV từ file thành công!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Reset to Portfolio Data
  const handleReset = () => {
    const confirmMsg =
      lang === 'en'
        ? 'Reset current English CV back to default?'
        : 'Khôi phục toàn bộ nội dung CV về mặc định theo Portfolio?';
    if (confirm(confirmMsg)) {
      if (lang === 'en') {
        setCv(defaultEnglishCVData);
        setCvEn(defaultEnglishCVData);
      } else {
        setCv(defaultCVData);
        setCvVi(defaultCVData);
      }
      localStorage.removeItem('ducanh_cv_data');
      setToastMessage(lang === 'en' ? 'Reset to default successfully!' : 'Đã khôi phục về mặc định!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const activeTemplateDef = TEMPLATES_COLLECTION.find((t) => t.id === template) || TEMPLATES_COLLECTION[0];

  const filteredTemplates = TEMPLATES_COLLECTION.filter((t) =>
    galleryFilter === 'all' ? true : t.category === galleryFilter
  );

  const commonTemplateProps: CVTemplateProps = {
    cv,
    setCv,
    lang,
    t,
    activeColor,
    pad,
    sectionOrder,
    sectionVisibility,
    isCompact,
    template,
    qrDataUrl,
    activeQrConfig,
    triggerAvatarUpload,
    addTimelineItem,
    updateTimelineItem,
    moveTimelineItem,
    deleteTimelineItem,
    addProjectItem,
    updateProjectItem,
    moveProjectItem,
    deleteProjectItem,
    updateSkill,
    removeSkill,
    addSkill,
    newSkillText,
    setNewSkillText,
    isAddingSkill,
    setIsAddingSkill,
    addEducationItem,
    updateEducationItem,
    moveEducationItem,
    deleteEducationItem,
    handleUpdateCustomLink,
    updateCustomSectionTitle,
    updateCustomSectionContent,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    moveCustomSectionItem,
    removeCustomSection,
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0F19] text-neutral-200 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-[99999] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar Upload from Computer */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Hidden File Input for JSON CV Data Import */}
      <input
        ref={jsonFileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleJSONFileChange}
      />

      {/* ================= RECRUITER PUBLIC TOPBAR (56px) ================= */}
      <RecruiterTopbar
        isPublicView={isPublicView}
        isPreviewMode={isPreviewMode}
        cv={cv}
        lang={lang}
        t={t}
        shareIncludeCoverLetter={shareIncludeCoverLetter}
        docMode={docMode}
        setDocMode={setDocMode}
        handleToggleLang={handleToggleLang}
        template={template}
        setTemplate={setTemplate}
        zoom={zoom}
        setZoom={setZoom}
        setIsPublicQrModalOpen={setIsPublicQrModalOpen}
        handleCopyShareUrl={handleCopyShareUrl}
        isShareCopied={isShareCopied}
        shareAllowDownload={shareAllowDownload}
        handlePrint={handlePrint}
        setIsContactModalOpen={setIsContactModalOpen}
      />

      {/* ================= 1. MINIMAL TOP-BAR (56px) - STUDIO EDITOR ================= */}
      <EditorTopbar
        isPreviewMode={isPreviewMode}
        isPublicView={isPublicView}
        cv={cv}
        lang={lang}
        t={t}
        profiles={profiles}
        activeProfileId={activeProfileId}
        handleSwitchProfile={handleSwitchProfile}
        handleRenameProfile={handleRenameProfile}
        handleDuplicateProfile={handleDuplicateProfile}
        handleDeleteProfile={handleDeleteProfile}
        setShowNewProfileModal={setShowNewProfileModal}
        setShowImportModal={setShowImportModal}
        setShowDataModal={setShowDataModal}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        undoHistoryIndex={undoHistoryIndex}
        undoHistory={undoHistory}
        isSaving={isSaving}
        setIsPreviewMode={setIsPreviewMode}
        setIsShareModalOpen={setIsShareModalOpen}
        handlePrint={handlePrint}
        handleExportImage={handleExportImage}
        isExportingImage={isExportingImage}
        exportResolution={exportResolution}
        setExportResolution={setExportResolution}
        setParsedResult={setParsedResult}
        setParseError={setParseError}
      />

      {/* ================= 2. MAIN WORKSPACE AREA (RAIL + DRAWER + CANVAS) ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= A. LEFT ICON RAIL (70px) ================= */}
        <SidebarRail
          isPreviewMode={isPreviewMode}
          isPublicView={isPublicView}
          t={t}
          lang={lang}
          cvStrength={cvStrength}
          activeRailTab={activeRailTab}
          setActiveRailTab={setActiveRailTab}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setDocMode={setDocMode}
        />

        {/* ================= B. TOOL DRAWER (320px) ================= */}
        {!isPreviewMode && !isPublicView && isDrawerOpen && (
          <aside className="no-print w-[320px] min-w-[320px] max-w-[85vw] bg-[#161B26] border-r border-white/10 flex flex-col z-20 flex-shrink-0 transition-all duration-200 ease-in-out absolute lg:relative inset-y-0 left-[70px] lg:left-0 shadow-2xl lg:shadow-none">
            {/* Drawer Header */}
            <div className="h-12 min-h-[48px] px-4 border-b border-white/10 flex items-center justify-between bg-[#111827]/60">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-xs tracking-wide">
                  {activeRailTab === 'design' && t.drawerDesignTitle}
                  {activeRailTab === 'content' && t.drawerContentTitle}
                  {activeRailTab === 'layout' && t.drawerLayoutTitle}
                  {activeRailTab === 'ai-ats' && t.drawerAiAtsTitle}
                  {activeRailTab === 'data' && t.drawerDataTitle}
                  {activeRailTab === 'cover_letter' && t.coverLetterStudioTitle}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Thu gọn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs text-neutral-300">
              {/* ================= TAB 1: DESIGN ================= */}
              {activeRailTab === 'design' && (
                <DesignTab
                  lang={lang}
                  t={t}
                  activeTemplateDef={activeTemplateDef}
                  template={template}
                  setTemplate={setTemplate}
                  setShowGalleryModal={setShowGalleryModal}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  canvasBgTheme={canvasBgTheme}
                  handleSelectCanvasBgTheme={handleSelectCanvasBgTheme}
                  typographyConfig={typographyConfig}
                  setTypographyConfig={setTypographyConfig}
                  cv={cv}
                  setCv={setCv}
                  triggerAvatarUpload={triggerAvatarUpload}
                  handleRemoveAvatar={handleRemoveAvatar}
                  activeQrConfig={activeQrConfig}
                  handleUpdateQRConfig={handleUpdateQRConfig}
                  handleUpdateQRTargetUrl={handleUpdateQRTargetUrl}
                  qrDataUrl={qrDataUrl}
                  handleCopyQRUrl={handleCopyQRUrl}
                  qrCopied={qrCopied}
                  setActiveRailTab={setActiveRailTab}
                  setContentSubTab={setContentSubTab}
                />
              )}

              {/* ================= TAB 2: CONTENT ================= */}
              {activeRailTab === 'content' && (
                <ContentTab
                  lang={lang}
                  t={t}
                  cv={cv}
                  setCv={setCv}
                  drawerTab={drawerTab}
                  setDrawerTab={setDrawerTab}
                  sectionOrder={sectionOrder}
                  sectionVisibility={sectionVisibility}
                  handleAddCustomLink={handleAddCustomLink}
                  handleUpdateCustomLink={handleUpdateCustomLink}
                  handleToggleCustomLink={handleToggleCustomLink}
                  handleRemoveCustomLink={handleRemoveCustomLink}
                  handleMoveCustomLink={handleMoveCustomLink}
                  handleOpenTechModal={handleOpenTechModal}
                  handleQuickLintSkills={handleQuickLintSkills}
                  addTimelineItem={addTimelineItem}
                  updateTimelineItem={updateTimelineItem}
                  deleteTimelineItem={deleteTimelineItem}
                  addProjectItem={addProjectItem}
                  updateProjectItem={updateProjectItem}
                  deleteProjectItem={deleteProjectItem}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                  newSkillText={newSkillText}
                  setNewSkillText={setNewSkillText}
                  addEducationItem={addEducationItem}
                  updateEducationItem={updateEducationItem}
                  deleteEducationItem={deleteEducationItem}
                  removeCustomSection={removeCustomSection}
                  updateCustomSectionTitle={updateCustomSectionTitle}
                  updateCustomSectionContent={updateCustomSectionContent}
                  addCustomSectionItem={addCustomSectionItem}
                  updateCustomSectionItem={updateCustomSectionItem}
                  deleteCustomSectionItem={deleteCustomSectionItem}
                  setToastMessage={setToastMessage}
                />
              )}

              {/* ================= TAB 3: LAYOUT ================= */}
              {activeRailTab === 'layout' && (
                <LayoutTab
                  lang={lang}
                  setLang={setLang}
                  handleSwitchLanguage={handleSwitchLanguage}
                  t={t}
                  syncContactInfoBetweenLangs={syncContactInfoBetweenLangs}
                  isCompact={isCompact}
                  toggleCompactMode={toggleCompactMode}
                  canvasBgTheme={canvasBgTheme}
                  handleSelectCanvasBgTheme={handleSelectCanvasBgTheme}
                  typographyConfig={typographyConfig}
                  setTypographyConfig={setTypographyConfig}
                  sectionOrder={sectionOrder}
                  sectionVisibility={sectionVisibility}
                  cv={cv}
                  resetSections={resetSections}
                  toggleSectionVisibility={toggleSectionVisibility}
                  moveSection={moveSection}
                  removeCustomSection={removeCustomSection}
                  addCustomSection={addCustomSection}
                  zoom={zoom}
                  setZoom={setZoom}
                />
              )}

              {/* ================= TAB 4: AI & ATS ================= */}
              {activeRailTab === 'ai-ats' && (
                <AiAtsTab
                  lang={lang}
                  t={t}
                  cvStrength={cvStrength}
                  setShowStrengthModal={setShowStrengthModal}
                  jdMatchResult={jdMatchResult}
                  setShowJDModal={setShowJDModal}
                  selectedSampleJdId={selectedSampleJdId}
                  handleSelectSampleJD={handleSelectSampleJD}
                  techLintReport={techLintReport}
                  setShowTechLinterModal={setShowTechLinterModal}
                  handleFixAllTechIssues={handleFixAllTechIssues}
                  handleOpenTechModal={handleOpenTechModal}
                  setDrawerTab={setDrawerTab}
                  setActiveRailTab={setActiveRailTab}
                  setIsDrawerOpen={setIsDrawerOpen}
                />
              )}

              {/* ================= TAB 5: DATA ================= */}
              {activeRailTab === 'data' && (
                <DataTab
                  lang={lang}
                  t={t}
                  profiles={profiles}
                  activeProfileId={activeProfileId}
                  handleSwitchProfile={handleSwitchProfile}
                  handleDuplicateProfile={handleDuplicateProfile}
                  handleDeleteProfile={handleDeleteProfile}
                  setShowNewProfileModal={setShowNewProfileModal}
                  handleExportFullJSON={handleExportFullJSON}
                  handleExportCurrentProfileJSON={handleExportCurrentProfileJSON}
                  handleCopyJSON={handleCopyJSON}
                  setShowImportModal={setShowImportModal}
                  setParsedResult={setParsedResult}
                  setParseError={setParseError}
                  jsonFileInputRef={jsonFileInputRef}
                  importPreview={importPreview}
                  setImportPreview={setImportPreview}
                  importErrorMsg={importErrorMsg}
                  setImportErrorMsg={setImportErrorMsg}
                  handleApplyImport={handleApplyImport}
                  handleReset={handleReset}
                />
              )}

              {/* ================= TAB 6: MATCHING COVER LETTER STUDIO ================= */}
              {activeRailTab === 'cover_letter' && (
                <CoverLetterTab
                  lang={lang}
                  t={t}
                  currentCoverLetter={currentCoverLetter}
                  handleSyncCoverLetterWithCV={handleSyncCoverLetterWithCV}
                  handleCopyCoverLetterText={handleCopyCoverLetterText}
                  isCoverLetterCopied={isCoverLetterCopied}
                  activeCoverLetterPresetId={activeCoverLetterPresetId}
                  handleApplyCoverLetterPreset={handleApplyCoverLetterPreset}
                  handleUpdateCoverLetterField={handleUpdateCoverLetterField}
                  setDocMode={setDocMode}
                  setActiveRailTab={setActiveRailTab}
                />
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-white/10 bg-[#111827] flex items-center justify-between">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? t.saving : t.save}</span>
              </button>
            </div>
          </aside>
        )}

        {/* Small Screen Backdrop */}
        {!isPreviewMode && isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="no-print lg:hidden fixed inset-0 bg-black/60 z-10 backdrop-blur-xs"
          />
        )}

{/* ================= TEMPLATE GALLERY MODAL ================= */}
      {/* ================= TEMPLATE GALLERY MODAL ================= */}
      <TemplateGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        currentTemplate={template}
        onSelectTemplate={(tpl) => setTemplate(tpl)}
        t={t}
        lang={lang}
      />

      {/* ================= CV PARSER / PDF & DOC IMPORT MODAL ================= */}
      <CVParserModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setParsedResult(null);
          setParseError(null);
        }}
        lang={lang}
        t={t}
        importTab={importTab}
        setImportTab={setImportTab}
        importFile={importFile}
        setImportFile={setImportFile}
        importRawText={importRawText}
        setImportRawText={setImportRawText}
        isParsingCV={isParsingCV}
        parseError={parseError}
        setParseError={setParseError}
        parsedResult={parsedResult}
        setParsedResult={setParsedResult}
        importPreviewTab={importPreviewTab}
        setImportPreviewTab={setImportPreviewTab}
        cvFileInputRef={cvFileInputRef}
        handleParseFile={handleParseFile}
        handleParseRawText={handleParseRawText}
        handleApplyImportedCV={handleApplyImportedCV}
      />

      {/* ================= NEW CV PROFILE MODAL ================= */}
      <NewProfileModal
        isOpen={showNewProfileModal}
        onClose={() => setShowNewProfileModal(false)}
        lang={lang}
        newProfileName={newProfileName}
        setNewProfileName={setNewProfileName}
        newProfileRole={newProfileRole}
        setNewProfileRole={setNewProfileRole}
        newProfileCloneFromCurrent={newProfileCloneFromCurrent}
        setNewProfileCloneFromCurrent={setNewProfileCloneFromCurrent}
        onCreateProfile={handleCreateNewProfile}
      />

      {/* ================= CV DATA EXPORT / IMPORT MODAL ================= */}
      <DataBackupModal
        isOpen={showDataModal}
        onClose={() => {
          setShowDataModal(false);
          setImportPreview(null);
          setImportErrorMsg(null);
        }}
        lang={lang}
        t={t}
        dataModalTab={dataModalTab}
        setDataModalTab={setDataModalTab}
        importPreview={importPreview}
        setImportPreview={setImportPreview}
        importErrorMsg={importErrorMsg}
        setImportErrorMsg={setImportErrorMsg}
        jsonFileInputRef={jsonFileInputRef}
        handleExportFullJSON={handleExportFullJSON}
        handleExportCurrentProfileJSON={handleExportCurrentProfileJSON}
        handleCopyJSON={handleCopyJSON}
        handleApplyImport={handleApplyImport}
        processImportFile={processImportFile}
      />

      {/* ================= TECH BULLET POINTS LIBRARY MODAL ================= */}
      <TechBulletsModal
        isOpen={showTechModal}
        onClose={() => setShowTechModal(false)}
        lang={lang}
        t={t}
        cv={cv}
        techTarget={techTarget}
        setTechTarget={setTechTarget}
        techSearchQuery={techSearchQuery}
        setTechSearchQuery={setTechSearchQuery}
        techCategoryFilter={techCategoryFilter}
        setTechCategoryFilter={setTechCategoryFilter}
        copiedBulletId={copiedBulletId}
        insertedBulletId={insertedBulletId}
        handleCopyBullet={handleCopyBullet}
        handleInsertBullet={handleInsertBullet}
      />

      {/* ================= CV STRENGTH & ATS CHECKLIST MODAL ================= */}
      <CVStrengthModal
        isOpen={showStrengthModal}
        onClose={() => setShowStrengthModal(false)}
        lang={lang}
        t={t}
        cv={cv}
        cvStrength={cvStrength}
        onOpenTechModal={() => setShowTechModal(true)}
        onNavigateDrawer={(tab) => {
          setDrawerTab(tab as any);
          setActiveRailTab('content');
          setIsDrawerOpen(true);
        }}
      />

      {/* ================= JD MATCHER & KEYWORD GAP MODAL ================= */}
      <JDMatcherModal
        isOpen={showJDModal}
        onClose={() => setShowJDModal(false)}
        lang={lang}
        t={t}
        cv={cv}
        jdInputText={jdInputText}
        setJdInputText={setJdInputText}
        selectedSampleJdId={selectedSampleJdId}
        setSelectedSampleJdId={setSelectedSampleJdId}
        jdMatchResult={jdMatchResult}
        jdFilter={jdFilter}
        setJdFilter={setJdFilter}
        handleSelectSampleJD={handleSelectSampleJD}
        handleAddKeywordToSkills={handleAddKeywordToSkills}
        handleCopyKeyword={handleCopyKeyword}
        copiedKeyword={copiedKeyword}
        addedSkillKeyword={addedSkillKeyword}
      />

      {/* ================= MAIN CV WORKSPACE CANVAS ================= */}
      <main
        className="flex-1 h-full overflow-y-auto relative flex flex-col items-center py-8 sm:py-12 px-4 sm:px-10 pb-32 no-scrollbar transition-all"
        style={currentCanvasBg.style}
      >
        {/* Minimal Floating Status Pill */}
        <div className="no-print mb-4 px-4 py-1.5 rounded-full bg-[#161B26]/90 border border-white/10 backdrop-blur-md shadow-lg text-[11px] text-neutral-400 flex items-center space-x-2 select-none flex-wrap justify-center flex-shrink-0">
          {isPublicView ? (
            <>
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.publicVerifiedBadge}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
                <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300">
                {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">
                {lang === 'en' ? 'Verified Recruiter View' : 'Chế độ xem trực tuyến cho Nhà tuyển dụng'}
              </span>
            </>
          ) : docMode === 'cover_letter' ? (
            <>
              <span className="flex items-center space-x-1">
                <span className="text-purple-400 font-semibold flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Matching Cover Letter' : 'Thư xin việc đồng bộ'}</span>
                </span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu đồng bộ:'}</span>
                <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="text-neutral-400 hidden sm:inline">
                {lang === 'en' ? 'Click any text on letter to edit directly' : 'Nhấp trực tiếp vào chữ trên thư để chỉnh sửa'}
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
                <strong className="text-white font-medium">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className={isCompact ? 'text-amber-400 font-medium' : 'text-neutral-400'}>
                {isCompact ? (lang === 'en' ? '1-Page Fit' : 'Chuẩn 1 trang A4') : (lang === 'en' ? 'Standard' : 'Tiêu chuẩn')}
              </span>
              <span className="text-neutral-600">•</span>
              <span
                className="flex items-center space-x-1 font-mono font-semibold"
                style={{
                  color: cvStrength.score >= 90 ? '#34d399' : cvStrength.score >= 75 ? '#22d3ee' : cvStrength.score >= 50 ? '#fbbf24' : '#fb7185',
                }}
              >
                <Gauge className="w-3 h-3" />
                <span>{cvStrength.score}% ATS</span>
              </span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="text-neutral-400 hidden sm:inline">
                {lang === 'en' ? 'Click any text on CV to edit directly' : 'Nhấp trực tiếp vào chữ để sửa'}
              </span>
            </>
          )}
        </div>
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="transition-transform duration-200"
        >
          {/* ================= THE A4 SHEET ================= */}
          <CVReadOnlyContext.Provider value={isPublicView}>
            {docMode === 'cover_letter' ? (
              <CoverLetterCanvas
                coverLetter={currentCoverLetter}
                template={template}
                accentColor={accentColor}
                fontFamily={fontFamily}
                lang={lang}
                onUpdateField={handleUpdateCoverLetterField}
                isEditable={!isPublicView}
              />
            ) : isLoading ? (
            <CVSkeletonLoading />
          ) : (
            <div
              id="cv-paper"
              className={`cv-paper bg-white text-neutral-900 shadow-2xl relative w-[210mm] min-h-[297mm] rounded-sm ${fontClass} ${
                isCompact ? 'cv-compact leading-snug' : 'leading-relaxed'
              } ${isPublicView ? 'cv-public-view' : ''} overflow-hidden animate-in fade-in duration-300`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                ['--cv-body-size' as any]: `${typographyConfig.bodyFontSize}px`,
                ['--cv-heading-size' as any]: `${typographyConfig.headingFontSize}px`,
                ['--cv-line-height' as any]: `${typographyConfig.lineHeight}`,
                ['--cv-section-gap' as any]: `${typographyConfig.sectionSpacing}px`,
                ['--cv-item-gap' as any]: `${typographyConfig.itemSpacing}px`,
                ['--cv-pad-top-bottom' as any]: `${typographyConfig.pagePaddingTopBottom}px`,
                ['--cv-pad-left-right' as any]: `${typographyConfig.pagePaddingLeftRight}px`,
              }}
            >
              {/* 1-Page A4 Cutoff Indicator Line (Only visible on screen, never printed) */}
              <div
                className="no-print absolute left-0 right-0 border-b-2 border-dashed border-amber-500/80 z-30 pointer-events-none flex items-center justify-end pr-3 select-none"
                style={{ top: '297mm' }}
              >
                <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-t font-mono shadow-sm tracking-wide">
                  ✂ Giới hạn trang 1 (297mm) — Nội dung bên dưới sẽ tràn sang trang 2
                </span>
              </div>

            {/* Dynamic Template Switcher (10 Architectural Templates) */}
            <CVTemplateSwitch {...commonTemplateProps} templateId={template} />

            {/* Dynamic Personal QR Code Footer Strip */}
            {activeQrConfig.enabled && activeQrConfig.position === 'footer' && (
              <div className="px-8 pb-4 pt-2">
                <CVQRCodeFooter
                  qrDataUrl={qrDataUrl}
                  config={activeQrConfig}
                  lang={lang}
                  accentColorHex={activeColor.primary}
                  candidateName={cv.name}
                  websiteUrl={getQRTargetText(activeQrConfig, cv)}
                />
              </div>
            )}
          </div>
        )}
        </CVReadOnlyContext.Provider>
        </div>
      </main>

        {/* Floating Zoom & Canvas Background Control Pill - Fixed at Bottom Right of Editor Canvas */}
        {!isPreviewMode && !isPublicView && (
          <div className="no-print absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center bg-[#161B26]/95 border border-white/10 rounded-full p-1 text-xs shadow-2xl backdrop-blur-md select-none transition-all hover:bg-[#161B26] hover:border-white/20">
            <button
              type="button"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={lang === 'en' ? 'Zoom Out (-10%)' : 'Thu nhỏ (-10%)'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="px-2.5 py-0.5 font-mono text-[11px] text-neutral-200 hover:text-white font-medium select-none cursor-pointer hover:bg-white/5 rounded-full transition-colors"
              title={lang === 'en' ? 'Click to reset to 100%' : 'Nhấp để reset về 100%'}
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={lang === 'en' ? 'Zoom In (+10%)' : 'Phóng to (+10%)'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-3.5 bg-white/15 mx-1" />

            {/* Quick Canvas Background Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBgPickerOpen(!isBgPickerOpen)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  isBgPickerOpen
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title={lang === 'en' ? 'Change Workspace Canvas Background' : 'Tùy chọn nền bàn làm việc'}
              >
                <Grid className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300" />
                <span className="hidden sm:inline text-[10px]">{currentCanvasBg.previewBadge}</span>
              </button>

              {/* Floating Quick Background Popover */}
              {isBgPickerOpen && (
                <div
                  ref={bgPickerRef}
                  className="absolute bottom-full right-0 mb-3 w-72 bg-[#121722]/98 border border-white/15 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-50 text-xs animate-in fade-in zoom-in-95 space-y-2.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center space-x-1.5">
                      <Grid className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-white text-[11px] uppercase tracking-wider">
                        {lang === 'en' ? 'Canvas Background' : 'Họa tiết nền Workspace'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBgPickerOpen(false)}
                      className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto no-scrollbar">
                    {CANVAS_BG_THEMES.map((theme) => {
                      const isSelected = canvasBgTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            handleSelectCanvasBgTheme(theme.id);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-[#182338] border-cyan-500 ring-1 ring-cyan-500/50 shadow-sm'
                              : 'bg-[#111827] border-white/10 hover:border-white/20 hover:bg-[#161F30]'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-white/10 mb-1.5 relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                            style={{
                              backgroundColor: theme.previewBg,
                              backgroundImage: theme.previewPattern || 'none',
                              backgroundSize: theme.style.backgroundSize || 'auto',
                            }}
                          >
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={`text-[11px] font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-neutral-200'}`}>
                              {lang === 'en' ? theme.nameEn : theme.nameVi}
                            </div>
                            <div className="text-[9px] text-neutral-400 truncate mt-0.5">
                              {theme.previewBadge}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: TECH NOMENCLATURE LINTER STUDIO ================= */}
      <TechLinterModal
        isOpen={showTechLinterModal}
        onClose={() => setShowTechLinterModal(false)}
        lang={lang}
        t={t}
        cv={cv}
        techLintReport={techLintReport}
        handleFixSingleTechIssue={handleFixSingleTechIssue}
        handleFixAllTechIssues={handleFixAllTechIssues}
        handleIgnoreTechIssue={handleIgnoreTechIssue}
        ignoredIssueIds={ignoredIssueIds}
        setToastMessage={setToastMessage}
      />

      {/* ================= MODAL: PUBLIC SHAREABLE WEB LINK ================= */}
      <PublicShareModal
        isOpen={isShareModalOpen && !isPublicView}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
        t={t}
        sharePublicUrl={sharePublicUrl}
        shareQrDataUrl={shareQrDataUrl}
        isShareCopied={isShareCopied}
        handleCopyShareUrl={handleCopyShareUrl}
        handleDownloadShareQr={handleDownloadShareQr}
        handleShareLinkedIn={handleShareLinkedIn}
        handleShareEmail={handleShareEmail}
        handleShareTwitter={handleShareTwitter}
        shareIncludeCoverLetter={shareIncludeCoverLetter}
        setShareIncludeCoverLetter={setShareIncludeCoverLetter}
        shareAllowDownload={shareAllowDownload}
        setShareAllowDownload={setShareAllowDownload}
        privacyHidePhone={privacyHidePhone}
        setPrivacyHidePhone={setPrivacyHidePhone}
        privacyHideLocation={privacyHideLocation}
        setPrivacyHideLocation={setPrivacyHideLocation}
        shareModalRef={shareModalRef}
        setToastMessage={setToastMessage}
      />

      {/* ================= MODAL: CONTACT CANDIDATE ================= */}
      <ContactCandidateModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        lang={lang}
        t={t}
        cv={cv}
        privacyHidePhone={privacyHidePhone}
      />

      {/* ================= MODAL: PUBLIC MOBILE QR CODE ================= */}
      <MobileQRModal
        isOpen={isPublicQrModalOpen}
        onClose={() => setIsPublicQrModalOpen(false)}
        lang={lang}
        t={t}
        shareQrDataUrl={shareQrDataUrl}
        handleDownloadShareQr={handleDownloadShareQr}
      />

      {/* ================= FULLSCREEN PREVIEW EXIT PILL ================= */}
      {isPreviewMode && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161B26]/95 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 text-xs text-neutral-200 select-none animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Exit Preview (ESC)' : 'Thoát xem trước (ESC)'}</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:text-white rounded"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-white">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:text-white rounded"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            title="Xuất PDF in ấn"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExportImage('png', 2)}
            disabled={isExportingImage}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Xuất ảnh PNG sắc nét (300 DPI)"
          >
            {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            <span>{isExportingImage ? (lang === 'en' ? 'Exporting...' : 'Đang xuất...') : (lang === 'en' ? 'PNG (HD)' : 'Ảnh PNG (HD)')}</span>
          </button>
        </div>
      )}

      {/* ================= PRINT & COMPACT CSS STYLES (A4 ACCURATE) ================= */}
      <style jsx global>{`
        /* Dynamic CV Typography Engine */
        .cv-paper.font-inter, .cv-paper.font-inter *:not([class*="font-mono"]) {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .cv-paper.font-bevietnam, .cv-paper.font-bevietnam *:not([class*="font-mono"]) {
          font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-jakarta, .cv-paper.font-jakarta *:not([class*="font-mono"]) {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-roboto, .cv-paper.font-roboto *:not([class*="font-mono"]) {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-merriweather, .cv-paper.font-merriweather *:not([class*="font-mono"]) {
          font-family: 'Merriweather', Georgia, serif !important;
        }
        .cv-paper.font-jetbrains, .cv-paper.font-jetbrains * {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }
        .cv-paper .font-mono {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }

        .cv-compact {
          line-height: 1.35 !important;
        }

        .cv-compact h1 {
          font-size: 1.65rem !important;
          margin-bottom: 2px !important;
        }

        .cv-compact h2 {
          font-size: 0.72rem !important;
          padding-bottom: 2px !important;
          margin-bottom: 4px !important;
        }

        .cv-compact p {
          line-height: 1.38 !important;
          margin-bottom: 2px !important;
        }

        /* Dynamic Fine-grain Typography Engine */
        .cv-paper {
          font-size: var(--cv-body-size, 13.5px);
          line-height: var(--cv-line-height, 1.45);
        }

        .cv-paper p,
        .cv-paper li,
        .cv-paper .text-\[11px\],
        .cv-paper .text-xs:not(h1 *):not(h2 *):not(.font-bold):not([class*="uppercase"]) {
          font-size: var(--cv-body-size, 13.5px) !important;
          line-height: var(--cv-line-height, 1.45) !important;
        }

        .cv-paper h2,
        .cv-paper h2 * {
          font-size: var(--cv-heading-size, 16.5px) !important;
        }

        /* Fine-grain Section Gap */
        .cv-paper .space-y-6 > * + *,
        .cv-paper .space-y-5 > * + *,
        .cv-paper .space-y-4 > * + * {
          margin-top: var(--cv-section-gap, 18px) !important;
        }

        /* Fine-grain Item Gap */
        .cv-paper .space-y-3 > * + *,
        .cv-paper .space-y-2 > * + * {
          margin-top: var(--cv-item-gap, 10px) !important;
        }

        /* Fine-grain Page Padding */
        .cv-paper .p-8,
        .cv-paper .p-7,
        .cv-paper .p-6,
        .cv-paper .p-5 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .px-8,
        .cv-paper .px-6,
        .cv-paper .px-5 {
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .py-8,
        .cv-paper .py-6,
        .cv-paper .py-5,
        .cv-paper .py-4 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
        }

        .cv-public-view .no-print {
          display: none !important;
        }

        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          .h-screen {
            height: auto !important;
            overflow: visible !important;
          }

          .overflow-hidden {
            overflow: visible !important;
          }

          header,
          nav,
          aside,
          .no-print,
          #customCursorWrapper,
          .noise-overlay,
          #preloader,
          #projectModal {
            display: none !important;
          }

          main {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            background-image: none !important;
            display: block !important;
          }

          main > div {
            transform: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .cv-paper {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            transform: none !important;
            background-color: #ffffff !important;
          }

          .cv-compact {
            max-height: 297mm !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .cv-editable {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
