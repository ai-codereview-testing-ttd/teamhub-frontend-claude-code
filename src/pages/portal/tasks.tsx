import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { TasksPage } from "@/components/pages/tasks/tasks-page";

export default function TasksPageRoute() {
  return (
    <AppLayout title="Tasks">
      <TasksPage />
    </AppLayout>
  );
}
