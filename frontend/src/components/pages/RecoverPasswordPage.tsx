import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoginService } from "@/client";
import { AuthLayout } from "@/components/common/AuthLayout";
import { GuestOnly } from "@/components/common/RouteGuards";
import { AppProviders } from "@/components/providers/AppProviders";
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
import { isLoggedIn } from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

const formSchema = z.object({
  email: z.email(),
});

type FormData = z.infer<typeof formSchema>;

export function RecoverPasswordPage() {
  return (
    <AppProviders>
      <RecoverPasswordContent />
    </AppProviders>
  );
}

function RecoverPasswordContent() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      LoginService.recoverPassword({
        email: data.email,
      }),
    onSuccess: () => {
      showSuccessToast("Password recovery email sent successfully");
      form.reset();
    },
    onError: handleError.bind(showErrorToast),
  });

  const onSubmit = async (data: FormData) => {
    if (mutation.isPending) {
      return;
    }

    mutation.mutate(data);
  };

  if (isLoggedIn()) {
    return null;
  }

  return (
    <GuestOnly>
      <AuthLayout>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Password Recovery</h1>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="email-input"
                        placeholder="user@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton type="submit" className="w-full" loading={mutation.isPending}>
                Continue
              </LoadingButton>
            </div>

            <div className="text-center text-sm">
              Remember your password?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </Form>
      </AuthLayout>
    </GuestOnly>
  );
}
