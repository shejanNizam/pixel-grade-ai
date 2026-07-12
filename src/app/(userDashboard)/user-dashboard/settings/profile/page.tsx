"use client";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { ACCEPT_ATTR, validateImage } from "@/utils/imageUpload";
import { App, Form, Input, Select } from "antd";
import Image from "next/image";
import { useId, useState } from "react";
import { FiCamera } from "react-icons/fi";
import BackLink from "../../_components/settings/BackLink";

interface ProfileValues {
  name: string;
  email: string;
  dialCode: string;
  phone: string;
}

/* Placeholder profile — swap for the signed-in user when the API exists. */
const initialProfile: ProfileValues = {
  name: "Abdullah",
  email: "abdullah@gmail.com",
  dialCode: "+1242",
  phone: "3000597212",
};

/* A short list to start with — extend or replace with a real country dataset. */
const dialCodes = [
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+1242", label: "🇧🇸 +1242" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+880", label: "🇧🇩 +880" },
];

export default function ProfileSettings() {
  const [form] = Form.useForm<ProfileValues>();
  const { message } = App.useApp();
  const avatarInputId = useId();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarUrl = useObjectUrl(avatar);

  const pickAvatar = (file: File | undefined) => {
    if (!file) return;
    const error = validateImage(file);
    if (error) {
      message.error(error);
      return;
    }
    setAvatar(file);
  };

  const onFinish = (values: ProfileValues) => {
    // Frontend-only demo: no API call.
    setProfile((prev) => ({ ...prev, ...values }));
    setIsEditing(false);
    message.success("Profile updated (demo).");
  };

  const startEditing = () => {
    form.setFieldsValue(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.resetFields();
    setIsEditing(false);
  };

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
              className="rounded-full border border-amber-500/60 px-5 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Save changes
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
                  {profile.name.slice(0, 2).toUpperCase()}
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
            <p className="text-xs text-zinc-500">Admin</p>
          </div>

          {/* Fields */}
          <Form
            id="profile-form"
            form={form}
            layout="vertical"
            initialValues={profile}
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
            {!isEditing && (
              <Form.Item<ProfileValues>
                label={<span className="text-sm text-white">Email</span>}
                name="email"
              >
                <Input readOnly />
              </Form.Item>
            )}

            <Form.Item
              label={<span className="text-sm text-white">Phone No.</span>}
              required={false}
              className="mb-0"
            >
              <div className="flex gap-3">
                <Form.Item<ProfileValues> name="dialCode" noStyle>
                  <Select
                    options={dialCodes}
                    disabled={!isEditing}
                    className="w-28 shrink-0"
                    aria-label="Country dialling code"
                  />
                </Form.Item>

                <Form.Item<ProfileValues>
                  name="phone"
                  noStyle
                  rules={[
                    { required: true, message: "Phone number is required" },
                    {
                      pattern: /^\d{6,15}$/,
                      message: "Enter 6–15 digits",
                    },
                  ]}
                ></Form.Item>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
