import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { PhoneInput } from "~/components/auth/phone-input";
import { EmailInput } from "~/components/auth/email-input";
import { NameInput } from "~/components/auth/name-input";
import type { ActionStore } from "@builder.io/qwik-city";

export interface ContactFormInputsProps {
	nameSignal: Signal<string>;
	emailSignal: Signal<string>;
	phoneSignal: Signal<string>;
	signOut?: ActionStore<
		{
			success: boolean;
			error: {
				message: string;
			};
		},
		Record<string, unknown>,
		true
	>;
}

export const ContactFormInputs = component$<ContactFormInputsProps>(
	({ nameSignal, emailSignal, phoneSignal, signOut }) => {
		return (
			<>
				<EmailInput
					emailSignal={emailSignal}
					readonly={true}
					signOut={signOut}
				/>
				<NameInput nameSignal={nameSignal} readonly={true} />
				<PhoneInput phoneSignal={phoneSignal} readonly={true} />
			</>
		);
	},
);
