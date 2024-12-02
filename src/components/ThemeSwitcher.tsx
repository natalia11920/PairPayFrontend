"use client";

import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../assets/SunIcon";
import { MoonIcon } from "../assets/MoonIcon";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      isSelected={theme === "dark"}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="sm"
      color="primary"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    ></Switch>
  );
}
