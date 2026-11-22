# CV Studio — Professional CV & Resume Builder SaaS

Nền tảng tạo, chỉnh sửa và quản lý hồ sơ ứng tuyển (CV / Resume) & Thư xin việc (Cover Letter) chuyên nghiệp, tối ưu hóa theo quy chuẩn ATS (Applicant Tracking System), tích hợp bộ công cụ phân tích từ khóa JD, chuẩn hóa danh pháp công nghệ và đồng bộ dữ liệu đám mây.

- **Production Live App:** [https://cv-studio-sass.vercel.app/](https://cv-studio-sass.vercel.app/)
- **Repository:** [https://github.com/ducanh-vn/cv-studio.git](https://github.com/ducanh-vn/cv-studio.git)

---

## 1. Tổng quan dự án (Overview)

CV Studio được thiết kế nhằm giải quyết bài toán tạo lập hồ sơ ứng tuyển chất lượng cao cho các kỹ sư phần mềm, lập trình viên và chuyên gia công nghệ. Ứng dụng cung cấp trải nghiệm WYSIWYG mượt mà, đo lường dung lượng trang theo thời gian thực và đảm bảo định dạng xuất ra luôn chuẩn xác.

### Các tính năng cốt lõi đang hoạt động:
- **10 Mẫu CV chuẩn ATS chuyên sâu:** 10 mẫu giao diện được thiết kế tối ưu cho máy quét ATS và nhà tuyển dụng: `Rabbit` (Layout 2 cột chuẩn Tech Lead), `Chicken`, `Basic`, `Bubbles`, `Cascade`, `Crisp`, `Decker`, `Editorial`, `Enfold`, `Iconic`. Đảm bảo layout cố định khi in ấn, không bị vỡ cột hay tràn lề.
- **Thước đo dung lượng trang A4 thông minh (A4 Page Gauge):** Tự động đo lường tỷ lệ chiều cao nội dung so với chuẩn A4 (297mm / 1123px ở 96 DPI). Hiển thị trực quan trạng thái co dãn (vừa khít 100% hay tràn sang trang 2), kèm công cụ tự động căn chỉnh lề/cỡ chữ để gói gọn vừa khít 1 trang.
- **Bộ chuẩn hóa danh pháp công nghệ (Tech Linter):** Tự động phát hiện và sửa các lỗi sai chính tả, viết hoa/thường không chuẩn của **120+ công nghệ** (`TypeScript`, `Node.js`, `Next.js`, `Docker`, `PostgreSQL`, `Tailwind CSS`...). Hỗ trợ chuẩn hóa 1-chạm hoặc chỉnh sửa từng mục.
- **Phân tích độ khớp Job Description (JD Matcher):** Cho phép dán bản mô tả công việc (JD) để tính điểm số độ khớp ATS (0 — 100%), đối soát các từ khóa công nghệ đã có và gợi ý từ khóa còn thiếu để thêm nhanh vào CV.
- **Trình trích xuất CV đa định dạng (CV Parser API):** Tự động trích xuất nội dung từ các định dạng file `.pdf`, `.docx` (Word), `.txt`, `.json` hoặc dán trực tiếp từ bộ nhớ tạm thông qua API Route `/api/cv/parse`.
- **Bảng Kanban theo dõi ứng tuyển (Job Application Tracker):** Quản lý tiến trình rải hồ sơ theo quy trình tuyển dụng qua 5 trạng thái: *Wishlist*, *Đã nộp (Applied)*, *Phỏng vấn (Interviewing)*, *Nhận Offer*, và *Bị từ chối (Rejected)*.
- **Xác thực linh hoạt & Đồng bộ đám mây (Hybrid Auth & Cloud Sync):**
  - **Chế độ Khách (Guest Mode):** Lưu trữ toàn bộ dữ liệu ngay lập tức trên `localStorage`, không bắt buộc đăng nhập.
  - **Chế độ Đám mây (Supabase Auth):** Hỗ trợ đăng nhập Google và GitHub OAuth. Tự động đồng bộ nhiều phiên bản hồ sơ và dữ liệu ứng tuyển vào cơ sở dữ liệu PostgreSQL có bảo mật Row Level Security (RLS).
- **Hệ thống Typography & Tùy biến sâu:** 7 thanh trượt điều chỉnh chi tiết kích thước font họ tên, tiêu đề, nội dung, căn lề trên/dưới, lề trái/phải, khoảng cách giữa các phần tử và hỗ trợ song ngữ tức thì (**Tiếng Việt ⟷ Tiếng Anh**).
- **Mã QR cá nhân động (Dynamic QR Code):** Tự động tạo mã QR dẫn tới Portfolio cá nhân, trang xem trực tuyến công khai hoặc danh thiếp vCard.
- **Xuất bản đa dạng:** In trực tiếp ra PDF chuẩn trang in A4 (`@media print`), xuất ảnh PNG/JPEG chất lượng cao (`html-to-image`), và sao lưu / khôi phục dữ liệu qua file JSON.

---

## 2. Tech Stack

| Thành phần | Công nghệ / Thư viện | Mô tả |
|---|---|---|
| **Core Framework** | **Next.js 14.2.15** (App Router) | Hỗ trợ Server Components, Client Components và Route Handlers |
| **Language** | **TypeScript 5.6** | Đảm bảo tính chặt chẽ về mặt kiểu dữ liệu trên toàn bộ dự án |
| **Styling** | **Tailwind CSS 3.4**, PostCSS, Autoprefixer | Xây dựng giao diện responsive, dark mode và quy chuẩn in ấn A4 |
| **Iconography** | **Lucide React** | Bộ icon vector hiện đại, tối ưu kích thước bundle |
| **Backend as a Service** | **Supabase** (`@supabase/supabase-js`) | Quản lý xác thực OAuth và lưu trữ cơ sở dữ liệu PostgreSQL |
| **Database** | **PostgreSQL** (Supabase Cloud) | Lưu trữ JSONB hồ sơ CV và bảng Kanban ứng tuyển với RLS |
| **Authentication** | **Supabase Auth** | Đăng nhập bảo mật qua Google OAuth và GitHub OAuth |
| **Document Parsing** | **pdf-parse**, **mammoth** | Trích xuất văn bản từ tệp PDF và Microsoft Word (.docx) |
| **Image & QR Utilities** | **html-to-image**, **qrcode** | Rasterize giao diện DOM sang ảnh và sinh mã QR vector |
| **CSS Utilities** | **clsx**, **tailwind-merge** | Xử lý class linh hoạt và tránh xung đột class trong Tailwind |

---

## 3. Kiến trúc thư mục (Project Structure)

Mã nguồn được cấu trúc theo nguyên tắc module hóa cao, phân tách rõ ràng giữa giao diện hiển thị, trạng thái và hàm xử lý nghiệp vụ:

```text
cv-studio/
├── .env.example                 # File mẫu cấu hình biến môi trường
├── .env.local                   # Biến môi trường cục bộ (không commit)
├── next.config.mjs              # Cấu hình Next.js (cho phép remote images)
├── tailwind.config.ts           # Cấu hình theme màu và typography của Tailwind
├── tsconfig.json                # Cấu hình TypeScript compiler và path alias (@/*)
├── package.json                 # Định nghĩa scripts và dependencies
└── src/
    ├── app/                     # Next.js 14 App Router
    │   ├── api/cv/              # API Route lưu trữ dữ liệu local (/api/cv)
    │   │   └── parse/           # API Route trích xuất file PDF/Word (/api/cv/parse)
    │   ├── auth/callback/       # Route xử lý OAuth Callback từ Supabase Auth
    │   ├── cv/                  # Các route xem và chia sẻ CV độc lập
    │   │   ├── share/           # Route xem CV công khai (đã ẩn số điện thoại/email)
    │   │   └── view/            # Route hiển thị CV tối giản
    │   ├── globals.css          # Global CSS, cấu hình in ấn @media print & A4 canvas
    │   ├── layout.tsx           # Root HTML layout, font setup và metadata
    │   └── page.tsx             # Trang chính khởi chạy CV Builder Workspace
    ├── components/              # Các thành phần giao diện phân theo chức năng
    │   ├── auth/                # Modal đăng nhập (AuthModal) & Menu tài khoản (UserSyncMenu)
    │   ├── canvas/              # Vùng vẽ trang A4, thước đo dung lượng, thanh công cụ nổi
    │   ├── modals/              # Các modal độc lập: Tech Linter, JD Matcher, Share, Import
    │   ├── sidebar/             # Các ngăn kéo chỉnh sửa: Nội dung, Giao diện, Bố cục, Left Rail
    │   ├── templates/           # 10 mẫu template CV chuẩn ATS và bộ chuyển switch template
    │   ├── topbar/              # Thanh điều hướng trên cùng, profile switcher và các nút tác vụ
    │   └── tracker/             # Bảng Kanban theo dõi ứng tuyển (Job Application Tracker)
    ├── constants/               # Cấu hình mặc định, kích thước chuẩn A4, SQL schema Supabase
    ├── data/                    # Dữ liệu khởi tạo mặc định (cv.json, cvTranslations.ts)
    ├── hooks/                   # Custom React Hooks quản lý state, API, history và layout
    ├── lib/                     # Các hàm thuần logic (pure functions): A4 calc, export, parser...
    └── types/                   # Định nghĩa TypeScript interfaces (CV, Auth, JobTracker, Supabase)
```

### Vai trò các thư mục cốt lõi trong `src/`:
- **`src/types/`**: Chứa toàn bộ định nghĩa kiểu dữ liệu của ứng dụng (`cvBuilder.ts`, `auth.ts`, `supabase.ts`, `jobTracker.ts`, `a4PageGauge.ts`).
- **`src/constants/`**: Chứa các giá trị cấu hình tĩnh, danh bạ dịch thuật i18n, các mốc đo lề A4 và đoạn mã khởi tạo bảng SQL Supabase.
- **`src/lib/`**: Chứa các hàm xử lý độc lập không phụ thuộc vào React state: kết nối Supabase, thuật toán tính điểm ATS, bộ lọc chính tả Tech Linter, sinh mã QR, xuất ảnh Canvas.
- **`src/hooks/`**: Đóng gói toàn bộ logic quản lý trạng thái: `useCVBuilder` (quản trị nội dung CV), `useAuth` (xác thực Supabase), `useCVProfiles` (đa hồ sơ), `useA4PageGauge` (thước đo A4), `useJobTracker` (Kanban).
- **`src/components/`**: Các UI components tuân thủ quy tắc dưới 350 dòng/file, chia nhỏ theo từng phân vùng trực quan (Canvas, Topbar, Sidebar, Templates, Modals).

---

## 4. Cài đặt & Chạy local (Getting Started)

### Yêu cầu môi trường:
- **Node.js**: Phiên bản `>= 18.17.0` (Khuyến nghị sử dụng Node.js 18 hoặc 20 LTS).
- **Package Manager**: `npm` (đi kèm Node) hoặc `pnpm` / `yarn`.

### Các bước cài đặt:

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/ducanh-vn/cv-studio.git
   cd cv-studio
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Cấu hình file biến môi trường:**
   Tạo file `.env.local` từ file mẫu `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   *(Nếu chưa có tài khoản Supabase, bạn vẫn có thể khởi chạy bình thường. Ứng dụng sẽ tự động kích hoạt chế độ Demo/Guest Mode và lưu trữ trên `localStorage`).*

4. **Khởi chạy Development Server:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khởi chạy tại cổng **3001**:
   ```text
   http://localhost:3001
   ```

---

## 5. Cấu hình biến môi trường (Environment Variables)

Ứng dụng sử dụng các biến môi trường sau trong `.env.local` hoặc cấu hình trên nền tảng Deployment:

| Tên biến | Bắt buộc | Mô tả & Cách lấy | Giá trị mẫu |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Không *(Khuyên dùng)* | URL của dự án Supabase. Lấy tại **Supabase Dashboard → Project Settings → API → Project URL**. | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Không *(Khuyên dùng)* | Khóa API công khai phía Client. Lấy tại **Supabase Dashboard → Project Settings → API → Project API Keys (`anon public`)**. | `eyJhbGciOiJIUzI1NiIsIn...` |
| `NEXT_PUBLIC_SITE_NAME` | Không | Tên hiển thị của website trên Topbar và thẻ Meta. | `CV Studio` |
| `ADMIN_PASSWORD` | Không | Mật khẩu xác thực cho các tác vụ quản trị nội bộ. | `your_secure_password` |

### Hướng dẫn thiết lập Supabase Database & Auth

#### 1. Khởi tạo Bảng dữ liệu (SQL Schema)
Truy cập vào mục **SQL Editor** trên Supabase Dashboard và thực thi đoạn script sau để khởi tạo bảng `user_cv_data` cùng chính sách bảo mật cấp dòng (Row Level Security):

```sql
-- 1. Tạo bảng lưu trữ hồ sơ CV và Bảng theo dõi ứng tuyển
CREATE TABLE IF NOT EXISTS public.user_cv_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profiles JSONB NOT NULL DEFAULT '[]'::jsonb,
  job_applications JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_profile_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_cv UNIQUE (user_id)
);

-- 2. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.user_cv_data ENABLE ROW LEVEL SECURITY;

-- 3. Tạo chính sách bảo mật: Người dùng chỉ được xem/sửa dữ liệu của chính mình
CREATE POLICY "Users can view own cv data" 
  ON public.user_cv_data FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv data" 
  ON public.user_cv_data FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cv data" 
  ON public.user_cv_data FOR UPDATE 
  USING (auth.uid() = user_id);
```

#### 2. Cấu hình Redirect URLs cho Supabase Auth
Vào **Authentication → URL Configuration → Redirect URLs**, thêm các đường dẫn callback:
- Cho môi trường phát triển (Local): `http://localhost:3001/auth/callback`
- Cho môi trường Production (Vercel): `https://cv-studio-sass.vercel.app/auth/callback` (hoặc domain tùy chỉnh của bạn)

#### 3. Bật đăng nhập Google & GitHub OAuth
- **Google OAuth:** Tạo dự án trên *Google Cloud Console*, tạo *OAuth 2.0 Client ID*, điền Authorized Redirect URI mà Supabase cung cấp, sau đó sao chép Client ID & Secret dán vào mục **Supabase → Authentication → Providers → Google**.
- **GitHub OAuth:** Truy cập *GitHub Settings → Developer Settings → OAuth Apps*, tạo mới ứng dụng với Authorization callback URL từ Supabase, sau đó dán Client ID & Secret vào **Supabase → Authentication → Providers → GitHub**.

---

## 6. Scripts & Deployment

### Danh sách các lệnh Terminal:

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Khởi chạy máy chủ phát triển cục bộ tại cổng `3001` (`next dev -p 3001`) |
| `npm run build` | Kiểm tra kiểu TypeScript và đóng gói ứng dụng cho Production (`next build`) |
| `npm run start` | Khởi chạy máy chủ Production đã build tại cổng `3001` (`next start -p 3001`) |
| `npm run lint` | Chạy bộ kiểm tra cú pháp và quy chuẩn mã nguồn (`next lint`) |

### Hướng dẫn triển khai (Deployment):

#### Triển khai lên Vercel (Khuyến nghị)
1. Kết nối tài khoản GitHub với [Vercel](https://vercel.com).
2. Chọn **Add New Project** và trỏ đến repository `ducanh-vn/cv-studio`.
3. Trong mục **Environment Variables**, thêm các biến:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Bấm **Deploy**. Vercel sẽ tự động phát hiện framework Next.js, xây dựng và cấp phát tên miền SSL miễn phí.
5. Sau khi triển khai xong, hãy sao chép domain Vercel và cập nhật lại vào mục **Redirect URLs** trên Supabase.

#### Triển khai lên Netlify
1. Tạo dự án mới từ GitHub repository trên [Netlify](https://www.netlify.com).
2. Thiết lập build command: `npm run build`, publish directory: `.next`.
3. Bổ sung các biến môi trường tương tự như Vercel trong phần **Site configuration → Environment variables**.

---

## 📄 Bản quyền & Tác giả

Phát triển và duy trì bởi **[Nguyễn Đức Anh](https://ducanh.dev)**.  
Dự án được xây dựng với mục tiêu mang lại giải pháp kiến tạo hồ sơ nghề nghiệp hiện đại, minh bạch và hoàn toàn miễn phí cho cộng đồng lập trình viên.
