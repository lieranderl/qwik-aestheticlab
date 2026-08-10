import type { PropFunction } from "@builder.io/qwik";
import { component$, useId } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { bookingLocationId } from "~/consts";
import { resolveImageComponent } from "~/shared/image-resolver";
import { Booking } from "./booking-modal";
import { ExpandableText } from "./expandable-text";

export interface ServiceCardProps {
	title: string;
	description: string;
	price?: string;
	image: string;
	serviceId: string;
	location?: string;
	customAction$?: PropFunction<() => void>;
	buttonLabel?: string;
	showBooking?: boolean;
	duration?: string | number;
	variant?: "category" | "service";
	supportingText?: string;
	analyticsPlacement?: string;
	analyticsServiceCategory?: string;
	eager?: boolean;
	emphasis?: "lead" | "standard" | "compact";
}

export const ServiceCard = component$<ServiceCardProps>(
	({
		title,
		description,
		price,
		image,
		serviceId,
		location = bookingLocationId,
		customAction$,
		buttonLabel,
		showBooking = true,
		duration,
		variant = "service",
		supportingText,
		analyticsPlacement,
		analyticsServiceCategory,
		eager = false,
		emphasis = "standard",
	}) => {
		const t = inlineTranslate();
		const descriptionId = useId();
		const ImageComp = resolveImageComponent(image);
		const imageSizes =
			variant === "category"
				? "(min-width: 1280px) 19rem, (min-width: 1024px) calc(25vw - 1.5rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2rem)"
				: "(min-width: 1280px) 25rem, (min-width: 1024px) calc(33.333vw - 2rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2rem)";

		return (
			<article
				class={[
					"group card card-border h-full overflow-hidden bg-base-100 transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg",
					variant === "category" && emphasis === "lead"
						? "lg:grid lg:grid-rows-[minmax(0,1fr)_auto]"
						: "",
				]}
			>
				<figure
					class={[
						"group relative overflow-hidden bg-base-200",
						variant === "category"
							? emphasis === "lead"
								? "h-56 md:h-64 lg:h-80"
								: emphasis === "compact"
									? "h-44 md:h-48"
									: "h-56 md:h-64 lg:h-72"
							: "h-[13rem] md:h-auto md:aspect-4/3",
					]}
				>
					{ImageComp ? (
						<ImageComp
							alt={title}
							class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
							loading={eager ? "eager" : "lazy"}
							fetchPriority={eager ? "high" : "auto"}
							sizes={imageSizes}
						/>
					) : (
						<img
							src={image}
							alt={title}
							class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
							width="400"
							height="500"
							loading={eager ? "eager" : "lazy"}
							fetchPriority={eager ? "high" : "auto"}
						/>
					)}
					<div class="absolute inset-0 bg-linear-to-t from-base-content/60 via-base-content/15 to-transparent" />
					<div class="absolute top-3 right-3 left-3 flex flex-wrap items-start justify-between gap-2 md:top-4 md:right-4 md:left-4">
						{supportingText ? (
							<span class="badge badge-neutral badge-sm hidden border-none font-main uppercase tracking-wider shadow-sm md:inline-flex">
								{supportingText}
							</span>
						) : null}
					</div>
				</figure>

				<div
					class={[
						"card-body min-w-0 gap-4 p-5 md:gap-5 md:p-6",
						variant === "category" && emphasis === "compact" ? "lg:p-5" : "",
					]}
				>
					<div class="space-y-2.5 md:space-y-3">
						<h3
							class={[
								"text-balance font-cormorant leading-none text-base-content",
								variant === "category" && emphasis === "lead"
									? "text-3xl md:text-4xl"
									: "text-2xl md:text-3xl",
							]}
						>
							{title.charAt(0).toUpperCase() + title.slice(1)}
						</h3>
						{variant === "category" ? (
							<p
								id={descriptionId}
								class="text-pretty font-main text-sm leading-relaxed text-base-content/80 line-clamp-3 md:line-clamp-none"
							>
								{description}
							</p>
						) : (
							<ExpandableText text={description} />
						)}
					</div>

					{variant === "category" ? (
						<div class="mt-auto min-h-6">
							{price ? (
								<span class="badge badge-soft badge-sm font-main">{price}</span>
							) : null}
						</div>
					) : null}

					<div
						class={[
							"card-actions items-center gap-2 border-t border-base-300 pt-4 md:gap-3 md:pt-5",
							variant === "service"
								? "mt-auto justify-between"
								: "justify-stretch",
						]}
					>
						{variant === "service" ? (
							<div class="flex flex-wrap gap-2">
								{price ? (
									<span class="badge badge-secondary badge-outline rounded-full font-main">
										{price}
									</span>
								) : null}
								{duration ? (
									<span class="badge badge-outline rounded-full border-base-300 font-main">
										{duration}&nbsp;{t("app.services.minutes@@min")}
									</span>
								) : null}
							</div>
						) : null}
						{customAction$ ? (
							<button
								type="button"
								onClick$={customAction$}
								class={[
									"btn btn-sm h-11 min-h-11 w-full max-w-full whitespace-nowrap px-4 font-main text-xs font-semibold uppercase tracking-[0.08em]",
									variant === "category" ? "" : "btn-outline",
								]}
							>
								{buttonLabel || t("app.generic.view@@View")}
							</button>
						) : showBooking ? (
							<Booking
								id={`modal_service_${serviceId}`}
								text={t("app.book.book_now@@Book Now")}
								location={location}
								classes="btn btn-sm btn-outline min-h-11 font-main uppercase tracking-wider"
								analyticsPlacement={analyticsPlacement || "service_card"}
								analyticsServiceId={serviceId}
								analyticsServiceName={title}
								analyticsServiceCategory={analyticsServiceCategory}
							/>
						) : null}
					</div>
				</div>
			</article>
		);
	},
);
