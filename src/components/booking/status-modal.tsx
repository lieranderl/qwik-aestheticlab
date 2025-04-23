import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { HiXCircleOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate, localizePath, useSpeakLocale } from "qwik-speak";

export interface StatusModalProps {
	action: ActionStore<
		{
			success: boolean;
		},
		Record<string, unknown>,
		true
	>;
}

export const StatusModal = component$<StatusModalProps>(({ action }) => {
	const getPath = localizePath();
	const locale = useSpeakLocale();
	const homePath = getPath("/", locale.lang);
	const t = inlineTranslate();
	return (
		<dialog id="confirmation_modal" class="modal">
			<div class="modal-box ">
				{action.isRunning && (
					<div class="flex w-full justify-center">
						<span class="loading loading-dots loading-xl text-primary " />
					</div>
				)}
				{!action.isRunning && (
					<div class="rounded-lg max-w-md w-full p-6 relative">
						<div class="text-left">
							{action.value?.success && (
								<div class="mb-4">
									<div
										role="alert"
										class="alert alert-success alert-soft text-xl"
									>
										<HiXCircleOutline />
										<span class=" font-sans">
											{t(
												"app.booking.success@@Your appointment has been booked successfully.",
											)}
										</span>
									</div>

									<p class="text-success mt-2">
										{t(
											"app.booking.success_message@@Your appointment has been booked successfully. We look forward to seeing you!",
										)}
									</p>
								</div>
							)}
							{action.value && !action.value.success && (
								<div class="mb-4">
									<div
										role="alert"
										class="alert alert-error alert-soft text-xl"
									>
										<HiXCircleOutline />
										<span class=" font-sans">
											{t(
												"app.booking.error@@An error occurred while booking your appointment.",
											)}
										</span>
									</div>

									<p class="text-error mt-2">
										{t(
											"app.booking.error_message@@An error occurred while booking your appointment. Please try again.",
										)}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				<div class="modal-action">
					<form method="dialog">
						<button
							class="btn btn-secondary"
							type="submit"
							onClick$={() => {
								// showStatusModal.value = false;
								if (action.value?.success) {
									window.location.href = homePath;
								}
							}}
						>
							{action.value?.success
								? t("app.booking.return_home@@Return to Home")
								: t("app.booking.close@@Close")}
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
});
