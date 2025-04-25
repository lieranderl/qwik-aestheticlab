import type { Signal } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import {
	HiArrowUpOnSquareOutline,
	HiEnvelopeOutline,
} from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";

export interface EmailInputProps {
	emailSignal: Signal<string>;
	readonly?: boolean;
	signOut?: ActionStore<
		{
			success: boolean;
		},
		Record<string, unknown>,
		true
	>;
}
export const EmailInput = ({
	emailSignal,
	readonly,
	signOut,
}: EmailInputProps) => {
	const t = inlineTranslate();
	return (
		<div>
			<div class="flex flex-nowrap gap-2 items-center">
				<label
					class={
						readonly
							? "input input-primary validator w-full gap-2 pointer-events-none select-none"
							: "input input-primary validator w-full gap-2"
					}
				>
					<HiEnvelopeOutline class="text-primary w-4 h-4" />
					<input
						name="email"
						type="email"
						placeholder={t(
							"app.auth.email_placeholder@@Enter your email address",
						)}
						pattern="[a-z0-9._%+\-]+@[a-z0-9\-]+\.[a-z]{2,}$"
						required
						bind:value={emailSignal}
						readOnly={readonly}
					/>
				</label>
				{signOut && (
					<button
						type="button"
						class="btn btn-primary min-w-16"
						disabled={signOut.isRunning}
						onClick$={() => signOut.submit()}
					>
						{signOut.isRunning ? (
							<span class="loading loading-spinner me-2 loading-md" />
						) : (
							<>
								<HiArrowUpOnSquareOutline class="w-4 h-4 rotate-90" />
								<span class="hidden sm:block">
									{t("app.auth.signout@@Sign out")}
								</span>
							</>
						)}
					</button>
				)}
			</div>
			<div class="validator-hint hidden">
				{t("app.auth.email_hint@@Please enter a valid email address")}
			</div>
		</div>
	);
};
