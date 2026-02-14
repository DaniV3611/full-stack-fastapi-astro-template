import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <a href={href} className={cn("font-semibold tracking-tight", className)}>
      FastAPI Cloud
    </a>
  );
}
