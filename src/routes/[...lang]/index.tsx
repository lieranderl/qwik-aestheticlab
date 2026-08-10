import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { BookingCtaSection } from "~/components/sections/booking-cta-section";
import { ContactSection } from "~/components/sections/contact-section";
import { FaqSection } from "~/components/sections/faq-section";
import { Footer } from "~/components/sections/footer";
import { GalleryGrid } from "~/components/sections/gallery-grid";
import { HeroSection } from "~/components/sections/hero-section";
import { Navigation } from "~/components/sections/navigation";
import { ReviewsSection } from "~/components/sections/reviews-section";
import { ServiceGrid } from "~/components/sections/service-grid";
import { TeamSection } from "~/components/sections/team-section";
import { ScrollToTop } from "~/components/ui/scroll-to-top";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
	useTechniciansLoader,
} from "./layout";

export default component$(() => {
	const t = inlineTranslate();
	const servicesSignal = useServicesLoader();
	const serviceCategoriesSig = useServiceGroupsLoader();
	const techniciansSignal = useTechniciansLoader();
	const contactSignal = useContactLoader();
	const location = useLocation();

	return (
		<div class="min-h-screen">
			<a
				href="#main-content"
				class="btn btn-neutral btn-sm fixed top-3 left-4 z-50 -translate-y-24 opacity-0 transition-[opacity,transform] duration-150 focus-visible:translate-y-0 focus-visible:opacity-100 motion-reduce:transition-none"
			>
				{t("app.nav.skip_to_content@@Skip to content")}
			</a>
			<Navigation />

			<main id="main-content" tabIndex={-1}>
				<HeroSection />

				<ServiceGrid
					services={servicesSignal.value}
					serviceCategories={serviceCategoriesSig.value}
					location={contactSignal.value?.location.name || ""}
					initialCategoryId={
						location.url.searchParams.get("treatment") || undefined
					}
					initialSubgroupId={
						location.url.searchParams.get("treatmentArea") || undefined
					}
				/>

				<ReviewsSection />

				<GalleryGrid />

				<TeamSection technicians={techniciansSignal.value} />

				<FaqSection />

				<ContactSection contact={contactSignal.value} />

				<BookingCtaSection />
			</main>

			<Footer />
			<ScrollToTop />
		</div>
	);
});

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
