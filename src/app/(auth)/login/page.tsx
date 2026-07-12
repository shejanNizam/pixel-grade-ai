"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { LoginFormValues } from "@/types/auth";
import { App, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiKey, FiMail } from "react-icons/fi";

const Login: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<LoginFormValues>();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: LoginFormValues): void => {
    // Frontend-only demo: no API call. Simulate a successful login.
    void values;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success("Logged in (demo).");
      router.push("/user-dashboard");
    }, 500);
  };

  return (
    <>
      <AuthHeader title="Sign In" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ remember: true }}
      >
        <Form.Item<LoginFormValues>
          name="email"
          className="mb-4!"
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

        <Form.Item<LoginFormValues>
          name="password"
          className="mb-3!"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            size="large"
            prefix={<FiKey />}
            placeholder="Enter Password"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className="mb-6 flex items-center justify-between px-1">
          <Form.Item<LoginFormValues>
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
          Sign in
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

export default Login;
