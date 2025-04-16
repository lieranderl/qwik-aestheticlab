import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import {
	HiArrowLeftOutline,
	HiArrowRightOutline,
	HiCalendarOutline,
} from "@qwikest/icons/heroicons";
import { DateTime } from "luxon";
import { inlineTranslate } from "qwik-speak";
import { formatDate } from "~/consts";

const today = DateTime.now().toISODate();

export interface DateSelectorProps {
	selectedDateSignal: Signal<string>;
}

export const DateSelector = component$<DateSelectorProps>(
	({ selectedDateSignal }) => {
		const t = inlineTranslate();
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
								: t("app.booking.date_selector@@Pick a date")
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
						onChange$={(_, v) => {
							selectedDateSignal.value = v.value;
							document.getElementById("cally-popover1")?.hidePopover();
						}}
					>
						<div slot="previous">
							<HiArrowLeftOutline aria-label="Previous" class="size-4" />
						</div>
						<div slot="next">
							<HiArrowRightOutline aria-label="Next" class="size-4" />
						</div>

						<calendar-month />
					</calendar-date>
				</div>
			</div>
		);
	},
);
