import type { AuthUser } from '@/types/auth';

export const AUTH_USER_STORAGE_KEY = 'cv_studio_auth_user';
export const AUTH_TOKEN_STORAGE_KEY = 'cv_studio_auth_token';
export const CLOUD_WORKSPACE_STORAGE_KEY = 'cv_studio_cloud_workspace';

export const DEFAULT_GUEST_USER: AuthUser = {
  id: 'guest',
  name: 'Khách vãng lai',
  email: 'guest@cvstudio.local',
  provider: 'guest',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const MOCK_GOOGLE_USER: AuthUser = {
  id: 'usr_g_ducanh',
  name: 'Nguyễn Đức Anh',
  email: 'ducanh.dev@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'google',
  createdAt: '2024-01-15T08:00:00.000Z',
  workspaceId: 'ws_ducanh_cloud',
};

export const MOCK_GITHUB_USER: AuthUser = {
  id: 'usr_gh_ducanh',
  name: 'ducanh-dev (Nguyễn Đức Anh)',
  email: 'contact@ducanh.dev',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  provider: 'github',
  createdAt: '2024-02-20T10:00:00.000Z',
  workspaceId: 'ws_ducanh_github',
};

export const AUTH_TEXTS = {
  vi: {
    modalTitle: 'Đồng bộ Cloud & Lưu vĩnh viễn',
    modalSubtitle: 'Lưu trữ toàn bộ CV, hồ sơ cá nhân và bảng theo dõi ứng tuyển lên đám mây để sử dụng mượt mà trên mọi thiết bị.',
    guestBadge: 'Bản lưu trên máy (Khách)',
    syncedBadge: 'Đã đồng bộ Cloud',
    syncingBadge: 'Đang đồng bộ...',
    localOnlyBadge: 'Lưu trên thiết bị',
    googleBtn: 'Tiếp tục với Google',
    githubBtn: 'Tiếp tục với GitHub',
    stayGuestBtn: 'Để sau, tiếp tục dùng như Khách',
    syncNowBtn: 'Đồng bộ dữ liệu ngay',
    signOutBtn: 'Đăng xuất tài khoản',
    switchGuestWarning: 'Đăng xuất sẽ chuyển về chế độ Khách. Dữ liệu trên Cloud vẫn được lưu an toàn.',
    syncSuccess: 'Đã đồng bộ toàn bộ dữ liệu lên Cloud thành công!',
    mergeNoticeTitle: 'Bảo lưu 100% dữ liệu đang làm',
    mergeNoticeDesc: 'Khi đăng nhập, toàn bộ CV và danh sách ứng tuyển hiện tại trên máy của bạn sẽ được tự động gộp vào tài khoản đám mây mà không bị mất mát.',
    benefit1: 'Đồng bộ hai chiều tức thì giữa máy tính và điện thoại.',
    benefit2: 'Không lo mất dữ liệu khi xóa cache hay duyệt web ẩn danh.',
    benefit3: 'Bảo mật tuyệt đối, hoàn toàn miễn phí trọn đời.',
    lastSyncedPrefix: 'Đồng bộ lúc: ',
    neverSynced: 'Chưa đồng bộ lên đám mây',
    workspaceTitle: 'Không gian làm việc Cloud',
  },
  en: {
    modalTitle: 'Cloud Sync & Permanent Storage',
    modalSubtitle: 'Save all your CVs, customized profiles, and job tracker applications to the cloud for seamless access across all devices.',
    guestBadge: 'Local Guest Mode',
    syncedBadge: 'Cloud Synced',
    syncingBadge: 'Syncing...',
    localOnlyBadge: 'Local device only',
    googleBtn: 'Continue with Google',
    githubBtn: 'Continue with GitHub',
    stayGuestBtn: 'Maybe later, continue as Guest',
    syncNowBtn: 'Sync data now',
    signOutBtn: 'Sign out',
    switchGuestWarning: 'Signing out reverts to Guest mode. Your Cloud data remains safely stored.',
    syncSuccess: 'All data successfully synchronized to the Cloud!',
    mergeNoticeTitle: 'Preserve 100% of current work',
    mergeNoticeDesc: 'When you sign in, all existing CVs and job tracker cards on this browser are automatically merged into your cloud account.',
    benefit1: 'Instant two-way sync between your laptop, tablet, and phone.',
    benefit2: 'Never lose work when clearing browser cookies or using incognito.',
    benefit3: 'End-to-end privacy, completely free lifetime storage.',
    lastSyncedPrefix: 'Last synced: ',
    neverSynced: 'Not synced to cloud yet',
    workspaceTitle: 'Cloud Workspace',
  },
} as const;
