import { $, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import type { Staff } from "~/types";

type TeamImageComponent = typeof import("~/media/zara.jpg?jsx").default;

const TEAM_IMAGES = import.meta.glob("../../media/*.jpg", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, TeamImageComponent>;

function resolveImageComponent(image: string) {
	if (!image) return null;
	const imageName = image.replace(/\.jpg$/i, "");
	for (const path in TEAM_IMAGES) {
		if (path.endsWith(`/${imageName}.jpg`)) {
			return TEAM_IMAGES[path];
		}
	}
	return null;
}

interface TeamSectionProps {
	technicians: Staff[];
}

export const TeamSection = component$<TeamSectionProps>(({ technicians }) => {
	const t = inlineTranslate();

	return (
		<section
			id="team"
			class="relative overflow-hidden bg-base-200 py-16 md:py-24"
		>
			<div class="custom-container">
				<FadeUp class="mb-9 grid gap-5 text-center md:mb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:text-left">
					<div>
						<p class="editorial-kicker mb-4">
							{t("app.team.kicker@@Studio artists")}
						</p>
						<h2 class="font-qestero text-4xl text-base-content md:text-5xl">
							{t("app.team.title@@Meet Our Team")}
						</h2>
					</div>
					<div class="editorial-rule mx-auto w-20 lg:mx-0 lg:w-full" />
				</FadeUp>

				<div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
					{technicians.map((tech, index) => (
						<FadeUp key={tech.id} delay={index * 150} class="group h-full">
							<TeamMemberCard tech={tech} />
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
});

interface TeamMemberCardProps {
	tech: Staff;
}

function getBioForLang(lang: string, tech: Staff) {
	if (lang.includes("nl")) return tech.about_nl || tech.about;
	if (lang.includes("fr")) return tech.about_fr || tech.about;
	if (lang.includes("ru")) return tech.about_ru || tech.about;
	if (lang.includes("uk")) return tech.about_uk || tech.about;
	return tech.about;
}

export const TeamMemberCard = component$<TeamMemberCardProps>(({ tech }) => {
	const t = inlineTranslate();
	const loc = useLocation();
	const lang = loc.params.lang || "en-BE";
	const isExpanded = useSignal(false);
	const ImageComp = resolveImageComponent(tech.photo_url);

	return (
		<article class="flex h-full flex-col rounded-2xl border border-white/50 bg-base-100/90 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-6">
			<div class="mx-auto mb-4 h-32 w-32 shrink-0 overflow-hidden rounded-full border border-base-300 bg-base-200 transition-transform duration-500 group-hover:border-primary/30 md:mb-6 md:aspect-4/5 md:h-auto md:w-full md:rounded-t-full md:rounded-b-2xl">
				{ImageComp ? (
					<ImageComp
						alt={tech.name}
						class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						loading="lazy"
					/>
				) : (
					tech.photo_url && (
						<img
							src={tech.photo_url}
							alt={tech.name}
							width={640}
							height={800}
							class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
							loading="lazy"
						/>
					)
				)}
			</div>

			<h3 class="font-qestero mb-1 text-[1.65rem] leading-none md:text-3xl">
				{tech.name}
			</h3>
			<p class="font-montserrat mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-primary md:mb-5">
				{tech.role || t("app.team.role.technician@@Technician")}
			</p>

			{/* Bio Description */}
			<div class="mb-4 flex grow flex-col md:mb-6">
				<div
					class={[
						"font-montserrat relative text-[0.82rem] leading-relaxed transition-all duration-300 md:text-sm",
						isExpanded.value
							? "max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
							: "line-clamp-3 md:line-clamp-4",
					]}
				>
					{getBioForLang(lang, tech)}
				</div>
				<button
					type="button"
					onClick$={$(() => {
						isExpanded.value = !isExpanded.value;
					})}
					class="font-montserrat mt-3 w-fit text-xs uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
				>
					{isExpanded.value
						? t("app.common.read_less@@Read Less")
						: t("app.common.read_more@@Read More")}
				</button>
			</div>

			<Booking
				id={`modal_tech_${tech.id}`}
				text={t("app.book.book_now@@Book Now")}
				location="372146"
				staff={String(tech.id)}
				classes="btn btn-outline btn-neutral w-full rounded-full px-8 font-montserrat uppercase tracking-wider text-xs hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform active:scale-95"
				analyticsPlacement="team"
				analyticsServiceCategory="staff"
				analyticsServiceId={String(tech.id)}
				analyticsServiceName={tech.role || "Technician"}
			/>
		</article>
	);
});
