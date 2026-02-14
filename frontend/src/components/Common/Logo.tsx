import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <a href="/" className={cn("font-semibold tracking-tight", className)}>
      FastAPI Cloud
    </a>
  );
}
