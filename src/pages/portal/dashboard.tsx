import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardPage } from "@/components/pages/dashboard/dashboard-page";

export default function DashboardPageRoute() {
  return (
    <AppLayout title="Dashboard">
      <DashboardPage />
    </AppLayout>
  );
}
