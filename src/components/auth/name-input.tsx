import type { Signal } from "@builder.io/qwik";
import { HiUserOutline } from "@qwikest/icons/heroicons";

export interface NameInputProps {
	nameSignal: Signal<string>;
	readonly?: boolean;
}
export const NameInput = ({ nameSignal, readonly }: NameInputProps) => {
	return (
		<div>
			<label
				class={
					readonly
						? "input input-primary validator w-full pointer-events-none select-none"
						: "input input-primary validator w-full "
				}
			>
				<HiUserOutline class="text-primary w-4 h-4" />
				<input
					name="name"
					type="text"
					placeholder="Enter you name"
					pattern="^[\s\S]{2,50}$"
					required
					bind:value={nameSignal}
					readOnly={readonly}
				/>
			</label>
			<div class="validator-hint hidden">Please enter your name</div>
		</div>
	);
};
