import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { TCard } from "@/types/card";

// ---------------------------------------------------------------------------
// Grading reports. The admin list (`/grading/all`) goes through QueryBuilder,
// so any report field works as a plain filter param — `user: <id>` is how the
// admin user-details screen scopes it to one account.
// ---------------------------------------------------------------------------

export type TGradeLabel =
  "PR" | "FR" | "GOOD" | "VG" | "EX" | "NM" | "NM-MT" | "MINT" | "GEM-MT";

export type TDefectCategory = "surface" | "corners" | "edges" | "centering";
export type TDefectSeverity = "minor" | "moderate" | "severe";

/** One itemised defect. Present from model version `pixelgrade-v2`. */
export interface TDetectedDefect {
  category: TDefectCategory;
  severity: TDefectSeverity;
  location: string;
  description: string;
}

/** How usable the photographs were — the input that justifies `confidence`. */
export interface TImageQuality {
  /** 0-100. */
  score: number;
  issues: string[];
}

/** Measured front border ratios; 50/50 is perfectly centred. */
export interface TCentering {
  leftPct: number;
  topPct: number;
}

export interface TGradingReport {
  _id: string;
  analysis: string;
  /** Populated with name/email on the admin list; a bare id elsewhere. */
  user: string | { _id: string; name: string; email: string };
  /** Populated catalogue card on reads; a bare id otherwise. */
  card: TCard | string;
  /** 0-10, decimals allowed. */
  grade: number;
  gradeLabel: TGradeLabel;
  scoreSurface: number;
  scoreCorners: number;
  scoreEdges: number;
  scoreCentering: number;
  /** 0-100%. */
  confidence: number;
  reasoning?: string;
  /** All three are absent on reports graded before `pixelgrade-v2`. Old reports
   *  are never back-filled — they keep the grade they were issued with — so
   *  every consumer must render without them. */
  imageQuality?: TImageQuality;
  centering?: TCentering;
  detectedDefects?: TDetectedDefect[];
  pixelVerified: boolean;
  modelVersion: string;
  reportPdfUrl?: string;
  createdAt?: string;
}

export interface GradingReportListParams {
  page?: number;
  limit?: number;
  sort?: string;
  /** Filter to one user's reports (admin list only). */
  user?: string;
  /** Server-side filter, passed straight through QueryBuilder. Counting these
   *  client-side would only ever count the current page. */
  pixelVerified?: boolean;
}

export const gradingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Runs the AI grade on a CONFIRMED analysis. Slow (an OpenAI vision
     *  call) unless the image-set hash is already in the grading cache;
     *  idempotent — re-grading a graded analysis returns the existing report. */
    gradeAnalysis: builder.mutation<TGradingReport, string>({
      query: (analysisId) => ({
        url: `/grading/${analysisId}`,
        method: "POST",
      }),
      transformResponse: (res: TResponse<TGradingReport>) => res.data,
      invalidatesTags: ["grading", "analysis", "dashboard"],
    }),

    /** Admin-only list across all users. */
    getAllGradingReports: builder.query<
      { data: TGradingReport[]; meta?: TMeta },
      GradingReportListParams | void
    >({
      query: (params) => ({
        url: "/grading/all",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TGradingReport[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["grading"],
    }),

    getMyGradingReports: builder.query<
      { data: TGradingReport[]; meta?: TMeta },
      GradingReportListParams | void
    >({
      query: (params) => ({
        url: "/grading",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TGradingReport[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["grading"],
    }),
  }),
});

export const {
  useGradeAnalysisMutation,
  useGetAllGradingReportsQuery,
  useGetMyGradingReportsQuery,
} = gradingApi;
