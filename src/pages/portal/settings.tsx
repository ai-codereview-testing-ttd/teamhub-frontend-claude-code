import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { apiPut } from "@/lib/requests";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";
import type { Organization } from "@/types";

const settingsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  defaultProjectVisibility: z.enum(["public", "private"]),
  allowGuestAccess: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPageRoute() {
  const { organization, isLoading } = useCurrentOrg();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: organization
      ? {
          name: organization.name,
          defaultProjectVisibility:
            organization.settings.defaultProjectVisibility,
          allowGuestAccess: organization.settings.allowGuestAccess,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: SettingsFormValues) =>
      apiPut<Organization>(`/organizations/${organization?.id}/settings`, {
        settings: {
          defaultProjectVisibility: data.defaultProjectVisibility,
          allowGuestAccess: data.allowGuestAccess,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      addToast({ title: "Settings saved" });
    },
    onError: (error: Error) => {
      addToast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Settings">
        <p className="text-gray-500">Loading settings...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Project Visibility
              </label>
              <select
                {...register("defaultProjectVisibility")}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowGuestAccess"
                {...register("allowGuestAccess")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label
                htmlFor="allowGuestAccess"
                className="text-sm text-gray-700"
              >
                Allow guest access to public projects
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={!isDirty || mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
