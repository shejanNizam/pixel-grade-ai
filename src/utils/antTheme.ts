import type { ThemeConfig } from "antd";

/* -------------------------------------------------------------------------- */
/*  Brand palette — single source of truth. Change colors here first.         */
/* -------------------------------------------------------------------------- */
const brand = {
  primary: "#8B2FC9",
  primaryHover: "#9C43D8",
  primaryActive: "#7A26B4",
  info: "#22A6F2",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  link: "#8B2FC9",
} as const;

/* Surface/neutral colors per mode. */
const light = {
  bgBase: "#ffffff",
  textBase: "#000000",
  surface: "#ffffff",
  surfaceElevated: "#ffffff",
  border: "#000000",
  placeholder: "#666666",
} as const;

const dark = {
  bgBase: "#141414",
  textBase: "#ffffff",
  surface: "#12203b",
  surfaceElevated: "#12203b",
  border: "#303030",
  placeholder: "#999999",
} as const;

/* -------------------------------------------------------------------------- */
/*  GLOBAL (SEED) TOKENS — the full set antd v6 accepts under `token`.         */
/*  Uncomment any of the commented ones to set them globally.                 */
/* -------------------------------------------------------------------------- */
/*
  colorPrimary   colorSuccess   colorWarning   colorError   colorInfo
  colorTextBase  colorBgBase    colorLink
  fontFamily     fontFamilyCode fontSize       lineWidth    lineType
  borderRadius   sizeUnit       sizeStep       sizePopupArrow   controlHeight
  zIndexBase     zIndexPopupBase opacityImage
  motion         motionUnit     motionBase     wireframe
  (+ every alias token: colorText, colorBgContainer, colorBorder,
     colorTextPlaceholder, boxShadow, controlHeightLG, etc.)
*/

/* -------------------------------------------------------------------------- */
/*  COMPONENT CATALOG — every themeable component in antd v6.                  */
/*  Add any of these under `components` in the themes below; the ThemeConfig   */
/*  type autocompletes each component's tokens and rejects invalid keys.       */
/*                                                                            */
/*  General:      Button  Icon(FloatButton)  Typography                       */
/*  Layout:       Divider  Flex  Grid  Layout  Space  Splitter                */
/*  Navigation:   Anchor  Breadcrumb  Dropdown  Menu  Pagination  Steps  Tabs */
/*  Data Entry:   AutoComplete(Select)  Cascader  Checkbox  ColorPicker       */
/*                DatePicker  Form  Input  InputNumber  Mentions  Radio  Rate  */
/*                Segmented  Select  Slider  Switch  TimePicker(DatePicker)    */
/*                Transfer  TreeSelect  Upload                                 */
/*  Data Display: Avatar  Badge  Calendar  Card  Carousel  Collapse           */
/*                Descriptions  Empty  Image  List  Popover  QRCode  Segmented */
/*                Statistic  Table  Tag  Timeline  Tooltip  Tour  Tree         */
/*  Feedback:     Alert  Drawer  Message  Modal  Notification  Popconfirm      */
/*                Progress  Result  Skeleton  Spin  Watermark                  */
/* -------------------------------------------------------------------------- */

