import Link from "next/link";

import { cn } from "@/lib/utils";

type PremiumButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const baseStyles =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-olive px-8 text-sm font-medium tracking-wide text-ivory shadow-soft transition-all duration-500 hover:bg-olive-deep hover:shadow-card disabled:pointer-events-none disabled:opacity-50";

export function PremiumButton({
  children,
  className,
  href,
  type = "button",
  disabled,
  onClick,
}: PremiumButtonProps) {
  const styles = cn(baseStyles, className);

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
