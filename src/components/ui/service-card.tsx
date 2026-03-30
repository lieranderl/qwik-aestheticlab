import type { PropFunction } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "./booking-modal";
import { FadeUp } from "./fade-up";

interface ServiceCardProps {
	title: string;
	description: string;
	price?: string;
	// biome-ignore lint/suspicious/noExplicitAny: Generic component prop
	image: any;
	delay?: number;
	serviceId: string;
	location: string;
	customAction$?: PropFunction<() => void>;
	buttonLabel?: string;
	showBooking?: boolean;
	duration?: string | number;
	variant?: "category" | "service";
	supportingText?: string;
}

export const ServiceCard = component$<ServiceCardProps>(
	({
		title,
		description,
		price,
		image: ImageComp,
		delay = 0,
		serviceId,
		location,
		customAction$,
		buttonLabel,
		showBooking = true,
		duration,
		variant = "service",
		supportingText,
	}) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const hasLongDescription = description.length > 140;

		return (
			<FadeUp delay={delay} class="h-full">
				<div class="card rounded-2xl h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<figure
						class={[
							"group relative overflow-hidden bg-base-200",
							variant === "category" ? "aspect-[5/4]" : "aspect-[4/3]",
						]}
					>
						{typeof ImageComp === "string" ? (
							<img
								src={ImageComp}
								alt={title}
								class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								width="400"
								height="500"
							/>
						) : (
							<ImageComp
								alt={title}
								class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							/>
						)}
						<div class="absolute inset-0 bg-linear-to-t from-base-content/75 via-base-content/10 to-transparent" />
						<div class="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-2">
							{supportingText ? (
								<span class="badge badge-neutral badge-sm rounded-full border-none font-montserrat uppercase tracking-wider">
									{supportingText}
								</span>
							) : null}
						</div>
					</figure>

					<div class="card-body gap-4 p-6">
						<div class="space-y-3">
							<h3 class="font-qestero text-2xl text-base-content md:text-[2rem]">
								{title.charAt(0).toUpperCase() + title.slice(1)}
							</h3>
							<p
								class={[
									"font-montserrat text-sm leading-relaxed text-base-content/80",
									variant === "category" || isExpanded.value
										? ""
										: "line-clamp-4",
								]}
							>
								{description}
							</p>
							{variant === "service" && hasLongDescription ? (
								<button
									type="button"
									onClick$={() => {
										isExpanded.value = !isExpanded.value;
									}}
									class="btn btn-ghost btn-xs rounded-full w-fit px-0 font-montserrat uppercase tracking-wider text-primary"
									aria-expanded={isExpanded.value}
								>
									{isExpanded.value
										? t("app.common.read_less@@Read Less")
										: t("app.common.read_more@@Read More")}
								</button>
							) : null}
						</div>

						{variant === "category" ? (
							price ? (
								<div>
									<span class="badge badge-primary badge-outline rounded-full font-montserrat">
										{price}
									</span>
								</div>
							) : null
						) : null}

						<div
							class={[
								"card-actions mt-auto items-center gap-3 border-t border-base-300 pt-4",
								variant === "service" ? "justify-between" : "justify-stretch",
							]}
						>
							{variant === "service" ? (
								<div class="flex flex-wrap gap-2">
									{price ? (
										<span class="badge badge-primary badge-outline rounded-full font-montserrat">
											{price}
										</span>
									) : null}
									{duration ? (
										<span class="badge badge-outline rounded-full border-base-300 font-montserrat">
											{duration} {t("app.services.minutes@@min")}
										</span>
									) : null}
								</div>
							) : null}
							{customAction$ ? (
								<button
									type="button"
									onClick$={() => {
										customAction$();
									}}
									class={[
										"btn rounded-full w-full max-w-full font-montserrat uppercase tracking-[0.12em] text-sm",
										variant === "category"
											? "btn-primary min-h-14 px-6 py-3 leading-tight"
											: "btn-sm btn-outline btn-primary",
									]}
								>
									{buttonLabel || t("app.generic.view@@View")}
								</button>
							) : showBooking ? (
								<Booking
									id={`modal_service_${serviceId}`}
									text={t("app.book.book_now@@Book Now")}
									location={location}
									classes="btn btn-sm btn-outline btn-primary rounded-full font-montserrat uppercase tracking-wider"
								/>
							) : null}
						</div>
					</div>
				</div>
			</FadeUp>
		);
	},
);
