import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { AboutSection } from "~/components/sections/about-section";
import { ContactSection } from "~/components/sections/contact-section";
import { Footer } from "~/components/sections/footer";
import { GalleryGrid } from "~/components/sections/gallery-grid";
import { HeroSection } from "~/components/sections/hero-section";
import { Navigation } from "~/components/sections/navigation";
import { ReviewsSection } from "~/components/sections/reviews-section";
import { ServiceGrid } from "~/components/sections/service-grid";
import { TeamSection } from "~/components/sections/team-section";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
	useTechniciansLoader,
} from "./layout";

export default component$(() => {
	const servicesSignal = useServicesLoader();
	const serviceCategoriesSig = useServiceGroupsLoader();
	const techniciansSignal = useTechniciansLoader();
	const contactSignal = useContactLoader();

	return (
		<div class="min-h-screen">
			<Navigation />

			<main>
				<HeroSection />

				<ServiceGrid
					services={servicesSignal.value}
					serviceCategories={serviceCategoriesSig.value}
					location={contactSignal.value?.location.name || ""}
				/>

				<TeamSection technicians={techniciansSignal.value} />

				<ReviewsSection />

				<GalleryGrid />

				<AboutSection />

				<ContactSection contact={contactSignal.value} />
			</main>

			<Footer />
		</div>
	);
});

import { inlineTranslate } from "qwik-speak";

export const head: DocumentHead = () => {
	const t = inlineTranslate();
	return {
		title: t("app.head.home.title@@Aesthetic Lab | Nail Design, Brows & Laser"),
		meta: [
			{
				name: "description",
				content: t(
					"app.head.home.description@@Premium beauty salon offering bespoke manicures, brow sculpting, and laser treatments in a zen, organic setting.",
				),
			},
		],
	};
};
