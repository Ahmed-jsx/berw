// components/providers/hydrate-client.tsx
"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

interface HydrateClientProps {
  children: ReactNode;
  state: unknown;
}

export default function HydrateClient({ children, state }: HydrateClientProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