/*
  NOTE on fonts: antd has no `labelFontFamily` / `labelFontWeight` /
  `inputFontFamily` tokens. Style form label/input typography with CSS
  (e.g. target `.ant-form-item-label > label` in globals.css) instead.
*/

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.info,
    colorSuccess: brand.success,
    colorWarning: brand.warning,
    colorError: brand.error,
    colorLink: brand.link,
    colorBgBase: light.bgBase,
    colorTextBase: light.textBase,
  },
  components: {
    Table: {
      colorTextHeading: brand.primary,
      colorText: light.textBase,
      colorBorder: light.border,
      // headerBg: "#fafafa",   // was `colorBgHeader`/`colorHeaderBg` (invalid keys)
    },
    Menu: {
      colorBgContainer: light.surface,
      colorText: brand.info,
      itemHoverBg: "#e6f7ff", // was `colorItemHoverBg`
      itemSelectedBg: brand.primary, // was `colorItemSelectedBg`
      itemSelectedColor: "#ffffff", // was `colorItemSelectedText`
      iconSize: 24,
    },
    Button: {
      colorPrimary: brand.primary,
      colorTextDisabled: light.textBase,
      colorPrimaryHover: brand.primaryHover,
      colorPrimaryActive: brand.primaryActive,
      colorBgContainerDisabled: "#ffffff",
      borderRadius: 6,
      fontSize: 14,
      controlHeight: 50,
      boxShadow: "0 0px 0 rgba(5, 145, 255, 0.1)",
    },
    Progress: {
      defaultColor: brand.primary,
      colorSuccess: brand.primary,
    },
    Form: {
      labelColor: light.textBase,
      labelFontSize: 16,
    },
    Input: {
      controlHeight: 44,
      controlHeightLG: 48,
      borderRadius: 10,
      colorBorder: "#e2e8f0",
      hoverBorderColor: brand.primaryHover,
      activeBorderColor: brand.primary,
      activeShadow: "0 0 0 3px rgba(139, 47, 201, 0.12)",
      colorTextPlaceholder: "#94a3b8",
    },
    InputNumber: {
      controlHeight: 44,
      borderRadius: 10,
      colorBorder: "#e2e8f0",
      hoverBorderColor: brand.primaryHover,
      activeBorderColor: brand.primary,
    },
    Select: {
      controlHeight: 44,
      borderRadius: 10,
      colorBorder: "#e2e8f0",
      colorTextPlaceholder: "#94a3b8",
    },
    DatePicker: {
      controlHeight: 44,
      borderRadius: 10,
      colorBorder: "#e2e8f0",
      colorTextPlaceholder: "#94a3b8",
      colorIcon: brand.primary,
    },
    Collapse: {
      colorText: light.textBase,
      colorIcon: light.textBase,
      headerBg: "transparent",
      colorBorder: light.border,
      colorFillAlter: "transparent",
    },
    Modal: {
      colorBgContainer: light.surface,
      borderRadius: 20,
    },
    Tabs: {
      itemActiveColor: brand.primary,
      colorPrimary: brand.primary,
      colorText: brand.primary,
      colorTextHeading: brand.primary,
      colorBorderSecondary: brand.primary,
      itemColor: "#666666",
      itemSelectedColor: brand.primary,
      itemHoverColor: brand.primary,
      inkBarColor: brand.primary,
      titleFontSize: 16,
      horizontalItemGutter: 32,
    },
    Drawer: {
      colorBgElevated: light.surfaceElevated,
      colorText: light.textBase,
      colorTextHeading: "#ffffff",
      padding: 24,
      borderRadius: 8,
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.info,
    colorSuccess: brand.success,
    colorWarning: brand.warning,
    colorError: brand.error,
    colorLink: brand.link,
    colorBgBase: dark.bgBase,
    colorTextBase: dark.textBase,
  },
  components: {
    Table: {
      colorTextHeading: brand.primary,
      colorText: dark.textBase,
      colorBorder: dark.border,
      colorBgContainer: dark.surface,
      headerBg: "#0d1628", // was `colorBgHeader`/`colorHeaderBg` (invalid keys)
      rowHoverBg: "#1a2d4e",
      rowSelectedBg: "#1e3a5f",
      rowSelectedHoverBg: "#234a7a",
    },
    Menu: {
      colorBgContainer: dark.bgBase,
      colorText: brand.info,
      itemHoverBg: "#1f1f1f", // was `colorItemHoverBg`
      itemSelectedBg: brand.primary, // was `colorItemSelectedBg`
      itemSelectedColor: "#ffffff", // was `colorItemSelectedText`
      iconSize: 24,
    },
    Button: {
      colorPrimary: brand.primary,
      colorTextDisabled: "#666666",
      colorPrimaryHover: brand.primaryHover,
      colorPrimaryActive: brand.primaryActive,
      colorBgContainerDisabled: "#1f1f1f",
      borderRadius: 6,
      fontSize: 14,
      controlHeight: 50,
      boxShadow: "0 0px 0 rgba(5, 145, 255, 0.1)",
    },
    Progress: {
      defaultColor: brand.primary,
      colorSuccess: brand.primary,
    },
    Form: {
      labelColor: dark.textBase,
      labelFontSize: 16,
    },
    Input: {
      controlHeight: 44,
      controlHeightLG: 48,
      borderRadius: 10,
      colorBgContainer: "#16233b",
      colorText: "#e8eefc",
      colorTextPlaceholder: "#64748b",
      colorBorder: "rgba(255, 255, 255, 0.10)",
      hoverBorderColor: brand.primary,
      activeBorderColor: brand.primary,
      activeShadow: "0 0 0 3px rgba(139, 47, 201, 0.25)",
    },
    InputNumber: {
      controlHeight: 44,
      borderRadius: 10,
      colorBgContainer: "#0f1a2e",
      colorText: "#e8eefc",
      colorBorder: "rgba(255, 255, 255, 0.10)",
      hoverBorderColor: brand.primary,
      activeBorderColor: brand.primary,
    },
    Select: {
      controlHeight: 44,
      borderRadius: 10,
      colorTextPlaceholder: "#64748b",
      colorBgContainer: "#0f1a2e",
      colorText: "#e8eefc",
      colorBorder: "rgba(255, 255, 255, 0.10)",
      colorBgElevated: "#111c33",
      controlItemBgHover: "#1a2b47",
      controlItemBgActive: brand.primary,
      optionSelectedColor: "#ffffff",
      optionSelectedBg: brand.primary,
    },
    DatePicker: {
      controlHeight: 44,
      borderRadius: 10,
      colorTextPlaceholder: "#64748b",
      colorIcon: brand.primary,
      colorBgContainer: "#0f1a2e",
      colorText: "#e8eefc",
      colorBorder: "rgba(255, 255, 255, 0.10)",
    },
    Collapse: {
      colorText: dark.textBase,
      colorIcon: dark.textBase,
      headerBg: "transparent",
      colorBorder: dark.border,
      colorFillAlter: "transparent",
    },
    Modal: {
      colorBgContainer: dark.surface,
      colorBgElevated: dark.surfaceElevated,
      colorText: dark.textBase,
      colorTextHeading: dark.textBase,
      colorIcon: dark.placeholder,
      colorIconHover: brand.primary,
      borderRadius: 20,
      borderRadiusLG: 20,
      padding: 24,
      paddingLG: 28,
      fontSize: 16,
      fontSizeLG: 18,
      lineHeight: 1.5,
      wireframe: false,
    },
    Tabs: {
      itemActiveColor: brand.primary,
      colorPrimary: brand.primary,
      colorText: brand.primary,
      colorTextHeading: brand.primary,
      colorBorderSecondary: dark.border,
      itemColor: dark.placeholder,
      itemSelectedColor: brand.primary,
      itemHoverColor: brand.primary,
      inkBarColor: brand.primary,
      titleFontSize: 16,
      horizontalItemGutter: 32,
    },
    Drawer: {
      colorBgElevated: dark.surfaceElevated,
      colorText: dark.textBase,
      colorTextHeading: dark.textBase,
      padding: 24,
      borderRadius: 8,
    },
  },
};
