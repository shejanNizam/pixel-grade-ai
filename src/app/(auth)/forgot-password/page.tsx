"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

interface ForgotPasswordFormValues {
  email: string;
}

/**
 * The backend emails a RESET LINK (to /reset-password?id=…&token=…), not an
 * OTP — so on success this page becomes a "check your inbox" state rather
 * than routing to the verify-code screen.
 */
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const { message } = App.useApp();

  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onFinish = async (values: ForgotPasswordFormValues): Promise<void> => {
    try {
      await forgetPassword({ email: values.email }).unwrap();
      setSentTo(values.email);
    } catch (error) {
      message.error(
        getApiErrorMessage(error, "Could not send the reset email."),
      );
    }
  };

  if (sentTo) {
    return (
      <>
        <AuthHeader title="Check your email" />
        <div className="text-center">
          <FiCheckCircle className="mx-auto mb-4 text-4xl text-emerald-500" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            We sent a password reset link to{" "}
            <span className="font-medium">{sentTo}</span>. Open it to choose a
            new password. The link expires shortly, and the email may take a
            minute to arrive.
          </p>
          <p className={authFootnote}>
            Wrong address?{" "}
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className={`ml-1 cursor-pointer ${authAccentLink}`}
            >
              Try again
            </button>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        title="Forgot password"
        subtitle="Please enter your email to reset your password."
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item<ForgotPasswordFormValues>
          name="email"
          className="mb-5!"
          rules={[
            { type: "email", message: "Enter a valid email" },
            { required: true, message: "Email is required" },
          ]}
        >
          <Input
            size="large"
            prefix={<FiMail />}
            placeholder="Enter Your Email"
            autoComplete="email"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
          className={authPrimaryBtn}
        >
          Send reset link
        </Button>

        <p className={authFootnote}>
          {"Don't have an account "}
          <Link href="/signup" className={`ml-2 ${authAccentLink}`}>
            Sign up
          </Link>
        </p>
      </Form>
    </>
  );
};

export default ForgotPassword;
