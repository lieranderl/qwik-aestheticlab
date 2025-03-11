import type { Signal } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import {
	HiArrowUpOnSquareOutline,
	HiUserOutline,
} from "@qwikest/icons/heroicons";

export interface NameInputProps {
	nameSignal: Signal<string>;
	readonly?: boolean;
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
export const NameInput = ({
	nameSignal,
	readonly,
	signOut,
}: NameInputProps) => {
	return (
		<div>
			<label class="input input-primary validator w-full">
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
				{signOut && (
					<button
						type="button"
						class="btn btn-sm btn-primary"
						onClick$={() => signOut.submit()}
					>
						<HiArrowUpOnSquareOutline class="w-4 h-4 rotate-90" />
						Logout
					</button>
				)}
			</label>
			<div class="validator-hint hidden">Please enter your name</div>
		</div>
	);
};
