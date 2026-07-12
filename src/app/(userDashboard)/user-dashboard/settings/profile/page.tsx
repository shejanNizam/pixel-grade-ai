"use client";

import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Form, Input, Modal, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import Image from "next/image";
import { useState } from "react";

interface DemoUser {
  first_name: string;
  last_name: string;
  email: string;
  subscription_type: string;
  session_state: string;
  created_at: string;
  onboarding_completed: boolean;
  profile_picture: string | null;
}

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
}

// Frontend-only demo data. Replace with real user data from your API/store.
const initialUser: DemoUser = {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane.doe@example.com",
  subscription_type: "pro",
  session_state: "green",
  created_at: "2025-01-15",
  onboarding_completed: true,
  profile_picture: null,
};

export default function Profile() {
  const { message } = App.useApp();
  const [user, setUser] = useState<DemoUser>(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOpenModal = () => {
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = (values: FormValues) => {
    // Frontend-only demo: update local state instead of calling an API.
    setIsSubmitting(true);
    const preview = fileList[0]?.originFileObj
      ? URL.createObjectURL(fileList[0].originFileObj as Blob)
      : user.profile_picture;

    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        first_name: values.first_name,
        last_name: values.last_name,
        profile_picture: preview,
      }));
      setIsSubmitting(false);
      message.success("Profile updated (demo).");
      handleCloseModal();
    }, 500);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    maxCount: 1,
    listType: "picture",
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Section */}
        <div className="h-32 bg-linear-to-r from-blue-500 to-purple-600"></div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex justify-between items-start">
            <div className="relative -mt-12 mb-4">
              {user.profile_picture ? (
                <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                  <Image
                    src={user.profile_picture}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {getInitials(user.first_name, user.last_name)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenModal}
              className="mt-2 flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              <EditOutlined className="text-sm" />
              Edit Profile
            </button>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Subscription
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {user.subscription_type || "None"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Session Status
                </span>
                <span
                  className={`text-sm font-medium capitalize ${
                    user.session_state === "green"
                      ? "text-green-600 dark:text-green-400"
                      : user.session_state === "yellow"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {user.session_state || "Green"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Member Since
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Onboarding
                </span>
                <span
                  className={`text-sm font-medium ${user.onboarding_completed ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
                >
                  {user.onboarding_completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
        forceRender
        className="dark:bg-gray-900"
        styles={{ body: { padding: "24px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input placeholder="Enter your first name" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Enter your last name" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter your email"
              className="rounded-lg"
              disabled
              style={{
                backgroundColor: "#f5f5f5",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <Upload {...uploadProps}>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <UploadOutlined />
                Upload Image
              </button>
            </Upload>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Max file size: 2MB. Supported formats: JPG, PNG, GIF
            </p>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
