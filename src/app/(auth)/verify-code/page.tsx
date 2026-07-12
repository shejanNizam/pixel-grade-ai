"use client";

import AuthHeader, { authPrimaryBtn } from "@/components/auth/AuthHeader";
import { App, Button, Input, InputRef } from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const VerifyCode: React.FC = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(InputRef | null)[]>([]);

  const handleVerify = (): void => {
    // Frontend-only demo: no API call. Simulate a successful verification.
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      message.success("Code verified (demo).");
      router.push("/reset-password");
    }, 700);
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
      handleVerify();
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
      handleVerify();
    }
  };

  return (
    <>
      <AuthHeader title="Verify email" />

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
        onClick={handleVerify}
        disabled={code.some((digit) => digit === "")}
        className={authPrimaryBtn}
      >
        Verify
      </Button>

      <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Please enter the otp we have sent you in your email.
      </p>
    </>
  );
};

export default VerifyCode;
