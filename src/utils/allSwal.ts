"use client";

import { App } from "antd";

type AlertProps = {
  title: string;
  text: string;
};

/**
 * Context-aware replacement for the old static `Modal.success` / `Modal.error`
 * helpers. In antd v5+/v6, static `Modal.*` methods render OUTSIDE the
 * `ConfigProvider`, so they ignore the app's theme (dark/light algorithm,
 * component tokens). Using `App.useApp()` keeps these dialogs themed.
 *
 * Usage (inside a client component):
 *   const { successSwal, errorSwal } = useSwal();
 *   successSwal({ title: "Done", text: "Saved successfully." });
 */
export function useSwal() {
  const { modal } = App.useApp();

  const successSwal = ({ title, text }: AlertProps) =>
    modal.success({
      title,
      content: text,
      okText: "OK",
      okButtonProps: {
        style: { backgroundColor: "#DEAD35", borderColor: "#DEAD35" },
      },
    });

  const errorSwal = ({ title, text }: AlertProps) =>
    modal.error({
      title,
      content: text,
      okText: "OK",
      okButtonProps: {
        danger: true,
        style: { backgroundColor: "#d33", borderColor: "#d33" },
      },
    });

  return { successSwal, errorSwal };
}
