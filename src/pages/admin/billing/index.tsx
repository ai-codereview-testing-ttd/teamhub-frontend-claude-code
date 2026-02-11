import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { apiGet } from "@/lib/requests";
import { Badge } from "@/components/ui/badge";
import { BILLING_TIER_LABELS } from "@/lib/constants";
import type { BillingPlan } from "@/types";

interface BillingUsage {
  plan: BillingPlan;
  currentMembers: number;
  currentProjects: number;
}

export default function BillingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["billing-usage"],
    queryFn: () => apiGet<BillingUsage>("/billing/usage"),
  });

  if (isLoading) {
    return (
      <AppLayout title="Billing">
        <p className="text-gray-500">Loading billing info...</p>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout title="Billing">
        <p className="text-gray-500">Unable to load billing information.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Billing">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Plan</h3>
            <Badge>{BILLING_TIER_LABELS[data.plan.tier]}</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${data.plan.pricePerMonth}
            <span className="text-sm font-normal text-gray-500">/month</span>
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Members</span>
                <span className="font-medium">
                  {data.currentMembers} / {data.plan.maxMembers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.currentMembers / data.plan.maxMembers) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Projects</span>
                <span className="font-medium">
                  {data.currentProjects} / {data.plan.maxProjects}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.currentProjects / data.plan.maxProjects) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <ul className="space-y-2">
            {data.plan.features.map((feature) => (
              <li key={feature} className="flex items-center text-sm">
                <span className="text-green-500 mr-2">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
