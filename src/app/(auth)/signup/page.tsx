"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { SignupFormValues } from "@/types/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAtSign, FiKey, FiMail, FiPhone, FiUser } from "react-icons/fi";

const Signup: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<SignupFormValues>();
  const { message } = App.useApp();

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  const onFinish = async (values: SignupFormValues): Promise<void> => {
    try {
      // ONE call. Registration now sends the verification OTP server-side, so
      // there is no second request that can fail silently and leave an account
      // nobody was ever asked to verify — the prototype V1 bug.
      const created = await signup({
        name: values.name,
        username: values.username.trim().toLowerCase(),
        email: values.email,
        password: values.password,
        phone: values.phone?.trim() || undefined,
      }).unwrap();

      if (created?.verificationEmailSent === false) {
        message.warning(
          "Account created, but the code could not be sent. Use Resend on the next screen.",
        );
      } else {
        message.success("Account created. We emailed you a 6-digit code.");
      }

      router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      // Surfaces the server's own message ("An account with this email already
      // exists", "That username is already taken") rather than a generic
      // string that tells neither the user nor us what went wrong.
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

        {/* Required as of UI Feedback v1 (edit #2): the username IS the public
            Creator Profile handle, so an account without one has a profile that
            cannot be addressed. Mirrors `usernameSchema` on the server — keep
            the two rule sets identical or the form accepts what the API then
            rejects. */}
        <Form.Item<SignupFormValues>
          name="username"
          className="mb-4!"
          rules={[
            { required: true, message: "Username is required" },
            { min: 3, message: "At least 3 characters" },
            { max: 24, message: "At most 24 characters" },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: "Letters, numbers, and underscores only",
            },
          ]}
          extra={
            <span className="text-xs text-zinc-500">
              This is your public Creator Profile handle.
            </span>
          }
        >
          <Input
            size="large"
            prefix={<FiAtSign />}
            placeholder="Username"
            autoComplete="username"
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

        {/* Phone is OPTIONAL (client asked us to decide, 2026-07-29).
            Nothing in the product uses it — verification, password reset, and
            every notification go by email — so requiring it only adds a field
            people abandon signup over. Server-side it was already optional;
            this makes the two agree. Flip both together if the client later
            wants SMS. */}
        <Form.Item<SignupFormValues>
          name="phone"
          className="mb-4!"
          rules={[
            {
              pattern: /^\+[1-9]\d{6,14}$/,
              message: "Use international format, e.g. +8801712345678",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<FiPhone />}
            placeholder="Phone (optional) e.g. +8801712345678"
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
              message:
                "Needs an uppercase letter, a number, and a special character",
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
          loading={isSigningUp}
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
