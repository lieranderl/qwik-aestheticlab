import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { ExpandableText } from "~/components/ui/expandable-text";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SectionWrapper } from "~/components/ui/section-wrapper";

import { resolveTeamImage } from "~/shared/image-resolver";
import type { Staff } from "~/types";

interface TeamSectionProps {
	technicians: Staff[];
}

export const TeamSection = component$<TeamSectionProps>(({ technicians }) => {
	const t = inlineTranslate();
	const sorted = [...technicians].sort((a, b) => a.id - b.id);

	return (
		<SectionWrapper id="team">
			{/* Section Header */}
			<div class="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
				<div>
					<KickerLabel>
						{t("app.team.kicker@@The people behind your care")}
					</KickerLabel>
					<h2 class="max-w-2xl text-balance font-cormorant text-5xl leading-[0.9] text-base-content md:text-7xl">
						{t("app.team.section_title@@Meet your beauty team")}
					</h2>
				</div>
				<div class="max-w-md border-l border-base-300 pl-5 lg:justify-self-end">
					<p class="text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
						{t(
							"app.story_text@@At Aesthetic Lab, artistry meets expertise in a calm studio created around your comfort.",
						)}
					</p>
					{/* Team stat */}
					<div class="mt-4">
						<span class="text-3xl font-cormorant text-base-content">
							{sorted.length}
						</span>
						<span class="ml-2 font-main text-sm text-base-content/80">
							{sorted.length === 1
								? t("app.team.artist@@artist")
								: t("app.team.artists@@artists")}{" "}
							&mdash; {t("app.team.leuven@@Leuven")}
						</span>
					</div>
				</div>
			</div>

			{/* Team Cards — carousel on mobile, grid on desktop */}
			<section
				class="carousel carousel-start -mx-4 w-[calc(100%+2rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 md:mx-0 md:grid md:w-full md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:items-start xl:grid-cols-4"
				aria-label={t("app.team.section_title@@Meet your beauty team")}
			>
				{sorted.map((tech, index) => (
					<TeamMemberCard key={tech.id} tech={tech} index={index} />
				))}
			</section>
		</SectionWrapper>
	);
});

interface TeamMemberCardProps {
	tech: Staff;
	index: number;
}

export const TeamMemberCard = component$<TeamMemberCardProps>(
	({ tech, index }) => {
		const t = inlineTranslate();
		const ImageComp = resolveTeamImage(tech.photo_url);

		return (
			<article
				class={[
					"group card card-border carousel-item w-[62%] shrink-0 snap-start bg-base-100 transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg sm:w-[44%] md:w-auto",
					index % 2 === 1 ? "lg:mt-12" : "",
				]}
			>
				{/* Team photo */}
				<figure class="aspect-3/4 overflow-hidden bg-base-300">
					{ImageComp ? (
						<ImageComp
							alt={tech.name}
							class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none"
							loading="lazy"
							sizes="(min-width: 1280px) 20rem, (min-width: 1024px) calc(33vw - 2rem), (min-width: 768px) calc(50vw - 2rem), 62vw"
						/>
					) : tech.photo_url ? (
						<img
							src={tech.photo_url}
							alt={tech.name}
							width={400}
							height={533}
							class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none"
							loading="lazy"
						/>
					) : (
						/* Placeholder when no photo */
						<div class="flex h-full w-full items-center justify-center bg-base-200">
							<span class="font-cormorant text-6xl text-base-content/20">
								{tech.name.charAt(0)}
							</span>
						</div>
					)}
				</figure>

				<div class="card-body min-w-0 gap-3 p-5">
					{/* Name + role badge */}
					<div>
						<div class="mb-1.5">
							<span class="badge badge-secondary badge-soft badge-sm font-main">
								{tech.role || t("app.team.role.technician@@Technician")}
							</span>
						</div>
						<h3 class="font-cormorant text-2xl leading-none text-base-content">
							{tech.name}
						</h3>
					</div>

					{/* Bio with expand/collapse */}
					<ExpandableText text={tech.about} maxLength={160} />

					{/* Booking action */}
					<div class="card-actions mt-auto border-t border-base-300 pt-3.5">
						<Booking
							id={`modal_tech_${tech.id}`}
							text={t("app.book.book_now@@Book Now")}
							staff={String(tech.id)}
							classes="btn btn-sm min-h-11 w-full font-main text-xs font-semibold uppercase tracking-wider"
							analyticsPlacement="team"
							analyticsServiceCategory="staff"
							analyticsServiceId={String(tech.id)}
							analyticsServiceName={tech.role || "Technician"}
						/>
					</div>
				</div>
			</article>
		);
	},
);
