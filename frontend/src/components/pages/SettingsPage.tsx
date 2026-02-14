import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type UpdatePassword, type UserUpdateMe, UsersService } from "@/client";
import { ProtectedLayout } from "@/components/common/ProtectedLayout";
import { RequireAuth } from "@/components/common/RouteGuards";
import { AppProviders } from "@/components/providers/AppProviders";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handleError } from "@/utils";

const profileSchema = z.object({
  full_name: z.string().max(30).optional(),
  email: z.email({ message: "Invalid email address" }),
});

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    new_password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "The passwords don't match",
    path: ["confirm_password"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function ProfileTab() {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name ?? undefined,
      email: currentUser?.email,
    },
  });

  useEffect(() => {
    form.reset({
      full_name: currentUser?.full_name ?? undefined,
      email: currentUser?.email,
    });
  }, [currentUser, form]);

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) => UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully");
      setEditMode(false);
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const updateData: UserUpdateMe = {};

    if (data.full_name !== currentUser?.full_name) {
      updateData.full_name = data.full_name;
    }
    if (data.email !== currentUser?.email) {
      updateData.email = data.email;
    }

    mutation.mutate(updateData);
  };

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold py-4">User Information</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) =>
              editMode ? (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <p
                    className={cn(
                      "py-2 truncate max-w-sm",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value || "N/A"}
                  </p>
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) =>
              editMode ? (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <p className="py-2 truncate max-w-sm">{field.value}</p>
                </FormItem>
              )
            }
          />

          <div className="flex gap-3">
            {editMode ? (
              <>
                <LoadingButton
                  type="submit"
                  loading={mutation.isPending}
                  disabled={!form.formState.isDirty}
                >
                  Save
                </LoadingButton>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setEditMode(false);
                  }}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function PasswordTab() {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    criteriaMode: "all",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Password updated successfully");
      form.reset();
    },
    onError: handleError.bind(showErrorToast),
  });

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold py-4">Change Password</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="current_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="current-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="new-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="confirm-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={mutation.isPending} className="self-start">
            Update Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}

function DangerZoneTab() {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { logout } = useAuth();

  const mutation = useMutation({
    mutationFn: () => UsersService.deleteUserMe(),
    onSuccess: () => {
      showSuccessToast("Your account has been successfully deleted");
      logout();
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return (
    <div className="max-w-md mt-4 rounded-lg border border-destructive/50 p-4">
      <h3 className="font-semibold text-destructive">Delete Account</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Permanently delete your account and all associated data.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-3">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation Required</DialogTitle>
            <DialogDescription>
              All your account data will be <strong>permanently deleted.</strong> If you
              are sure, click <strong>Delete</strong> to proceed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <LoadingButton
              variant="destructive"
              type="button"
              loading={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SettingsContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedLayout user={user}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="my-profile">
          <TabsList>
            <TabsTrigger value="my-profile">My profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="danger-zone">Danger zone</TabsTrigger>
          </TabsList>

          <TabsContent value="my-profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="password">
            <PasswordTab />
          </TabsContent>
          <TabsContent value="danger-zone">
            <DangerZoneTab />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}

export function SettingsPage() {
  return (
    <AppProviders>
      <RequireAuth>
        <SettingsContent />
      </RequireAuth>
    </AppProviders>
  );
}
