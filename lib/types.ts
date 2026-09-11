import type {
  CreatorStatus,
  Source,
  UserType,
  WaitlistStatus,
} from "@/lib/constants";

export type WaitlistUser = {
  id: string;
  full_name: string;
  email: string;
  user_type: UserType;
  portfolio_url: string | null;
  framer_profile_url: string | null;
  template_count: number | null;
  description: string | null;
  marketing_consent: boolean;
  source: Source;
  referral_code: string;
  referred_by: string | null;
  status: WaitlistStatus;
  creator_status: CreatorStatus | null;
  created_at: string;
  updated_at: string;
};

export type WaitlistInsert = {
  full_name: string;
  email: string;
  user_type: UserType;
  portfolio_url?: string | null;
  framer_profile_url?: string | null;
  template_count?: number | null;
  description?: string | null;
  marketing_consent: boolean;
  source: Source;
  referral_code: string;
  referred_by?: string | null;
  status: WaitlistStatus;
  creator_status?: CreatorStatus | null;
};

export type DashboardStats = {
  total: number;
  creators: number;
  today: number;
  week: number;
  converted: number;
  conversionRate: number;
};

export type SignupPoint = {
  day: string;
  total: number;
  creators: number;
};

export type UserTypeBreakdown = {
  type: UserType;
  count: number;
};

export type PaginatedWaitlist = {
  rows: WaitlistUser[];
  total: number;
  page: number;
  pageSize: number;
};
