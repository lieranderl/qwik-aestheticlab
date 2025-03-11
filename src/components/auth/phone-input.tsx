import type { Signal } from "@builder.io/qwik";
import { HiPhoneOutline } from "@qwikest/icons/heroicons";

export interface PhoneInputProps {
	phoneSignal: Signal<string>;
	readonly?: boolean;
}
export const PhoneInput = ({ phoneSignal, readonly }: PhoneInputProps) => {
	return (
		<div>
			<label class="input input-primary validator w-full">
				<HiPhoneOutline class="text-primary w-4 h-4" />
				<input
					name="phone"
					type="tel"
					placeholder="Enter your phone number"
					required
					pattern="^\+?[0-9\-\s]{9,15}$"
					bind:value={phoneSignal}
					readOnly={readonly}
				/>
			</label>
			<div class="validator-hint hidden">Please enter valid phone number</div>
		</div>
	);
};
