import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { apiGet } from "@/lib/requests";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Organization } from "@/types";

export default function OrganizationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: () => apiGet<Organization[]>("/organizations"),
  });

  return (
    <AppLayout title="Organizations">
      {isLoading ? (
        <p className="text-gray-500">Loading organizations...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data ?? []).map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="text-gray-500">{org.slug}</TableCell>
                <TableCell>{org.memberCount}</TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(org.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AppLayout>
  );
}
