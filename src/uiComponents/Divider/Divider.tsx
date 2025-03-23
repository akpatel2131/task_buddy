import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";
import styles from "./divider.module.css";

const DIVIDER_SPACING_OPTIONS = ["none", "small", "medium", "large"] as const;

export interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  spacing?: (typeof DIVIDER_SPACING_OPTIONS)[number];
  vertical?: boolean;
}

export default function Divider({
  children,
  className,
  spacing = "medium",
  vertical = false,
  ...props
}: DividerProps) {
  return (
    <div className={clsx(styles.root, className)} role="separator" {...props} />
  );
}
