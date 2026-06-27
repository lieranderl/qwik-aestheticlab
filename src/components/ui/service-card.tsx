import type { PropFunction } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
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

function resolveImageComponent(image: string) {
	if (image.startsWith("gallery:")) {
		const imageName = image.slice("gallery:".length).replace(/\.jpg$/i, "");
		for (const path in GALLERY_IMAGES) {
			if (path.endsWith(`/${imageName}.jpg`)) {
				return GALLERY_IMAGES[path];
			}
		}
		return null;
	}

	if (image.startsWith("service:")) {
		const imageName = image.slice("service:".length).replace(/\.webp$/i, "");
		for (const path in SERVICE_IMAGES) {
			if (path.endsWith(`/${imageName}.webp`)) {
				return SERVICE_IMAGES[path];
			}
		}
	}

	return null;
}

interface ServiceCardProps {
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
		const hasLongDescription = description.length > 140;
		const ImageComp = resolveImageComponent(image);

		return (
			<FadeUp delay={delay} class="h-full">
				<article class="card h-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl">
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
								class="h-full w-full object-cover object-center transition-transform duration-700 ease-out md:group-hover:scale-[1.03]"
								loading={eager ? "eager" : "lazy"}
								fetchPriority={eager ? "high" : "auto"}
							/>
						) : (
							<img
								src={image}
								alt={title}
								class="h-full w-full object-cover object-center transition-transform duration-700 ease-out md:group-hover:scale-[1.03]"
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
							<h3 class="font-qestero text-[1.35rem] sm:text-[1.55rem] lg:text-[1.75rem] xl:text-[2rem] leading-none text-base-content">
								{title.charAt(0).toUpperCase() + title.slice(1)}
							</h3>
							<p
								class={[
									"font-montserrat text-[0.82rem] leading-relaxed text-base-content/80 md:text-sm",
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
									class="btn btn-ghost btn-xs w-fit rounded-full px-0 font-montserrat uppercase tracking-wider text-primary"
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
									<span class="badge badge-accent badge-outline rounded-full font-montserrat">
										{price}
									</span>
								</div>
							) : null
						) : null}

						<div
							class={[
								"card-actions mt-auto items-center gap-2 border-t border-base-300 pt-3 md:gap-3 md:pt-4",
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
											{duration}&nbsp;{t("app.services.minutes@@min")}
										</span>
									) : null}
								</div>
							) : null}
							{customAction$ ? (
								<button
									type="button"
									onClick$={$(() => {
										customAction$();
									})}
									class={[
										"btn w-full max-w-full rounded-full font-montserrat text-xs uppercase tracking-[0.12em] md:text-sm",
										variant === "category"
											? "btn-primary min-h-10 px-5 py-2 leading-tight md:min-h-14 md:px-6 md:py-3"
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
