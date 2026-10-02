import { component$ } from "@qwik.dev/core";
import { type DocumentHead, useLocation } from "@qwik.dev/router";
import { _ } from "compiled-i18n";
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
import { localizeHead } from "~/shared/i18n";
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
	const location = useLocation();

	return (
		<div class="min-h-screen">
			<a
				href="#main-content"
				class="btn btn-neutral btn-sm fixed top-3 left-4 z-50 -translate-y-24 opacity-0 transition-[opacity,transform] duration-150 focus-visible:translate-y-0 focus-visible:opacity-100 motion-reduce:transition-none"
			>
				{_`nav.skip_to_content`}
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

export const head: DocumentHead = localizeHead(() => {
	return {
		title: _`head.home.title`,
		meta: [
			{
				name: "description",
				content: _`head.home.description`,
			},
		],
	};
});
