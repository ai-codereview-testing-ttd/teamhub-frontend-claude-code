import React from "react";
import type { ActivityItem } from "@/types";
import { getRelativeTime } from "@/lib/utils";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <li key={activity.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  by {activity.actorName}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {getRelativeTime(activity.createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
