import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
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
		<SectionWrapper id="team" background="base-200">
			<div class="mb-4.5 grid gap-6 md:mb-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-16">
				<FadeUp>
					<KickerLabel>{t("app.team.kicker@@Who you'll meet")}</KickerLabel>
					<h2 class="text-balance font-cormorant text-[2.875rem] leading-[0.95] text-base-content md:text-7xl lg:text-[5.5rem] lg:leading-[0.9]">
						{t("app.team.heading@@The team")}
					</h2>
				</FadeUp>
				<p class="hidden font-cormorant text-[1.375rem] leading-snug text-base-content italic lg:block">
					{t(
						"app.team.intro@@Opened in 2024 with a simple promise: beautiful work in a space that feels calm, honest and welcoming. We listen first, then create.",
					)}
				</p>
			</div>

			<ul
				class="grid grid-cols-2 gap-x-2.5 gap-y-4.5 md:gap-x-6 md:gap-y-10 lg:grid-cols-4"
				aria-label={t("app.team.heading@@The team")}
			>
				{sorted.map((tech) => (
					<TeamMemberCard key={tech.id} tech={tech} />
				))}
			</ul>
		</SectionWrapper>
	);
});

interface TeamMemberCardProps {
	tech: Staff;
}

export const TeamMemberCard = component$<TeamMemberCardProps>(({ tech }) => {
	const t = inlineTranslate();
	const ImageComp = resolveTeamImage(tech.photo_url);
	const role = tech.role || t("app.team.role.technician@@Technician");
	const isJunior = /junior/i.test(tech.role);
	const imageClass =
		"h-full w-full object-cover object-[center_22%] transition-transform duration-700 ease-(--ease-smooth) group-hover:scale-[1.03] motion-reduce:transition-none";

	return (
		<li class="group">
			<div class="flex flex-col gap-2 md:gap-3.5">
				<figure class="aspect-9/10 overflow-hidden bg-base-300 md:aspect-3/4">
					{ImageComp ? (
						<ImageComp
							alt={tech.name}
							class={imageClass}
							loading="lazy"
							sizes="(min-width: 1280px) 19rem, (min-width: 1024px) 23vw, 50vw"
						/>
					) : tech.photo_url ? (
						<img
							src={tech.photo_url}
							alt={tech.name}
							width={400}
							height={533}
							class={imageClass}
							loading="lazy"
						/>
					) : (
						<div class="flex h-full w-full items-center justify-center bg-base-200">
							<span class="font-cormorant text-6xl text-base-content/30">
								{tech.name.charAt(0)}
							</span>
						</div>
					)}
				</figure>

				<div class="flex items-baseline justify-between gap-3 md:border-b md:border-neutral md:pb-3">
					<h3 class="font-cormorant text-2xl leading-none text-base-content md:text-4xl">
						{tech.name}
					</h3>
					<Booking
						id={`modal_tech_${tech.id}`}
						text={t("app.team.book@@Book")}
						ariaLabel={t("app.team.book_with@@Book with {{name}}", {
							name: tech.name,
						})}
						staff={String(tech.id)}
						classes="link inline-flex min-h-11 items-center font-main text-sm font-semibold underline-offset-4"
						analyticsPlacement="team"
						analyticsServiceCategory="staff"
						analyticsServiceId={String(tech.id)}
						analyticsServiceName={tech.role || "Technician"}
					/>
				</div>
				<p class="font-main text-sm font-semibold text-base-content/80">
					{role}
					{isJunior ? ` · ${t("app.team.intro_prices@@intro prices")}` : ""}
				</p>
			</div>
		</li>
	);
});
