import { $, component$, useId, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
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
		if (path.endsWith(`/${imageName}.jpg`)) return TEAM_IMAGES[path];
	}
	return null;
}

interface TeamSectionProps {
	technicians: Staff[];
}

function compareStaffById(a: Staff, b: Staff) {
	return a.id - b.id;
}

export const TeamSection = component$<TeamSectionProps>(({ technicians }) => {
	const t = inlineTranslate();
	const sorted = [...technicians].sort(compareStaffById);

	return (
		<section
			id="team"
			class="scroll-mt-24 overflow-hidden bg-base-200 py-16 md:py-24 lg:py-28"
		>
			<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div class="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
					<div>
						<p class="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
							{t("app.team.kicker@@The people behind your care")}
						</p>
						<h2 class="max-w-2xl text-balance font-cormorant text-5xl leading-[0.9] text-base-content md:text-7xl">
							{t("app.team.section_title@@Meet your beauty team")}
						</h2>
					</div>
					<div class="max-w-md border-l border-base-300 pl-5 lg:justify-self-end">
						<p class="text-pretty font-montserrat text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
							{t(
								"app.story_text@@At Aesthetic Lab, artistry meets expertise in a calm studio created around your comfort.",
							)}
						</p>
						{/* Team stat */}
						<div class="mt-4">
							<span class="text-3xl font-cormorant text-base-content">
								{sorted.length}
							</span>
							<span class="ml-2 font-montserrat text-sm text-base-content/60">
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
			</div>
		</section>
	);
});

interface TeamMemberCardProps {
	tech: Staff;
	index: number;
}

export const TeamMemberCard = component$<TeamMemberCardProps>(
	({ tech, index }) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const ImageComp = resolveImageComponent(tech.photo_url);
		const bioId = useId();
		const hasLongBio = tech.about.length > 160;

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
							<span class="badge badge-soft badge-sm font-montserrat text-accent">
								{tech.role || t("app.team.role.technician@@Technician")}
							</span>
						</div>
						<h3 class="font-cormorant text-2xl leading-none text-base-content">
							{tech.name}
						</h3>
					</div>

					{/* Bio with expand/collapse */}
					<div
						id={bioId}
						class={
							isExpanded.value
								? "font-montserrat text-sm leading-relaxed text-base-content/75"
								: "line-clamp-3 font-montserrat text-sm leading-relaxed text-base-content/75"
						}
					>
						{tech.about}
					</div>

					{hasLongBio ? (
						<button
							type="button"
							onClick$={$(() => {
								isExpanded.value = !isExpanded.value;
							})}
							class="min-h-11 w-fit cursor-pointer px-0 font-montserrat text-xs font-semibold uppercase tracking-wider text-secondary"
							aria-expanded={isExpanded.value}
							aria-controls={bioId}
						>
							{isExpanded.value
								? t("app.common.read_less@@Read Less")
								: t("app.common.read_more@@Read More")}
						</button>
					) : null}

					{/* Booking action */}
					<div class="card-actions mt-auto border-t border-base-300 pt-3.5">
						<Booking
							id={`modal_tech_${tech.id}`}
							text={t("app.book.book_now@@Book Now")}
							location="372146"
							staff={String(tech.id)}
							classes="btn btn-sm min-h-11 w-full font-montserrat text-xs font-semibold uppercase tracking-wider"
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
