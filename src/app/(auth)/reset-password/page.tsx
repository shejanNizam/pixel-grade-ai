"use client";

import AuthHeader, {
  authAccentLink,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { App, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiKey } from "react-icons/fi";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
  remember?: boolean;
}

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: ResetPasswordFormValues): void => {
    // Frontend-only demo: no API call. Simulate a successful reset.
    void values;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success("Password changed (demo). Please sign in.");
      router.push("/login");
    }, 500);
  };

  return (
    <>
      <AuthHeader title="Reset password" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ remember: true }}
      >
        <Form.Item<ResetPasswordFormValues>
          name="password"
          className="mb-4!"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
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
          className="mb-3!"
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

        <div className="mb-6 flex items-center justify-between px-1">
          <Form.Item<ResetPasswordFormValues>
            name="remember"
            valuePropName="checked"
            className="mb-0!"
          >
            <Checkbox className="text-sm text-zinc-700 dark:text-zinc-200">
              Remember me
            </Checkbox>
          </Form.Item>
          <Link href="/forgot-password" className={`text-sm ${authAccentLink}`}>
            Forgot password?
          </Link>
        </div>

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

export default ResetPassword;
