import React from "react";
import type { DashboardStats } from "@/types";
import { formatNumber } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {formatNumber(value)}
      </p>
    </div>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Projects"
        value={stats.totalProjects}
        color="text-blue-600"
      />
      <StatCard
        label="Total Tasks"
        value={stats.totalTasks}
        color="text-purple-600"
      />
      <StatCard
        label="Tasks Completed"
        value={stats.tasksCompleted}
        color="text-green-600"
      />
      <StatCard
        label="Team Members"
        value={stats.totalMembers}
        color="text-orange-600"
      />
    </div>
  );
}
