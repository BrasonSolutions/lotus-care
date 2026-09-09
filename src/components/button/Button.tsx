import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "onDark" | "onDarkOutline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonCommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

interface ButtonAsLinkProps extends ButtonCommonProps {
  /** Renders an `<a>` (via `next/link`, so internal routes still get
   * client-side navigation) when set. Omit to render a `<button>`. */
  href: string;
  target?: string;
  rel?: string;
  type?: undefined;
}

interface ButtonAsButtonProps extends ButtonCommonProps {
  href?: undefined;
  target?: undefined;
  rel?: undefined;
  type?: "button" | "submit" | "reset";
}

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

// Resting/hover pairs verified against the repo's real, already-shipped CTAs
// (see the button/chip consolidation audit): HeroSection's primary CTA is
// the onDark reference (bg-white/text-primary-dark, hover:bg-teal-100),
// its secondary/tertiary CTAs are the onDarkOutline reference
// (border-white/text-white, hover:bg-white/10), and Navbar/JobCard/
// RecruitmentSection's solid CTAs are the primary reference
// (bg-primary-dark, hover:bg-teal-800). `outline` mirrors
// RecruitmentSection's/HomesCarousel's border-primary-dark CTA, inverting
// to a solid fill on hover.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary-dark text-white hover:bg-teal-800 focus-ring",
  outline:
    "bg-transparent border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white focus-ring",
  onDark: "bg-white text-primary-dark hover:bg-teal-100 focus-ring-white",
  onDarkOutline:
    "bg-transparent border-2 border-white text-white hover:bg-white/10 focus-ring-white",
};

// lg = 16px/32px padding, text-lg (section/hero CTAs). md = 10px/20px,
// text-base (navbar). sm = 10px/20px, text-sm (inside cards).
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-4 text-lg",
};

/**
 * Pill-shaped call-to-action primitive (design skill section 7). Hover is
 * always a colour change only — never a scale-up — and there is no
 * distinct pressed style. `href` renders a `<a>` (via `next/link`);
 * omitting it renders a native `<button>`.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    className = "",
    children,
    onClick,
  } = props;

  const classes = [
    "inline-flex items-center justify-center rounded-full font-semibold text-center transition-colors",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-60 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
