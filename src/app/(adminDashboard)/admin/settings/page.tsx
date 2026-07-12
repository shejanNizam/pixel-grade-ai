"use client";

import { App, Button, Form, Input, Switch } from "antd";

interface AdminSettingsValues {
  siteName: string;
  supportEmail: string;
  allowSignups: boolean;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [form] = Form.useForm<AdminSettingsValues>();
  const { message } = App.useApp();

  const onFinish = (values: AdminSettingsValues) => {
    // Demo only — persist these via your settings API / RTK Query mutation.
    console.log("Admin settings saved:", values);
    message.success("Settings saved (demo).");
  };

  return (
    <div className="w-full mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure global platform options. These are demo fields — wire them
          to your backend.
        </p>
      </div>

      <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{
            siteName: "PixelGrade AI",
            supportEmail: "support@pixelgrade.ai",
            allowSignups: true,
            maintenanceMode: false,
          }}
        >
          <Form.Item
            name="siteName"
            label="Site Name"
            rules={[{ required: true, message: "Site name is required." }]}
          >
            <Input size="large" placeholder="Your platform name" />
          </Form.Item>

          <Form.Item
            name="supportEmail"
            label="Support Email"
            rules={[
              { required: true, message: "Support email is required." },
              { type: "email", message: "Enter a valid email." },
            ]}
          >
            <Input size="large" placeholder="support@example.com" />
          </Form.Item>

          <Form.Item
            name="allowSignups"
            label="Allow New Signups"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="maintenanceMode"
            label="Maintenance Mode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large">
            Save Settings
          </Button>
        </Form>
      </div>
    </div>
  );
}
