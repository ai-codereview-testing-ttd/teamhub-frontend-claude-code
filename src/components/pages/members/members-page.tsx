import React, { useState } from "react";
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
import { MEMBER_ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PaginatedResponse, Member } from "@/types";

export function MembersPage() {
  const [showInvite, setShowInvite] = useState(false);
  // TODO: Wire up invite dialog
  void showInvite;

  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => apiGet<PaginatedResponse<Member>>("/members"),
  });

  const members = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{members.length} members</p>
        <Button onClick={() => setShowInvite(true)}>Invite Member</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading members...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No members found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">
                      {member.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{member.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.role === "OWNER" ? "default" : "secondary"
                    }
                  >
                    {MEMBER_ROLE_LABELS[member.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  {member.joinedAt
                    ? formatDate(member.joinedAt)
                    : "Pending invite"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
