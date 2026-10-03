"use client";

import { useEffect, useState } from "react";
import { LoadingWrapper } from "./LoadingWrapper";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return <LoadingWrapper isLoading={isLoading}>{children}</LoadingWrapper>;
}
