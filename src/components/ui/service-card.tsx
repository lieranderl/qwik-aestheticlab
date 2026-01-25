import type { PropFunction } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";

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
			<FadeUp
				delay={delay}
				class="group relative h-[400px] w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-md cursor-pointer"
				onClick$={() => {
					isExpanded.value = !isExpanded.value;
				}}
			>
				{/* Background Image with Zoom Effect */}
				<div class="absolute inset-0 overflow-hidden rounded-2xl">
					<img
						src={image}
						alt={title}
						class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
						width="400"
						height="500"
					/>
					{/* Soft Overlay - Removed as the content container now has the gradient */}
					{/* <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" /> */}
				</div>

				{/* Content Content - Bottom Aligned */}
				<div class="absolute bottom-0 left-0 right-0 top-0 pt-20 px-6 pb-6 text-white backdrop-blur-[0px] transition-all duration-500 ease-out flex flex-col justify-end bg-linear-to-t from-black/96 via-black/40 to-transparent group-hover:from-black group-hover:via-black/60">
					<h3 class="font-qestero pb-2 text-3xl tracking-wide shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-1">
						{title.charAt(0).toUpperCase() + title.slice(1)}
					</h3>

					{/* Scrollable Description Area */}
					<div class="group/text relative max-h-[240px] overflow-hidden transition-all duration-300 pr-1">
						<p
							class={`font-montserrat mb-3 text-sm opacity-90 transition-all duration-300 ${
								isExpanded.value
									? "line-clamp-none overflow-y-auto max-h-[200px]"
									: "line-clamp-3"
							}`}
						>
							{description}
						</p>
					</div>

					<div class="flex items-center justify-between border-t border-white/30 pt-3">
						{price && (
							<div class="flex flex-col">
								<span class="font-montserrat text-lg font-medium">{price}</span>
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
								class="rounded-full bg-white/20 px-4 py-1.5 text-xs uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white hover:text-primary"
							>
								{buttonLabel || t("app.generic.view@@View")}
							</button>
						) : showBooking ? (
							<Booking
								id={`modal_service_${serviceId}`}
								text={t("app.book.book_now@@Book Now")}
								location={location}
								// category={categoryId}
								// product={
								//   bookingProductId !== undefined
								//     ? bookingProductId
								//     : `${serviceId}:SV`
								// }
								classes="rounded-full bg-white/20 px-4 py-1.5 text-xs uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white hover:text-primary"
							/>
						) : null}
					</div>
				</div>
			</FadeUp>
		);
	},
);
