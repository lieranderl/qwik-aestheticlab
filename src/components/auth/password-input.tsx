import { type Signal, component$, useSignal } from "@builder.io/qwik";
import {
	HiLockClosedOutline,
	HiEyeSlashOutline,
	HiEyeOutline,
} from "@qwikest/icons/heroicons";

export interface PasswordInputProps {
	password: Signal<string>;
	placeholder: string;
	minLength: number;
}
export const PasswordInput = component$(
	({ password, placeholder, minLength }: PasswordInputProps) => {
		const showPassword = useSignal(false);
		return (
			<div>
				<label class="input input-primary validator w-full">
					<HiLockClosedOutline class="text-primary w-4 h-4" />
					<input
						name="password"
						type={showPassword.value ? "text" : "password"}
						placeholder={placeholder}
						minLength={minLength}
						required
						bind:value={password}
					/>
					{!showPassword.value ? (
						<HiEyeSlashOutline
							class="text-primary w-4 h-4 cursor-pointer"
							onClick$={() => {
								showPassword.value = !showPassword.value;
							}}
						/>
					) : (
						<HiEyeOutline
							class="text-primary w-4 h-4 cursor-pointer"
							onClick$={() => {
								showPassword.value = !showPassword.value;
							}}
						/>
					)}
				</label>
				<div class="validator-hint hidden">Please enter your password</div>
			</div>
		);
	},
);
