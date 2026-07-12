"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { SignupFormValues } from "@/types/auth";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiKey, FiMail, FiPhone, FiUser } from "react-icons/fi";

const Signup: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<SignupFormValues>();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: SignupFormValues): void => {
    // Frontend-only demo: no API call. Simulate a successful signup.
    void values;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success("Account created (demo). Please sign in.");
      router.push("/login");
    }, 500);
  };

  return (
    <>
      <AuthHeader title="Create account" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item<SignupFormValues>
          name="name"
          className="mb-4!"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input
            size="large"
            prefix={<FiUser />}
            placeholder="Name"
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item<SignupFormValues>
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

        <Form.Item<SignupFormValues>
          name="phone"
          className="mb-4!"
          rules={[{ required: true, message: "Phone number is required" }]}
        >
          <Input
            size="large"
            prefix={<FiPhone />}
            placeholder="Enter phone no"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item<SignupFormValues>
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
            placeholder="Password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item<SignupFormValues>
          name="confirmPassword"
          dependencies={["password"]}
          className="mb-8!"
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
          Create account
        </Button>

        <p className={authFootnote}>
          Already have an account
          <Link href="/login" className={`ml-2 ${authAccentLink}`}>
            Sign in
          </Link>
        </p>
      </Form>
    </>
  );
};

export default Signup;
