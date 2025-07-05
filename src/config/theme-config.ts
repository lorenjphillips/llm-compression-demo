import type { NextUIPluginConfig } from "@heroui/react";

const themeConfig: NextUIPluginConfig = {
  themes: {
    light: {
      layout: {},
      colors: {
        primary: {
          50: "#CBD5B9", 100: "#BFCCA9", 200: "#9BAF79", 300: "#69C0FF",
          400: "#40A9FF", 500: "#1890FF", 600: "#096DD9", 700: "#4B5935",
          800: "#303922", 900: "#232918", foreground: "#000000",
          DEFAULT: "#BCC1CA",
        },
        secondary: {
          50: "#E6BBA0", 100: "#D79064", 200: "#BE6731", 300: "#824622",
          400: "#6E3B1D", 500: "#5A3018", 600: "#462513", 700: "#321A0E",
          800: "#1E0F09", 900: "#0A0504", foreground: "#FFFFFF",
          DEFAULT: "#BE6731",
        },
        warning: { foreground: "#FFFFFF", DEFAULT: "#F0B775" },
        danger: { foreground: "#FFFFFF", DEFAULT: "#E57373" },
        success: { foreground: "#FFFFFF", DEFAULT: "#A2B87A" },
        skeleton: {
          header: "#e0e0e0", metric: "#d0d0d0", sentiment: "#c0c0c0",
          goal: "#b0b0b0", audio: "#a0a0a0", card: "#f5f5f5",
          DEFAULT: "#e0e0e0",
        },
      },
    },
    dark: {
      layout: {},
      colors: {
        background: {
          50: "#1A1A1A", 100: "#2C2C2C", 200: "#3D3D3D", 300: "#4F4F4F",
          400: "#616161", 500: "#737373", 600: "#858585", 700: "#969696",
          800: "#A8A8A8", 900: "#BABABA", foreground: "#FFFFFF",
          DEFAULT: "#121212",
        },
        primary: {
          50: "#CBD5B9", 100: "#BFCCA9", 200: "#9BAF79", 300: "#69C0FF",
          400: "#40A9FF", 500: "#1890FF", 600: "#096DD9", 700: "#4B5935",
          800: "#303922", 900: "#232918", foreground: "#000000",
          DEFAULT: "#BCC1CA",
        },
        secondary: {
          50: "#E6BBA0", 100: "#D79064", 200: "#BE6731", 300: "#824622",
          400: "#6E3B1D", 500: "#5A3018", 600: "#462513", 700: "#321A0E",
          800: "#1E0F09", 900: "#0A0504", foreground: "#FFFFFF",
          DEFAULT: "#BE6731",
        },
        warning: { foreground: "#FFFFFF", DEFAULT: "#fdb73e" },
        danger: { foreground: "#FFFFFF", DEFAULT: "#A03A00" },
        success: { foreground: "#FFFFFF", DEFAULT: "#7A9A5E" },
        skeleton: {
          header: "#3A3A3A", metric: "#4A4A4A", sentiment: "#5A5A5A",
          goal: "#6A6A6A", audio: "#7A7A7A", card: "#2F2F2F",
          DEFAULT: "#3A3A3A",
        },
      },
    },
  },
};

export default themeConfig;