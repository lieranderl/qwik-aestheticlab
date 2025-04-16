import { type Signal, component$, useSignal } from "@builder.io/qwik";
import {
	HiLockClosedOutline,
	HiEyeSlashOutline,
	HiEyeOutline,
} from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";

export interface PasswordInputProps {
	password: Signal<string>;
	placeholder: string;
	minLength: number;
}
export const PasswordInput = component$(
	({ password, placeholder, minLength }: PasswordInputProps) => {
		const showPassword = useSignal(false);
		const t = inlineTranslate();
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
				<div class="validator-hint hidden">
					{t("app.auth.password_placeholder@@Enter your password")}
				</div>
			</div>
		);
	},
);
