"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail } from "react-icons/fi";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: ForgotPasswordFormValues): void => {
    // Frontend-only demo: no API call. Route to the verify-code screen.
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success("OTP sent (demo).");
      router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
    }, 500);
  };

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
          Send OTP
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
