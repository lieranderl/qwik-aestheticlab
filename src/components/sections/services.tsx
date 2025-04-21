import { component$ } from "@builder.io/qwik";
import type { Service } from "~/types";
import { formatPrice } from "~/consts";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";

export interface ServicesSectionProps {
	services: Service[];
}

export const ServicesSection = component$(
	({ services }: ServicesSectionProps) => {
		const t = inlineTranslate();
		const local = useSpeakLocale();
		const shortlang = local.lang.split("-")[0];
		return (
			<section id="services" class="py-20 bg-base-200">
				<div class="custom-container">
					<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
						{t("app.services.title@@Our Services")}
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						{services.map((service: Service) => (
							<div
								key={service.id}
								class="p-4 rounded-lg bg-base-100"
								data-aos="fade-up"
							>
								<div class="collapse collapse-arrow ">
									<input type="checkbox" />
									<div class="collapse-title ">
										<div class="flex justify-between items-center mb-4">
											{shortlang === "en" && (
												<h3 class="text-lg md:text-xl ">{service.name}</h3>
											)}{" "}
											{shortlang === "ru" && (
												<h3 class="text-lg md:text-xl ">{service.name_ru}</h3>
											)}
											{shortlang === "nl" && (
												<h3 class="text-lg md:text-xl ">{service.name_nl}</h3>
											)}{" "}
											{shortlang === "fr" && (
												<h3 class="text-lg md:text-xl ">{service.name_fr}</h3>
											)}{" "}
											<div class=" font-semibold ">
												{formatPrice(service.price)}
											</div>
										</div>
									</div>
									<div class="collapse-content text-sm">
										{service.description}
									</div>
								</div>
								<div class="text-sm font-inter text-end me-4">
									{t("app.services.duration@@Duration:")} {service.duration}{" "}
									{t("app.services.minutes@@minutes")}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	},
);
