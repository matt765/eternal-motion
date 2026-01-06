"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark", "ocean", "sunset"]}
    >
      {children}
    </ThemeProvider>
  );
}
