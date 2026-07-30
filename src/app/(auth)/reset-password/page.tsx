"use client";

import AuthHeader, {
  authAccentLink,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiKey } from "react-icons/fi";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

/**
 * Landing page for the emailed reset link: /reset-password?id=…&token=…
 * The token authenticates the request (as a Bearer header) — without both
 * params this page cannot work, so it says so instead of rendering a form
 * that is guaranteed to fail.
 */
const ResetPasswordInner: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const { message } = App.useApp();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";
  const token = searchParams.get("token") ?? "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values: ResetPasswordFormValues): Promise<void> => {
    try {
      await resetPassword({
        id,
        token,
        newPassword: values.password,
      }).unwrap();
      message.success("Password changed. Please sign in.");
      router.push("/login");
    } catch (error) {
      message.error(
        getApiErrorMessage(
          error,
          "Reset failed — the link may have expired. Request a new one.",
        ),
      );
    }
  };

  if (!id || !token) {
    return (
      <>
        <AuthHeader title="Reset password" />
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          This page only works from the link in your reset email, and this link
          looks incomplete or expired.
        </p>
        <p className="mt-4 text-center">
          <Link href="/forgot-password" className={authAccentLink}>
            Request a new reset link
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeader title="Reset password" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item<ResetPasswordFormValues>
          name="password"
          className="mb-4!"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "At least 8 characters" },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
              message:
                "Needs an uppercase letter, a number, and a special character",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<FiKey />}
            placeholder="Enter New Password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item<ResetPasswordFormValues>
          name="confirmPassword"
          dependencies={["password"]}
          className="mb-6!"
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<FiKey />}
            placeholder="Confirm Password"
            autoComplete="new-password"
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
          Reset password
        </Button>
      </Form>
    </>
  );
};

// useSearchParams demands a Suspense boundary in the App Router.
const ResetPassword: React.FC = () => (
  <Suspense fallback={null}>
    <ResetPasswordInner />
  </Suspense>
);

export default ResetPassword;
