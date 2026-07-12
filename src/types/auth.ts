// ==================== TYPES (Aligned with your API) ====================
export interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    subscription_type: string;
    profile_picture: string | null;
    created_at: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

// ==================== TYPES (Aligned with your API) ====================
export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error: string;
  data: {
    errors?: {
      field?: string;
      message?: string;
    }[];
    error: string;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  subscription_type: "none" | "tool" | "learning" | "both";
  subscription_status: string;
  profile_picture: string | null;
  created_at: string;
  onboarding_completed: boolean;
  session_state?: string | null;
}
