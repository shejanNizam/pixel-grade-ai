"use client";

import AuthHeader, { authPrimaryBtn } from "@/components/auth/AuthHeader";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Input, InputRef } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

/**
 * Email verification via OTP. Arrives from signup (or from a login attempt on
 * an unverified account) with ?email=… — verifying flips isEmailVerified so
 * login stops refusing with 403.
 */
const VerifyCodeInner: React.FC = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(InputRef | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  const handleVerify = async (otp?: string): Promise<void> => {
    if (!email) {
      message.error("Missing email. Start again from the signup page.");
      return;
    }
    try {
      await verifyOtp({ email, otp: otp ?? code.join("") }).unwrap();
      message.success("Email verified! You can sign in now.");
      router.push("/login");
    } catch (error) {
      message.error(getApiErrorMessage(error, "Invalid or expired code."));
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!email) {
      message.error("Missing email. Start again from the signup page.");
      return;
    }
    try {
      await sendOtp({ email }).unwrap();
      message.success("A new code is on its way.");
    } catch (error) {
      // The OTP route is rate limited to 5/hour — surface that clearly.
      message.error(getApiErrorMessage(error, "Could not resend the code."));
    }
  };

  const handleChange = (value: string, index: number): void => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "") && index === 5) {
      void handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      message.error("Please paste only numeric digits");
      return;
    }

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();

    if (pastedData.length === 6) {
      void handleVerify(pastedData);
    }
  };

  return (
    <>
      <AuthHeader
        title="Verify email"
        subtitle={email ? `We sent a 6-digit code to ${email}` : undefined}
      />

      <div className="mb-6 flex justify-center gap-2 sm:gap-3">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            maxLength={1}
            inputMode="numeric"
            aria-label={`Digit ${index + 1}`}
            className="auth-otp"
          />
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        block
        loading={isVerifying}
        onClick={() => void handleVerify()}
        disabled={code.some((digit) => digit === "")}
        className={authPrimaryBtn}
      >
        Verify
      </Button>

      <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={isResending}
          className="cursor-pointer font-medium text-violet-500 hover:text-violet-400 disabled:opacity-50"
        >
          {isResending ? "Sending…" : "Resend"}
        </button>
      </p>
    </>
  );
};

// useSearchParams demands a Suspense boundary in the App Router.
const VerifyCode: React.FC = () => (
  <Suspense fallback={null}>
    <VerifyCodeInner />
  </Suspense>
);

export default VerifyCode;
