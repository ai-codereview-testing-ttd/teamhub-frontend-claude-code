import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/requests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CreateProjectDialog } from "./create-project-dialog";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PaginatedResponse, Project, ProjectStatus } from "@/types";

export function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">(
    "ALL"
  );

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiGet<PaginatedResponse<Project>>("/projects"),
  });

  const filteredProjects = useMemo(() => {
    if (!data?.data) return [];
    if (statusFilter === "ALL") return data.data;
    return data.data.filter((p) => p.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ProjectStatus | "ALL")
            }
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <Button onClick={() => setShowCreate(true)}>New Project</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No projects found.</p>
          <Button className="mt-4" onClick={() => setShowCreate(true)}>
            Create your first project
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      project.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </TableCell>
                <TableCell>{project.memberIds.length}</TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(project.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateProjectDialog open={showCreate} onOpenChange={setShowCreate} />
    </div>
  );
}
