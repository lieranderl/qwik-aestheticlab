import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { EmailInput } from "~/components/auth/email-input";
import { NameInput } from "~/components/auth/name-input";
import { PhoneInput } from "~/components/auth/phone-input";

export interface ContactFormInputsProps {
	nameSignal: Signal<string>;
	emailSignal: Signal<string>;
	phoneSignal: Signal<string>;
	isAdmin: boolean;
	changeEmailByAdmin: Signal<string>;
	signOut?: ActionStore<
		{
			success: boolean;
		},
		Record<string, unknown>,
		true
	>;
}

export const ContactFormInputs = component$<ContactFormInputsProps>(
	({
		nameSignal,
		emailSignal,
		phoneSignal,
		signOut,
		isAdmin,
		changeEmailByAdmin,
	}) => {
		return (
			<>
				<EmailInput
					emailSignal={emailSignal}
					readonly={!isAdmin}
					isAdmin={isAdmin}
					signOut={signOut}
					changeEmailByAdmin={changeEmailByAdmin}
				/>
				<NameInput nameSignal={nameSignal} readonly={!isAdmin} />
				<PhoneInput phoneSignal={phoneSignal} readonly={!isAdmin} />
			</>
		);
	},
);
