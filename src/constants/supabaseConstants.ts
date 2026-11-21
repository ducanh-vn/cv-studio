export const USER_CV_TABLE_NAME = 'user_cv_data';

export const SUPABASE_SETUP_SQL = `-- 1. Tạo bảng lưu trữ hồ sơ CV và Bảng theo dõi ứng tuyển
CREATE TABLE IF NOT EXISTS public.user_cv_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profiles JSONB NOT NULL DEFAULT '[]'::jsonb,
  job_applications JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_profile_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_cv UNIQUE (user_id)
);

-- 2. Kích hoạt Row Level Security (Bảo mật theo từng người dùng)
ALTER TABLE public.user_cv_data ENABLE ROW LEVEL SECURITY;

-- 3. Tạo chính sách bảo mật: Mỗi người chỉ xem và sửa CV của chính mình
CREATE POLICY "Users can view own cv data" 
  ON public.user_cv_data FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv data" 
  ON public.user_cv_data FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cv data" 
  ON public.user_cv_data FOR UPDATE 
  USING (auth.uid() = user_id);
`;

export const SUPABASE_ENV_SAMPLE = `# Cấu hình kết nối Supabase Cloud vào file .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

export const SUPABASE_TEXTS = {
  vi: {
    modalTitle: 'Hướng dẫn kết nối Supabase Cloud',
    modalSubtitle: 'Chỉ mất 2 phút để kích hoạt đăng nhập Google/GitHub và lưu trữ dữ liệu vĩnh viễn trên mây hoàn toàn miễn phí.',
    step1Title: '1. Tạo tài khoản & Dự án miễn phí',
    step1Desc: 'Truy cập https://supabase.com/dashboard và bấm "New Project" (chọn region Singapore để tốc độ nhanh nhất).',
    step2Title: '2. Lấy URL & Anon Key',
    step2Desc: 'Vào Project Settings → API, copy "Project URL" và "anon public" API key dán vào file .env.local ở thư mục gốc.',
    step3Title: '3. Chạy lệnh tạo bảng (SQL Editor)',
    step3Desc: 'Vào mục SQL Editor trên Supabase, dán đoạn mã SQL bên dưới rồi bấm Run để khởi tạo bảng dữ liệu có sẵn bảo mật RLS.',
    step4Title: '4. Bật Google / GitHub OAuth',
    step4Desc: 'Vào Authentication → Providers, bật công tắc Google hoặc GitHub và dán Client ID / Secret theo hướng dẫn của Supabase.',
    copySqlBtn: 'Sao chép mã SQL',
    copiedSql: 'Đã sao chép mã SQL!',
    copyEnvBtn: 'Sao chép mẫu .env.local',
    copiedEnv: 'Đã sao chép mẫu .env.local!',
    statusConnected: 'Đã kết nối Supabase Cloud',
    statusDemo: 'Đang chạy chế độ Demo (Chưa nhập Key)',
    guideBtn: 'Hướng dẫn cài đặt Supabase',
    closeBtn: 'Đã hiểu, đóng cửa sổ',
  },
  en: {
    modalTitle: 'Supabase Cloud Connection Guide',
    modalSubtitle: 'Takes only 2 minutes to enable authentic Google/GitHub OAuth and lifetime cloud storage for free.',
    step1Title: '1. Create free account & project',
    step1Desc: 'Go to https://supabase.com/dashboard and click "New Project" (select Singapore for fastest Asia latency).',
    step2Title: '2. Copy URL & Anon Key',
    step2Desc: 'Go to Project Settings → API, copy "Project URL" and "anon public" API key into your .env.local file.',
    step3Title: '3. Run Table Creation Script',
    step3Desc: 'Open SQL Editor on Supabase, paste the script below, and click Run to initialize tables with Row Level Security.',
    step4Title: '4. Enable Google / GitHub OAuth',
    step4Desc: 'Go to Authentication → Providers, toggle Google or GitHub, and paste your OAuth credentials.',
    copySqlBtn: 'Copy SQL Script',
    copiedSql: 'Copied SQL Script!',
    copyEnvBtn: 'Copy .env.local Sample',
    copiedEnv: 'Copied .env.local Sample!',
    statusConnected: 'Connected to Supabase Cloud',
    statusDemo: 'Running in Demo Mode (No keys set)',
    guideBtn: 'Supabase Setup Guide',
    closeBtn: 'Got it, close',
  },
} as const;
