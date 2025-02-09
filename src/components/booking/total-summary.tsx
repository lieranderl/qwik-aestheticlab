import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { formatPrice } from "~/consts";

export interface TotalSummaryProps {
  selectedServicesNames: string[];
  selectedServices: string[];
  totalDuration: number;
  totalPrice: number;
}
export const TotalSummary = component$<TotalSummaryProps>(
  ({ selectedServicesNames, selectedServices, totalDuration, totalPrice }) => {
    const scaled = useSignal(false);

    useTask$(({ track }) => {
      track(() => totalPrice);
      setTimeout(() => {
        scaled.value = false;
      }, 300);
      scaled.value = true;
    });

    return (
      <>
        {selectedServices.length > 0 && (
          <div class="alert alert-info flex-col alert-soft flex justify-between">
            <div>
              <p class="font-semibold text-center">Selected Services:</p>
              <p>{selectedServicesNames.join(", ")}</p>
            </div>
            <div class="flex justify-between w-full">
              <div>
                <p class="font-semibold">Total Duration:</p>
                <p>{totalDuration} minutes</p>
              </div>
              <div>
                <p class="font-semibold">Total Price:</p>
                <p
                  class={{
                    "transition-transform transform duration-200 ease-in-out text-center font-semibold":
                      true,
                    "scale-110 font-bold": scaled.value,
                    "scale-100": !scaled.value,
                  }}
                >
                  {formatPrice(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
