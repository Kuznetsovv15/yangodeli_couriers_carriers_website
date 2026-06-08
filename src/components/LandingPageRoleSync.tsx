"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isRole, type Role } from "@/types/role";

type LandingPageRoleSyncProps = {
  onRoleFromUrl: (role: Role) => void;
};

/** Isolated so LandingPage mounts immediately and delayed CTA timer starts on load. */
export function LandingPageRoleSync({ onRoleFromUrl }: LandingPageRoleSyncProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (isRole(roleParam)) {
      onRoleFromUrl(roleParam);
    }
  }, [searchParams, onRoleFromUrl]);

  return null;
}
