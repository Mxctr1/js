"use client";

import { ColorModeToggle } from "@/components/color-mode-toggle";
import { thirdwebClient } from "@/constants/client";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConnectEmbed } from "thirdweb/react";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";

export default function LoginPage() {
  return (
    <div className="bg-background h-full">
      <nav className="fixed top-0 w-full flex flex-row justify-between items-center px-6 py-4 z-20">
        <ThirdwebMiniLogo className="max-h-7" />
        <ColorModeToggle />
      </nav>
      <main className="h-full relative grid place-items-center">
        <div className="flex flex-col gap-8 z-10">
          <h1 className="font-semibold text-2xl">Get started with thirdweb</h1>
          <Suspense>
            <CustomConnectEmmbed />
          </Suspense>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src="/assets/login/background.svg"
          className="fixed bottom-0 right-0"
        />
      </main>
    </div>
  );
}

function CustomConnectEmmbed() {
  const isLG = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <ConnectEmbed
      auth={{
        getLoginPayload: getLoginPayload,
        doLogin: async (params) => {
          const nextPath = searchParams?.get("next");
          await doLogin(params);

          // redirect to the page where the user was before login
          if (nextPath && isValidRedirectPath(nextPath)) {
            router.replace(nextPath);
          } else {
            // redirect to dashboard home
            router.replace("/dashboard");
          }
        },
        doLogout: doLogout,
        isLoggedIn: isLoggedIn,
      }}
      client={thirdwebClient}
      modalSize={isLG ? "wide" : "compact"}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}

function isValidRedirectPath(encodedPath: string): boolean {
  try {
    // Decode the URI component
    const decodedPath = decodeURIComponent(encodedPath);
    // ensure the path always starts with a _single_ slash
    // dobule slash could be interpreted as `//example.com` which is not allowed
    return decodedPath.startsWith("/") && !decodedPath.startsWith("//");
  } catch (e) {
    // If decoding fails, return false
    return false;
  }
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  // required here
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
