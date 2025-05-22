import {
  component$,
  useSignal,
  useComputed$,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import { inlineTranslate, localizePath } from "qwik-speak";
import { EmailInput } from "~/components/auth/email-input";
import { NameInput } from "~/components/auth/name-input";
import { PasswordInput } from "~/components/auth/password-input";
import { PhoneInput } from "~/components/auth/phone-input";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseSignUp = routeAction$(async (formData, requestEv) => {
  const { data, error } = await supabase(requestEv).auth.signUp({
    email: formData.email.toString(),
    password: formData.password.toString(),
    options: {
      emailRedirectTo: `${requestEv.url.origin}/booking`,
      data: {
        name: formData.name.toString(),
        phone: formData.phone.toString(),
      },
    },
  });

  if (error) {
    console.log("Error signing up:", error);
    return { success: false, error: { message: error.message } };
  }

  // Check if the user got created
  if (data.user?.identities && data.user.identities.length > 0) {
    console.log("Sign-up successful!");

    const addUserToClients = await supabase(requestEv).from("clients").upsert(
      {
        name: formData.name.toString(),
        email: formData.email.toString(),
        phone: formData.phone.toString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      { onConflict: "email" },
    );

    if (addUserToClients.error) {
      console.log("Error adding user to clients:", addUserToClients.error);
      return {
        success: false,
        error: { message: addUserToClients.error.message },
      };
    }

    return { success: true };
  }

  console.log("Email address is already taken.");
  const signInResponse = await supabase(requestEv).auth.signInWithPassword({
    email: formData.email.toString(),
    password: formData.password.toString(),
  });

  if (signInResponse.error) {
    console.error(
      "An error occurred during sign-in:",
      signInResponse.error.message,
    );
    return { success: false, error: { message: signInResponse.error.message } };
  }
  console.log("Successfully signed in existing user!");
  const getPath = localizePath();
  const pathtohome = getPath("/booking", requestEv.locale());
  console.log(pathtohome);
  throw requestEv.redirect(302, pathtohome);
});

export default component$(() => {
  // Reactive signals for form inputs and error
  const name = useSignal("");
  const email = useSignal("");
  const phone = useSignal("");
  const password = useSignal("");
  const confirmPassword = useSignal("");
  const passwordMismatch = useComputed$(
    () => password.value !== confirmPassword.value,
  );
  const t = inlineTranslate();
  useOnDocument(
    "DOMContentLoaded",
    $(async () => {
      console.log("IMPORT CALLY");
      await import("cally");
    }),
  );

  const useSignUp = useSupabaseSignUp();

  return (
    <>
      <h1 class="text-3xl font-bold text-center text-primary font-qestero">
        {t("app.auth.signup@@Sign Up")}
      </h1>
      <Form class="space-y-6" action={useSignUp}>
        <div class="space-y-4">
          <NameInput nameSignal={name} />
          <PhoneInput phoneSignal={phone} />
        </div>
        <div class="space-y-4">
          <EmailInput emailSignal={email} />
          <PasswordInput
            password={password}
            placeholder={t("app.auth.set_password_placeh@@Enter your password")}
            minLength={6}
          />
          <PasswordInput
            password={confirmPassword}
            placeholder={t(
              "app.auth.set_passwordconf_placeh@@Confirm your password",
            )}
            minLength={6}
          />
        </div>
        {passwordMismatch.value && (
          <div class="text-error text-xs">
            {t("app.auth.password_mismatch@@Passwords do not match")}
          </div>
        )}
        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={
            !email.value ||
            !password.value ||
            !confirmPassword.value ||
            passwordMismatch.value ||
            useSignUp.isRunning ||
            useSignUp.value?.success
          }
        >
          {useSignUp.isRunning ? (
            <span class="loading loading-spinner me-2 loading-md" />
          ) : (
            "Sign Up"
          )}
        </button>
      </Form>

      <div class="flex justify-center">
        {useSignUp.value?.success && (
          <p class="text-success">
            {t(
              "app.auth.user_added@@User added successfully. Please check your email for a verification link.",
            )}
          </p>
        )}
        {!useSignUp.value?.success && (
          <p class="text-error">{useSignUp.value?.error?.message}</p>
        )}
      </div>
    </>
  );
});
