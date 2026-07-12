"use client";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { ACCEPT_ATTR, validateImage } from "@/utils/imageUpload";
import { App, Form, Input, Modal } from "antd";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

export interface AddCardValues {
  name: string;
  number: string;
  set: string;
  quantity: string;
}

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (values: AddCardValues, imageUrl: string) => void;
}

export default function AddCardModal({
  open,
  onClose,
  onAdd,
}: AddCardModalProps) {
  const [form] = Form.useForm<AddCardValues>();
  const { message } = App.useApp();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [isOver, setIsOver] = useState(false);
  const preview = useObjectUrl(image);

  const accept = (file: File | undefined) => {
    if (!file) return;
    const error = validateImage(file);
    if (error) {
      message.error(error);
      return;
    }
    setImage(file);
  };

  const reset = () => {
    form.resetFields();
    setImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    reset();
    onClose();
  };

  const onFinish = (values: AddCardValues) => {
    if (!preview) {
      message.error("Add a card image first.");
      return;
    }
    // The object URL outlives this component, so the grid owns it from here.
    onAdd(values, URL.createObjectURL(image!));
    message.success(`${values.name} added to your collection (demo).`);
    close();
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      centered
      destroyOnHidden
      width={520}
      className="add-card-modal"
      title={null}
      aria-labelledby="add-card-title"
    >
      <h2
        id="add-card-title"
        className="mb-6 text-center text-lg font-semibold text-violet-600"
      >
        Add Card
      </h2>

      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Card preview"
            width={420}
            height={280}
            unoptimized
            className="mx-auto h-56 w-auto rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label="Remove image"
            className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOver(false);
            accept(e.dataTransfer.files[0]);
          }}
          className={`flex h-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border text-center transition-colors ${
            isOver
              ? "border-violet-500 bg-violet-50"
              : "border-violet-300 hover:bg-violet-50/60"
          }`}
        >
          <FiUploadCloud className="mb-1 text-3xl text-violet-500" />
          <span className="text-sm font-medium text-violet-600">
            Upload card image
          </span>
          <span className="text-xs text-violet-400">
            JPG, PNG, WEBP up to 10 MB
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="mt-6"
      >
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Form.Item<AddCardValues>
            label="Card Name"
            name="name"
            rules={[{ required: true, message: "Card name is required" }]}
          >
            <Input placeholder="Ex. Gengar" />
          </Form.Item>

          <Form.Item<AddCardValues>
            label="Card Number"
            name="number"
            rules={[{ required: true, message: "Card number is required" }]}
          >
            <Input placeholder="Ex : #5/64" />
          </Form.Item>

          <Form.Item<AddCardValues>
            label="Set"
            name="set"
            rules={[{ required: true, message: "Set is required" }]}
          >
            <Input placeholder="Ex : Fossil ( 1999 )" />
          </Form.Item>

          <Form.Item<AddCardValues>
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Quantity is required" },
              {
                pattern: /^[1-9]\d*$/,
                message: "Enter a whole number above zero",
              },
            ]}
          >
            <Input inputMode="numeric" placeholder="Ex : 03" />
          </Form.Item>
        </div>

        <div className="mt-2 flex justify-center gap-4">
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-red-400 px-8 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-violet-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Add card
          </button>
        </div>
      </Form>
    </Modal>
  );
}
