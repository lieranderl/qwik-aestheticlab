import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Header from "~/components/header/header";
import About from "~/components/sections/about";
import Contact from "~/components/sections/contact";
import { Footer } from "~/components/sections/footer";
import Hero from "~/components/sections/hero";
import { PolicySection } from "~/components/sections/policy";
import { ServicesSection } from "~/components/sections/services";
import { TeamSection } from "~/components/sections/team";
import Work from "~/components/sections/work";
import { ga } from "~/consts";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
	useTechniciansLoader,
} from "./layout";

export default component$(() => {
	const techniciansSignal = useTechniciansLoader();
	const servicesSignal = useServicesLoader();
	const serviceCategoriesSig = useServiceGroupsLoader();
	const contactSignal = useContactLoader();
	return (
		<>
			<Header />
			<Hero />
			<ServicesSection
				services={servicesSignal.value}
				serviceCategories={serviceCategoriesSig.value}
			/>

			<TeamSection technicians={techniciansSignal.value} />
			<PolicySection />
			<Work />
			<About />
			<Contact contact={contactSignal.value} />
			<Footer />
		</>
	);
});

export const head: DocumentHead = {
	title: "Best Manicure in Leuven | Aesthetic Lab",
	meta: [
		{
			name: "description",
			content:
				"Looking for expert nails and manicure in Leuven? Visit Aesthetic Lab for top-tier beauty & nail care.",
		},
	],
	scripts: ga,
};
