"use client";

import { App, Button, Form, Input } from "antd";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const contactInfo = [
  { icon: FiMail, label: "Email", value: "hello@pixelgrade.ai" },
  { icon: FiPhone, label: "Phone", value: "+1 (555) 000-0000" },
  { icon: FiMapPin, label: "Address", value: "123 Demo Street, Your City" },
];

export default function ContactPage() {
  const [form] = Form.useForm<ContactFormValues>();
  const { message } = App.useApp();

  const onFinish = (values: ContactFormValues) => {
    // Demo only — wire this up to your API / RTK Query mutation.
    console.log("Contact form submitted:", values);
    message.success("Thanks! Your message has been sent (demo).");
    form.resetFields();
  };

  return (
    <section className="container mx-auto flex min-h-[calc(100dvh-5rem)] flex-col justify-center px-4 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Get in <span className="text-blue-500">Touch</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          A demo contact page built with Ant Design&apos;s Form. Hook the submit
          handler to your backend.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-5 max-w-5xl mx-auto">
        {/* Contact details */}
        <div className="md:col-span-2 space-y-6">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {label}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50 p-6 sm:p-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name." }]}
            >
              <Input size="large" placeholder="Your name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Please enter a valid email." },
              ]}
            >
              <Input size="large" placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please enter a message." }]}
            >
              <Input.TextArea rows={4} placeholder="How can we help?" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block>
              Send Message
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
}
