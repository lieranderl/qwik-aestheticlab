import { $, component$, useId, useSignal } from "@builder.io/qwik";
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

function compareStaffById(a: Staff, b: Staff) {
	return a.id - b.id;
}

export const TeamSection = component$<TeamSectionProps>(({ technicians }) => {
	const t = inlineTranslate();

	return (
		<section
			id="team"
			class="section-shell relative overflow-hidden bg-base-200"
		>
			<div class="custom-container">
				<FadeUp class="mb-9 grid gap-5 text-center md:mb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:text-left">
					<div>
						<p class="editorial-kicker mb-4">
							{t("app.team.kicker@@Studio artists")}
						</p>
						<h2 class="section-heading">
							{t("app.team.title@@Meet Our Team")}
						</h2>
					</div>
					<div class="editorial-rule mx-auto w-20 lg:mx-0 lg:w-full" />
				</FadeUp>

				<div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{[...technicians].sort(compareStaffById).map((tech, index) => (
						<FadeUp key={tech.id} delay={index * 60} class="group h-full">
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

export const TeamMemberCard = component$<TeamMemberCardProps>(({ tech }) => {
	const t = inlineTranslate();
	const isExpanded = useSignal(false);
	const ImageComp = resolveImageComponent(tech.photo_url);
	const bio = tech.about;
	const bioId = useId();
	const hasLongBio = bio.length > 180;

	return (
		<article class="card surface-card flex h-full flex-col p-4 text-left transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none md:p-6">
			<div class="mx-auto mb-4 size-32 shrink-0 overflow-hidden rounded-full border border-base-300 bg-base-200 transition-colors duration-200 group-hover:border-primary/30 md:mb-6 md:aspect-4/5 md:h-auto md:w-full md:rounded-2xl">
				{ImageComp ? (
					<ImageComp
						alt={tech.name}
						class="interactive-media h-full w-full object-cover"
						loading="lazy"
					/>
				) : (
					tech.photo_url && (
						<img
							src={tech.photo_url}
							alt={tech.name}
							width={640}
							height={800}
							class="interactive-media h-full w-full object-cover"
							loading="lazy"
						/>
					)
				)}
			</div>

			<h3 class="mb-1 text-balance font-qestero text-2xl leading-none md:text-3xl">
				{tech.name}
			</h3>
			<p class="font-montserrat mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-primary md:mb-5">
				{tech.role || t("app.team.role.technician@@Technician")}
			</p>

			{/* Bio Description */}
			<div class="mb-4 flex grow flex-col gap-3 md:mb-6">
				<div
					id={bioId}
					class={[
						"relative font-montserrat text-sm leading-relaxed text-base-content/85",
						isExpanded.value
							? "max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
							: "line-clamp-3 md:line-clamp-4",
					]}
				>
					{bio}
				</div>
				{hasLongBio ? (
					<button
						type="button"
						onClick$={$(() => {
							isExpanded.value = !isExpanded.value;
						})}
						class="btn btn-ghost btn-sm mt-auto min-h-11 w-fit px-2 font-montserrat text-xs uppercase tracking-wider text-primary"
						aria-expanded={isExpanded.value}
						aria-controls={bioId}
					>
						{isExpanded.value
							? t("app.common.read_less@@Read Less")
							: t("app.common.read_more@@Read More")}
					</button>
				) : null}
			</div>

			<Booking
				id={`modal_tech_${tech.id}`}
				text={t("app.book.book_now@@Book Now")}
				location="372146"
				staff={String(tech.id)}
				classes="btn btn-outline btn-primary min-h-11 w-full rounded-full px-8 font-montserrat uppercase tracking-wider text-xs transition-colors duration-150"
				analyticsPlacement="team"
				analyticsServiceCategory="staff"
				analyticsServiceId={String(tech.id)}
				analyticsServiceName={tech.role || "Technician"}
			/>
		</article>
	);
});
