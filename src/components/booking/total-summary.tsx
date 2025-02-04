import { component$ } from "@builder.io/qwik";
import { formatPrice } from "~/consts";

export interface TotalSummaryProps {
  selectedServices: string[];
  totalDuration: number;
  totalPrice: number;
}
export const TotalSummary = component$<TotalSummaryProps>(
  ({ selectedServices, totalDuration, totalPrice }) => {
    return (
      <>
        {selectedServices.length > 0 && (
          <div class="alert alert-info alert-soft flex justify-between">
            <div>
              <p class="font-semibold">Total Duration:</p>
              <p>{totalDuration} minutes</p>
            </div>
            <div>
              <p class="font-semibold">Total Price:</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            <input name="duration" type="hidden" value={totalDuration} />
          </div>
        )}
      </>
    );
  }
);
