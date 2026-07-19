"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import {
  useSendOtpMutation,
  useSignupMutation,
} from "@/redux/features/auth/authApi";
import { SignupFormValues } from "@/types/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiKey, FiMail, FiPhone, FiUser } from "react-icons/fi";

const Signup: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<SignupFormValues>();
  const { message } = App.useApp();

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  const onFinish = async (values: SignupFormValues): Promise<void> => {
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      }).unwrap();

      // Registration alone cannot log in — the email must be verified first.
      // Send the OTP now and hand over to the verify screen.
      try {
        await sendOtp({ email: values.email }).unwrap();
        message.success("Account created. We emailed you a 6-digit code.");
      } catch {
        message.warning(
          "Account created, but the code could not be sent. Use Resend on the next screen.",
        );
      }
      router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      message.error(
        getApiErrorMessage(error, "Signup failed. Please try again."),
      );
    }
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
          rules={[
            { required: true, message: "Name is required" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
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
          rules={[
            { required: true, message: "Phone number is required" },
            {
              pattern: /^\+[1-9]\d{6,14}$/,
              message: "Use international format, e.g. +8801712345678",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<FiPhone />}
            placeholder="e.g. +8801712345678"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item<SignupFormValues>
          name="password"
          className="mb-4!"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "At least 8 characters" },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
              message: "Needs an uppercase letter, a number, and a special character",
            },
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
          loading={isSigningUp || isSendingOtp}
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
