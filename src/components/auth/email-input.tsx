import type { Signal } from "@builder.io/qwik";
import { HiEnvelopeOutline } from "@qwikest/icons/heroicons";

export interface EmailInputProps {
	emailSignal: Signal<string>;
	readonly?: boolean;
}
export const EmailInput = ({ emailSignal, readonly }: EmailInputProps) => {
	return (
		<div>
			<label class="input input-primary validator w-full gap-2">
				<HiEnvelopeOutline class="text-primary w-4 h-4" />
				<input
					name="email"
					type="email"
					placeholder="Enter your email"
					pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
					required
					bind:value={emailSignal}
					readOnly={readonly}
				/>
			</label>
			<div class="validator-hint hidden">Please enter your email</div>
		</div>
	);
};
