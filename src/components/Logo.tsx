import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizes = {
  sm: { img: 28, text: "text-base" },
  md: { img: 36, text: "text-lg" },
  lg: { img: 48, text: "text-xl" },
  xl: { img: 120, text: "text-3xl" },
};

export function Logo({ size = "md", showText = true, href, className = "" }: LogoProps) {
  const { img, text } = sizes[size];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="BTimely"
        width={img}
        height={img}
        className="object-contain shrink-0"
        priority={size === "xl"}
      />
      {showText && (
        <span className={`font-bold tracking-tight text-foreground ${text}`}>
          BTimely
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
