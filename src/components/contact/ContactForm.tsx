"use client";

import PillButton from "@/components/shared/PillButton";
import { App, Form, Input } from "antd";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

interface ContactFormValues {
  firstName: string;
  email: string;
  reason: string;
  message: string;
}

export default function ContactForm() {
  const [form] = Form.useForm<ContactFormValues>();
  const { message } = App.useApp();
  const [isSending, setIsSending] = useState(false);

  const onFinish = (values: ContactFormValues): void => {
    // Frontend-only demo: no API call.
    void values;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      form.resetFields();
      message.success("Thanks — we'll get back to you (demo).");
    }, 600);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="contact-form"
    >
      <Form.Item<ContactFormValues>
        name="firstName"
        className="mb-4!"
        rules={[{ required: true, message: "First name is required" }]}
      >
        <Input placeholder="First name" autoComplete="given-name" />
      </Form.Item>

      <Form.Item<ContactFormValues>
        name="email"
        className="mb-4!"
        rules={[
          { type: "email", message: "Enter a valid email" },
          { required: true, message: "Email is required" },
        ]}
      >
        <Input placeholder="Email address" autoComplete="email" />
      </Form.Item>

      <Form.Item<ContactFormValues>
        name="reason"
        className="mb-4!"
        rules={[{ required: true, message: "Let us know what this is about" }]}
      >
        <Input placeholder="Write your Support reason" />
      </Form.Item>

      <Form.Item<ContactFormValues>
        name="message"
        className="mb-6!"
        rules={[{ required: true, message: "Please write a message" }]}
      >
        <Input.TextArea placeholder="Your message" rows={5} />
      </Form.Item>

      <PillButton
        type="submit"
        block
        disabled={isSending}
        icon={<FiArrowRight />}
      >
        {isSending ? "Sending..." : "Submit"}
      </PillButton>
    </Form>
  );
}
