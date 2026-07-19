"use client";

import AuthHeader, {
  authAccentLink,
  authFootnote,
  authPrimaryBtn,
} from "@/components/auth/AuthHeader";
import { ACCESS_TOKEN_KEY } from "@/redux/api/baseApi";
import {
  useLoginMutation,
  useSendOtpMutation,
} from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { LoginFormValues } from "@/types/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import { setAuthCookie } from "@/utils/cookieUtils";
import { App, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiKey, FiMail } from "react-icons/fi";

const Login: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<LoginFormValues>();
  const { message } = App.useApp();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [sendOtp] = useSendOtpMutation();

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    try {
      const { user, accessToken } = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      setAuthCookie(accessToken, user.role);
      dispatch(setCredentials({ token: accessToken, user }));

      message.success(`Welcome back, ${user.name}!`);

      // Honor the middleware's ?next= redirect when it points somewhere
      // internal; otherwise land on the role's home. A user aiming at /admin
      // without the role just bounces back through the middleware.
      const next = new URLSearchParams(window.location.search).get("next");
      const roleHome =
        user.role === "admin" || user.role === "super_admin"
          ? "/admin"
          : "/user-dashboard";
      router.push(next?.startsWith("/") ? next : roleHome);
    } catch (error) {
      const text = getApiErrorMessage(error, "Login failed. Please try again.");

      // Unverified accounts are refused with a 403 naming the problem — send
      // the user straight into the OTP flow instead of leaving them stuck.
      if (/verify your email/i.test(text)) {
        message.info("Please verify your email first. Sending a new code…");
        try {
          await sendOtp({ email: values.email }).unwrap();
        } catch {
          // The verify page has its own resend button; failing here is fine.
        }
        router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
        return;
      }

      message.error(text);
    }
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
