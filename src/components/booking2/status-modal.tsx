import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";

export interface StatusModalProps {
  action: ActionStore<
    {
      success: boolean;
    },
    Record<string, unknown>,
    true
  >;
}

export default component$<StatusModalProps>(({ action }) => {
  // if (!isOpen) return null;

  return (
    <dialog id="confirmation_modal" class="modal">
      <div class="modal-box flex items-center justify-center min-h-[200px]">
        {action.isRunning && (
          <span class="loading loading-spinner loading-lg loading-primary" />
        )}
        {!action.isRunning && (
          <div class="rounded-lg max-w-md w-full p-6 relative">
            <div class="text-center">
              {action.value?.success ? (
                <div class="mb-4">
                  <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success">
                    <svg
                      class="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 class="text-xl font-sans text-success mt-4">
                    Booking Successful!
                  </h3>
                  <p class="mt-2">
                    Your appointment has been confirmed. We look forward to
                    seeing you!
                  </p>
                </div>
              ) : (
                <div class="mb-4">
                  <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error">
                    <svg
                      class="h-6 w-6 text-error"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 class="text-xl font-sans text-error mt-4">
                    Booking Failed
                  </h3>
                  <p class="text-error mt-2">
                    "An error occurred while booking your appointment. Please
                    try again."
                  </p>
                </div>
              )}

              {/* <button
                onClick$={() => {
                  showStatusModal.value = false;
                  if (bookingStatus.value === "success") {
                    location.assign("/");
                  }
                }}
                class="w-full bg-sage-600 text-white px-6 py-2 rounded-full hover:bg-sage-700 transition-colors"
              >
                {status === "success" ? "Return to Home" : "Close"}
              </button> */}
            </div>
          </div>
        )}

        <div class="modal-action">
          <form method="dialog">
            <button class="btn" type="submit" onClick$={() => {
                  // showStatusModal.value = false;
                  if (action.value?.success) {
                    location.assign("/");
                  }
                }}>
              {action.value?.success ? "Return to Home" : "Close"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});
