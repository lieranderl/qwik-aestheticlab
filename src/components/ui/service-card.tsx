import type { PropFunction } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "./booking-modal";
import { FadeUp } from "./fade-up";

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
	}) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);

		return (
			<FadeUp delay={delay} class="h-full">
				<div
					class="group relative h-[400px] w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl cursor-pointer bg-neutral-900"
					onClick$={() => {
						isExpanded.value = !isExpanded.value;
					}}
				>
					{/* Background Image */}
					<div class="absolute inset-0 w-full h-full">
						<img
							src={image}
							alt={title}
							class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							width="400"
							height="500"
						/>
						{/* Gradient Overlay */}
						<div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black group-hover:via-black/50" />
					</div>

					{/* Content Layer */}
					<div class="absolute inset-0 flex flex-col justify-end p-8 text-white pt-24">
						<h3 class="font-qestero text-3xl tracking-wide shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-1 mb-2">
							{title.charAt(0).toUpperCase() + title.slice(1)}
						</h3>

						{/* Scrollable Description Area */}
						<div
							class="group/text relative max-h-[240px] overflow-hidden transition-all duration-300 pr-1"
							onClick$={(e) => {
								e.stopPropagation();
								if (!isExpanded.value) {
									isExpanded.value = true;
								}
							}}
						>
							<p
								class={`font-montserrat mb-4 text-sm opacity-90 transition-all duration-300 ${
									isExpanded.value
										? "line-clamp-none overflow-y-auto max-h-[160px] cursor-text"
										: "line-clamp-3 cursor-pointer"
								}`}
							>
								{description}
							</p>
						</div>

						<div class="flex items-center justify-between border-t border-white/20 pt-4 mt-auto w-full">
							{price && (
								<div class="flex flex-col">
									<span class="font-montserrat text-lg font-medium">
										{price}
									</span>
									{duration && (
										<span class="font-montserrat text-xs opacity-75">
											{duration} {t("app.services.minutes@@min")}
										</span>
									)}
								</div>
							)}
							{customAction$ ? (
								<button
									type="button"
									onClick$={(e) => {
										e.stopPropagation();
										customAction$();
									}}
									class="btn btn-sm btn-ghost border border-white/30 bg-white/10 text-white rounded-full hover:bg-white hover:text-primary hover:border-white font-montserrat uppercase tracking-wider text-xs"
								>
									{buttonLabel || t("app.generic.view@@View")}
								</button>
							) : showBooking ? (
								<Booking
									id={`modal_service_${serviceId}`}
									text={t("app.book.book_now@@Book Now")}
									location={location}
									classes="btn btn-sm btn-ghost border border-white/30 bg-white/10 text-white rounded-full hover:bg-white hover:text-primary hover:border-white font-montserrat uppercase tracking-wider text-xs"
								/>
							) : null}
						</div>
					</div>
				</div>
			</FadeUp>
		);
	},
);
