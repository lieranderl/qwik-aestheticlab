import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import {
  // HiArrowLeftOutline,
  // HiArrowRightOutline,
  HiCalendarOutline,
} from "@qwikest/icons/heroicons";
import { DateTime } from "luxon";
import { formatDate } from "~/consts";

const today = DateTime.now().toISODate()

export interface DateSelectorProps {
  selectedDateSignal: Signal<string>;
}

export const DateSelector = component$<DateSelectorProps>(
  ({ selectedDateSignal }) => {
    return (
      <div>
        <label class="input input-primary">
          <HiCalendarOutline class="text-primary w-4 h-4" />
          <input
            type="button"
            popovertarget="cally-popover1"
            id="cally1"
            value={
              selectedDateSignal.value !== "Pick a date"
                ? formatDate(selectedDateSignal.value)
                : "Pick a date"
            }
          />
        </label>
        <div
          popover="auto"
          id="cally-popover1"
          class="dropdown bg-base-100 rounded-box shadow-lg"
          style="position-anchor:--cally1"
        >
          <calendar-date
            showOutsideDays={true}
            min={today}
            class="cally"
            onChange$={(e, v) => {
              selectedDateSignal.value = v.value;
              document.getElementById("cally-popover1")?.hidePopover();
            }}
          >
            {/* <HiArrowLeftOutline
              aria-label="Previous"
              class="size-4"
              slot="previous"
            />
            <HiArrowRightOutline aria-label="Next" class="size-4" slot="next" /> */}

            <calendar-month />
          </calendar-date>
        </div>
      </div>
    );
  }
);
