import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource/poppins";
import "@fontsource/dm-sans";
import "@fontsource/inter";
import "@fontsource/amatic-sc";

import "@fontsource/exo";
import "@fontsource/oswald";
import "@fontsource/heebo/600.css";
import "@fontsource/heebo/500.css";
import "@fontsource/heebo/400.css";
import "@fontsource/jost/600.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/300.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/300.css";
import "../styles/globals.css";
import "../styles/theme-light.scss";
import "../styles/theme-dark.scss";
import "../styles/theme-sunset.scss";
import "../styles/theme-ocean.scss";
import { Providers } from "../services/Providers";
import { Layout } from "../layout/Layout";

export const metadata: Metadata = {
  title: "Eternal Motion",
  description: "Physics simulations and interactive animations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
