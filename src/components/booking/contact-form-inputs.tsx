import type { Signal, QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { PhoneInput } from "~/components/auth/phone-input";
import { EmailInput } from "~/components/auth/email-input";
import { NameInput } from "~/components/auth/name-input";
import type { ActionStore } from "@builder.io/qwik-city";

export interface ContactFormInputsProps {
  nameSignal: Signal<string>;
  emailSignal: Signal<string>;
  phoneSignal: Signal<string>;
  isAdmin: boolean;
  changeEmailByAdmin: QRL<(e: Event) => void>;
  signOut?: ActionStore<
    {
      success: boolean;
    },
    Record<string, unknown>,
    true
  >;
}

export const ContactFormInputs = component$<ContactFormInputsProps>(
  ({ nameSignal, emailSignal, phoneSignal, signOut, isAdmin, changeEmailByAdmin }) => {

    return (
      <>
        <EmailInput
          emailSignal={emailSignal}
          readonly={!isAdmin}
          signOut={signOut}
          changeEmailByAdmin={changeEmailByAdmin}
        />
        <NameInput nameSignal={nameSignal} readonly={!isAdmin} />
        <PhoneInput phoneSignal={phoneSignal} readonly={!isAdmin} />
      </>
    );
  },
);
