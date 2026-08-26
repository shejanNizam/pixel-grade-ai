"use client";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadFilesMutation,
} from "@/redux/features/user/userApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { ACCEPT_ATTR, validateImage } from "@/utils/imageUpload";
import { App, Button, Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { FiCamera, FiKey } from "react-icons/fi";
import BackLink from "../../_components/settings/BackLink";

interface ProfileValues {
  name: string;
  username: string;
  email: string;
}

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSettings() {
  const [profileForm] = Form.useForm<ProfileValues>();
  const [passwordForm] = Form.useForm<ChangePasswordValues>();
  const { message } = App.useApp();
  const avatarInputId = useId();

  const { data: me, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [changePassword, { isLoading: isSavingPassword }] = useChangePasswordMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarPreview = useObjectUrl(avatar);

  const pickAvatar = (file: File | undefined) => {
    if (!file) return;
    const error = validateImage(file);
    if (error) {
      message.error(error);
      return;
    }
    setAvatar(file);
  };

  const onFinishProfile = async (values: ProfileValues) => {
    if (!me || isSavingProfile || isUploading) return;

    const username = values.username?.trim().toLowerCase() ?? "";
    if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
      message.error(
        "Username must be 3-24 characters: letters, numbers, and underscores only."
      );
      return;
    }

    try {
      let uploadedAvatar: { url: string; publicId: string } | undefined;
      if (avatar) {
        const formData = new FormData();
        formData.append("files", avatar);
        const result = await uploadFiles(formData).unwrap();
        uploadedAvatar = Array.isArray(result) ? result[0] : result;
      }

      await updateProfile({
        userId: me._id,
        body: {
          name: values.name.trim(),
          ...(username ? { username } : {}),
          ...(uploadedAvatar ? { avatar: uploadedAvatar } : {}),
        },
      }).unwrap();

      setAvatar(null);
      setIsEditing(false);
      message.success("Profile updated.");
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't save your profile. Try again.")
      );
    }
  };

  const onFinishPassword = async (values: ChangePasswordValues) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      passwordForm.resetFields();
      message.success("Password changed successfully.");
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      message.error(
        data?.message ?? "Couldn't change the password. Try again."
      );
    }
  };

  const startEditing = () => {
    if (!me) return;
    profileForm.setFieldsValue({
      name: me.name,
      username: me.username ?? "",
      email: me.email,
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    profileForm.resetFields();
    setAvatar(null);
    setIsEditing(false);
  };

  if (isLoading || !me) {
    return (
      <div className="space-y-6">
        <BackLink title="Settings" />
        <div className="h-64 max-w-2xl animate-pulse rounded-2xl border border-white/10 bg-[#0d0d0f]" />
      </div>
    );
  }

  const avatarUrl = avatarPreview ?? me.avatar?.url;
  const busyProfile = isSavingProfile || isUploading;

  return (
    <div className="space-y-8 max-w-2xl">
      <BackLink title="Settings" />

      {/* ---- CARD 1: Profile Details ---- */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Profile Details</h3>
            <p className="text-xs text-zinc-400">
              Manage your personal information and public handle
            </p>
          </div>

          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="cursor-pointer rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={busyProfile}
                className="cursor-pointer rounded-full border border-amber-500/60 px-4 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyProfile ? "Saving…" : "Save changes"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-5 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8 sm:flex-row">
          {/* Avatar */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={88}
                  height={88}
                  unoptimized
                  className="h-22 w-22 rounded-full object-cover border border-white/10"
                />
              ) : (
                <span className="inline-flex h-22 w-22 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-xl font-semibold text-white">
                  {me.name.slice(0, 2).toUpperCase()}
                </span>
              )}

              {isEditing && (
                <>
                  <label
                    htmlFor={avatarInputId}
                    className="absolute right-0 bottom-0 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-violet-500 text-white transition-colors hover:bg-violet-600"
                  >
                    <FiCamera size={13} />
                    <span className="sr-only">Change profile photo</span>
                  </label>
                  <input
                    id={avatarInputId}
                    type="file"
                    accept={ACCEPT_ATTR}
                    className="sr-only"
                    onChange={(e) => pickAvatar(e.target.files?.[0])}
                  />
                </>
              )}
            </div>

            <p className="mt-2 text-sm font-semibold text-white">Profile</p>
            <p className="text-xs text-zinc-400 capitalize">
              {me.role.replace("_", " ")}
            </p>
          </div>

          {/* Fields */}
          <Form
            id="profile-form"
            form={profileForm}
            layout="vertical"
            initialValues={{
              name: me.name,
              username: me.username ?? "",
              email: me.email,
            }}
            onFinish={onFinishProfile}
            requiredMark={false}
            className="flex-1 space-y-3"
          >
            <Form.Item<ProfileValues>
              label={<span className="text-xs font-semibold text-zinc-300">Name</span>}
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input readOnly={!isEditing} className="bg-black/60 text-white border-white/15" />
            </Form.Item>

            <Form.Item<ProfileValues>
              label={<span className="text-xs font-semibold text-zinc-300">Username</span>}
              name="username"
              extra={
                <span className="text-[11px] text-zinc-500">
                  Shown on your public Creator Profile instead of your email.
                </span>
              }
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_]{3,24}$/,
                  message:
                    "3-24 characters: letters, numbers, and underscores only",
                },
              ]}
            >
              <Input readOnly={!isEditing} placeholder="Not set" className="bg-black/60 text-white border-white/15" />
            </Form.Item>

            <Form.Item<ProfileValues>
              label={<span className="text-xs font-semibold text-zinc-300">Email</span>}
              name="email"
            >
              <Input readOnly className="bg-black/40 text-zinc-400 border-white/10" />
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* ---- CARD 2: Change Password (Directly underneath Profile Details) ---- */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-6 shadow-lg space-y-5">
        <div className="border-b border-white/8 pb-4">
          <h3 className="text-base font-bold text-white">Change Password</h3>
          <p className="text-xs text-zinc-400">
            Update your account password for enhanced security
          </p>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onFinishPassword}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item<ChangePasswordValues>
            label={<span className="text-xs font-semibold text-zinc-300">Old Password</span>}
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
            label={<span className="text-xs font-semibold text-zinc-300">New Password</span>}
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
                    new Error("Your new password must differ from the old one")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<FiKey className="text-zinc-500" />}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item<ChangePasswordValues>
            label={
              <span className="text-xs font-semibold text-zinc-300">
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
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </Form.Item>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/forgot-password"
              className="text-xs text-amber-400 transition-opacity hover:opacity-80 font-medium"
            >
              Forgot password?
            </Link>

            <Button
              htmlType="submit"
              size="large"
              loading={isSavingPassword}
              className="rounded-full! border-purple-500/60! bg-purple-600! text-white! hover:bg-purple-500! px-6!"
            >
              Change password
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
