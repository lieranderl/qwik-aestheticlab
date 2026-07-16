import type { PropFunction } from "@builder.io/qwik";
import { $, component$, useId, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "./booking-modal";
import { FadeUp } from "./fade-up";

type ServiceImageComponent =
	typeof import("~/media/gallery/universal.jpg?jsx").default;

const GALLERY_IMAGES = import.meta.glob("../../media/gallery/*.jpg", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, ServiceImageComponent>;

const SERVICE_IMAGES = import.meta.glob("../../media/services/*.webp", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, ServiceImageComponent>;

const IMAGE_COMPONENTS = new Map<string, ServiceImageComponent>([
	...Object.entries(GALLERY_IMAGES).map(
		([path, component]) =>
			[`gallery:${path.split("/").at(-1)}`, component] as const,
	),
	...Object.entries(SERVICE_IMAGES).map(
		([path, component]) =>
			[`service:${path.split("/").at(-1)}`, component] as const,
	),
]);

function resolveImageComponent(image: string) {
	return IMAGE_COMPONENTS.get(image) ?? null;
}

export interface ServiceCardProps {
	title: string;
	description: string;
	price?: string;
	image: string;
	delay?: number;
	serviceId: string;
	location: string;
	customAction$?: PropFunction<() => void>;
	buttonLabel?: string;
	showBooking?: boolean;
	duration?: string | number;
	variant?: "category" | "service";
	supportingText?: string;
	analyticsPlacement?: string;
	analyticsServiceCategory?: string;
	eager?: boolean;
}

export const ServiceCard = component$<ServiceCardProps>(
	({
		title,
		description,
		price,
		image,
		delay = 0,
		serviceId,
		location,
		customAction$,
		buttonLabel,
		showBooking = true,
		duration,
		variant = "service",
		supportingText,
		analyticsPlacement,
		analyticsServiceCategory,
		eager = false,
	}) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const descriptionId = useId();
		const hasLongDescription = description.length > 140;
		const ImageComp = resolveImageComponent(image);
		const imageSizes =
			variant === "category"
				? "(min-width: 1280px) 19rem, (min-width: 1024px) calc(25vw - 1.5rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2rem)"
				: "(min-width: 1280px) 25rem, (min-width: 1024px) calc(33.333vw - 2rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2rem)";

		return (
			<FadeUp delay={delay} class="h-full">
				<article class="card surface-card h-full overflow-hidden transition-shadow duration-200 hover:shadow-lg">
					<figure
						class={[
							"group relative overflow-hidden bg-base-200",
							variant === "category"
								? "h-[9.5rem] md:h-auto md:aspect-5/4"
								: "h-[13rem] md:h-auto md:aspect-4/3",
						]}
					>
						{ImageComp ? (
							<ImageComp
								alt={title}
								class="interactive-media h-full w-full object-cover object-center"
								loading={eager ? "eager" : "lazy"}
								fetchPriority={eager ? "high" : "auto"}
								sizes={imageSizes}
							/>
						) : (
							<img
								src={image}
								alt={title}
								class="interactive-media h-full w-full object-cover object-center"
								width="400"
								height="500"
								loading={eager ? "eager" : "lazy"}
								fetchPriority={eager ? "high" : "auto"}
							/>
						)}
						<div class="absolute inset-0 bg-linear-to-t from-base-content/75 via-base-content/10 to-transparent" />
						<div class="absolute top-3 right-3 left-3 flex flex-wrap items-start justify-between gap-2 md:top-4 md:right-4 md:left-4">
							{supportingText ? (
								<span class="badge badge-neutral badge-xs rounded-full border-none font-montserrat uppercase tracking-wider shadow-sm md:badge-sm">
									{supportingText}
								</span>
							) : null}
						</div>
					</figure>

					<div class="card-body gap-3 p-4 md:gap-4 md:p-6">
						<div class="space-y-2.5 md:space-y-3">
							<h3 class="text-balance font-qestero text-2xl leading-none text-base-content md:text-3xl">
								{title.charAt(0).toUpperCase() + title.slice(1)}
							</h3>
							<p
								id={descriptionId}
								class={[
									"text-pretty font-montserrat text-sm leading-relaxed text-base-content/80",
									variant === "category"
										? "line-clamp-2 md:line-clamp-none"
										: isExpanded.value
											? ""
											: "line-clamp-3 md:line-clamp-4",
								]}
							>
								{description}
							</p>
							{variant === "service" && hasLongDescription ? (
								<button
									type="button"
									onClick$={$(() => {
										isExpanded.value = !isExpanded.value;
									})}
									class="btn btn-ghost btn-sm min-h-11 w-fit rounded-full px-0 font-montserrat uppercase tracking-wider text-primary"
									aria-expanded={isExpanded.value}
									aria-controls={descriptionId}
								>
									{isExpanded.value
										? t("app.common.read_less@@Read Less")
										: t("app.common.read_more@@Read More")}
								</button>
							) : null}
						</div>

						{variant === "category" ? (
							<div class="mt-auto min-h-6">
								{price ? (
									<span class="badge badge-accent badge-outline rounded-full font-montserrat">
										{price}
									</span>
								) : null}
							</div>
						) : null}

						<div
							class={[
								"card-actions items-center gap-2 border-t border-base-300 pt-3 md:gap-3 md:pt-4",
								variant === "service"
									? "mt-auto justify-between"
									: "justify-stretch",
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
										"btn btn-sm h-11 min-h-11 w-full max-w-full whitespace-nowrap rounded-full px-4 font-montserrat text-xs uppercase tracking-[0.08em]",
										variant === "category"
											? "btn-primary"
											: "btn-outline btn-primary",
									]}
								>
									{buttonLabel || t("app.generic.view@@View")}
								</button>
							) : showBooking ? (
								<Booking
									id={`modal_service_${serviceId}`}
									text={t("app.book.book_now@@Book Now")}
									location={location}
									classes="btn btn-sm btn-outline btn-primary min-h-11 rounded-full font-montserrat uppercase tracking-wider"
									analyticsPlacement={analyticsPlacement || "service_card"}
									analyticsServiceId={serviceId}
									analyticsServiceName={title}
									analyticsServiceCategory={analyticsServiceCategory}
								/>
							) : null}
						</div>
					</div>
				</article>
			</FadeUp>
		);
	},
);
