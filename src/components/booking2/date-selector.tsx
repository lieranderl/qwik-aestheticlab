import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import {
  HiArrowLeftOutline,
  HiArrowRightOutline,
  HiCalendarOutline,
} from "@qwikest/icons/heroicons";

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
            // style="anchor-name:--cally1"
            id="cally1"
            bind:value={selectedDateSignal}
            placeholder="Pick a date"
          />
        </label>
        <input
          hidden
          name="selectedDate"
          type="date"
          bind:value={selectedDateSignal}
        />

        <div
          popover="auto"
          id="cally-popover1"
          class="dropdown bg-base-100 rounded-box shadow-lg"
          style="position-anchor:--cally1"
        >
          <calendar-date
            class="cally"
            // onchange={(document.getElementById("cally1").innerText = this.value)}
            onChange$={(e, v) => {
              selectedDateSignal.value = v.value;
            }}
          >
            <HiArrowLeftOutline
              aria-label="Previous"
              class="size-4"
              slot="previous"
            />
            <HiArrowRightOutline aria-label="Next" class="size-4" slot="next" />

            <calendar-month />
          </calendar-date>
        </div>
      </div>
    );
  }
);
