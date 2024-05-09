"use client";

import { PrivatePageWrapper } from "@repo/auth";
import { AdminInviteForm } from "./AdminInviteForm";

export default function AdminPage() {
  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      <div className="w-full p-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <AdminInviteForm />
      </div>
    </PrivatePageWrapper>
  );
}
