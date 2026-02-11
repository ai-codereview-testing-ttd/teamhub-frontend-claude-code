import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { MembersPage } from "@/components/pages/members/members-page";

export default function MembersPageRoute() {
  return (
    <AppLayout title="Members">
      <MembersPage />
    </AppLayout>
  );
}
