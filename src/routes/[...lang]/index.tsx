import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { AboutSection } from "~/components/ui/about-section";
import { ContactSection } from "~/components/ui/contact-section";
import { Footer } from "~/components/ui/footer";
import { GalleryGrid } from "~/components/ui/gallery-grid";
import { HeroSection } from "~/components/ui/hero-section";
import { Navigation } from "~/components/ui/navigation";
import { ReviewsSection } from "~/components/ui/reviews-section";
import { ServiceGrid } from "~/components/ui/service-grid";
import { TeamSection } from "~/components/ui/team-section";
import { ga } from "~/consts";
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

				<AboutSection />

				<ServiceGrid
					services={servicesSignal.value}
					serviceCategories={serviceCategoriesSig.value}
					location={contactSignal.value?.location.name || ""}
				/>

				<TeamSection technicians={techniciansSignal.value} />

				<ReviewsSection />

				<GalleryGrid />

				<ContactSection contact={contactSignal.value} />
			</main>

			<Footer />
		</div>
	);
});

export const head: DocumentHead = {
	title: "Aesthetic Lab | Nail Design, Brows & Laser",
	meta: [
		{
			name: "description",
			content:
				"Premium beauty salon offering bespoke manicures, brow sculpting, and laser treatments in a zen, organic setting.",
		},
	],
	scripts: ga,
};
