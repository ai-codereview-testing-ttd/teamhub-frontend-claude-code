import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ProjectsPage } from "@/components/pages/projects/projects-page";

export default function ProjectsPageRoute() {
  return (
    <AppLayout title="Projects">
      <ProjectsPage />
    </AppLayout>
  );
}
