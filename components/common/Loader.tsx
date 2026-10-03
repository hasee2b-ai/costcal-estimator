interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function Loader({ size = "md", className = "" }: LoaderProps) {
  return (
    <div
      className={`${sizes[size]} ${className} animate-spin rounded-full border-[#e8e4f5] border-t-[#8b7cf6] border-r-[#a78bfa]`}
      role="status"
      aria-label="Loading"
    />
  );
}
