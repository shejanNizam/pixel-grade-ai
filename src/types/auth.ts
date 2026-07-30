// ---------------------------------------------------------------------------
// Shapes aligned with the PixelGrade backend (pixel-grade-ai-server).
//
// Every successful response arrives in one envelope:
//   { statusCode, success, message, data, meta? }
// The RTK slices unwrap `data` via transformResponse, so components receive
// the payload types below directly. `meta` survives only on paginated lists.
// ---------------------------------------------------------------------------

export type UserRole = "user" | "admin" | "super_admin";

export interface TUser {
  _id: string;
  name: string;
  /** Public handle shown on the Creator Profile in place of the email. Absent
   *  until the user picks one — accounts predate the field. */
  username?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: { url: string; publicId: string };
  isEmailVerified: boolean;
  status: "active" | "blocked";
  isDeleted: boolean;
  /** Current plan name, joined in by the admin user list (active subscription
   *  → plan name, else "Free"). Absent on endpoints that don't compute it. */
  currentPlan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/** The backend's success envelope, pre-unwrap. */
export interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
}

// ---- auth flows -----------------------------------------------------------

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginData {
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

export interface SignupFormValues {
  name: string;
  /** Required at sign-up — this is the public Creator Profile handle. */
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

/** POST /user/register returns the created user (no tokens — the account
 *  must verify its email via OTP before it can log in).
 *
 *  `verificationEmailSent` reports whether the OTP mail actually went out. The
 *  account exists either way, so a false here means "tell them to hit resend",
 *  not "the signup failed". */
export type SignupData = TUser & { verificationEmailSent?: boolean };
