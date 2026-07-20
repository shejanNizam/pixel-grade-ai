"use client";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadFilesMutation,
} from "@/redux/features/user/userApi";
import { ACCEPT_ATTR, validateImage } from "@/utils/imageUpload";
import { App, Form, Input } from "antd";
import Image from "next/image";
import { useId, useState } from "react";
import { FiCamera } from "react-icons/fi";
import BackLink from "../../_components/settings/BackLink";

interface ProfileValues {
  name: string;
  email: string;
  /** Full E.164 number, e.g. +8801712345678 — what the backend validates. */
  phone: string;
}

export default function ProfileSettings() {
  const [form] = Form.useForm<ProfileValues>();
  const { message } = App.useApp();
  const avatarInputId = useId();

  const { data: me, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

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

  const onFinish = async (values: ProfileValues) => {
    if (!me || isSaving || isUploading) return;

    const phone = values.phone.trim();
    if (phone && !/^\+[1-9]\d{6,14}$/.test(phone)) {
      message.error("Phone must be in international format, e.g. +14155551234");
      return;
    }

    try {
      // Two steps by design: the file goes to POST /upload (Cloudinary),
      // then the user is PATCHed with the resulting object.
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
          ...(phone ? { phone } : {}),
          ...(uploadedAvatar ? { avatar: uploadedAvatar } : {}),
        },
      }).unwrap();

      setAvatar(null);
      setIsEditing(false);
      message.success("Profile updated.");
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      message.error(data?.message ?? "Couldn't save your profile. Try again.");
    }
  };

  const startEditing = () => {
    if (!me) return;
    form.setFieldsValue({
      name: me.name,
      email: me.email,
      phone: me.phone ?? "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.resetFields();
    setAvatar(null);
    setIsEditing(false);
  };

  if (isLoading || !me) {
    return (
      <div className="space-y-6">
        <BackLink title="Profile" />
        <div className="h-64 max-w-2xl animate-pulse rounded-2xl border border-white/10 bg-[#0d0d0f]" />
      </div>
    );
  }

  const avatarUrl = avatarPreview ?? me.avatar?.url;
  const busy = isSaving || isUploading;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BackLink title="Profile" />

        {isEditing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-form"
              disabled={busy}
              className="rounded-full border border-amber-500/60 px-5 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-5 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/10"
          >
            Edit
          </button>
        )}
      </div>

      <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#0d0d0f] p-6">
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
                  className="h-22 w-22 rounded-full object-cover"
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

            <p className="mt-2 text-sm text-white">Profile</p>
            <p className="text-xs text-zinc-500 capitalize">
              {me.role.replace("_", " ")}
            </p>
          </div>

          {/* Fields */}
          <Form
            id="profile-form"
            form={form}
            layout="vertical"
            initialValues={{
              name: me.name,
              email: me.email,
              phone: me.phone ?? "",
            }}
            onFinish={onFinish}
            requiredMark={false}
            className="flex-1"
          >
            <Form.Item<ProfileValues>
              label={<span className="text-sm text-white">Name</span>}
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input readOnly={!isEditing} />
            </Form.Item>

            {/* Email is identity — shown, but not editable here. */}
            <Form.Item<ProfileValues>
              label={<span className="text-sm text-white">Email</span>}
              name="email"
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item<ProfileValues>
              label={<span className="text-sm text-white">Phone No.</span>}
              name="phone"
              rules={[
                {
                  pattern: /^\+[1-9]\d{6,14}$/,
                  message:
                    "Use international format, e.g. +14155551234",
                },
              ]}
            >
              <Input readOnly={!isEditing} placeholder="+14155551234" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
