"use client";

import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { FiKey } from "react-icons/fi";
import BackLink from "../../_components/settings/BackLink";

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [form] = Form.useForm<ChangePasswordValues>();
  const { message } = App.useApp();
  const [changePassword, { isLoading: isSaving }] = useChangePasswordMutation();

  const onFinish = async (values: ChangePasswordValues) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      form.resetFields();
      message.success("Password changed.");
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      message.error(data?.message ?? "Couldn't change the password. Try again.");
    }
  };

  return (
    <div className="space-y-8">
      <BackLink title="Change password" />

      <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/15 bg-[#0d0d0f] p-8">
        <h3 className="mb-8 text-center text-xl font-semibold text-white">
          Change Password
        </h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item<ChangePasswordValues>
            label={<span className="text-sm text-zinc-300">Old Password</span>}
            name="oldPassword"
            rules={[{ required: true, message: "Enter your current password" }]}
          >
            <Input.Password
              size="large"
              prefix={<FiKey className="text-zinc-500" />}
              placeholder="Enter old password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item<ChangePasswordValues>
            label={<span className="text-sm text-zinc-300">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Enter a new password" },
              { min: 8, message: "Use at least 8 characters" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value !== getFieldValue("oldPassword")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Your new password must differ from the old one"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<FiKey className="text-zinc-500" />}
              placeholder="Enter new Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item<ChangePasswordValues>
            label={
              <span className="text-sm text-zinc-300">
                Re-enter New Password
              </span>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value === getFieldValue("newPassword")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<FiKey className="text-zinc-500" />}
              placeholder="Re-enter new Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <div className="mb-7 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-amber-400 transition-opacity hover:opacity-80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            htmlType="submit"
            size="large"
            block
            loading={isSaving}
            className="h-12! rounded-full! border-white/20! bg-transparent! text-white! hover:border-violet-500! hover:text-violet-300!"
          >
            Change password
          </Button>
        </Form>
      </div>
    </div>
  );
}
