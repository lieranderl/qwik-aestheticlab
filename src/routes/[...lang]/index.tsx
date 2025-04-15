import { $, component$, useOnDocument } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/sections/hero";
import About from "~/components/sections/about";
import { ServicesSection } from "~/components/sections/services";
import { TeamSection } from "~/components/sections/team";
import Work from "~/components/sections/work";
import Contact from "~/components/sections/contact";
import Header from "~/components/header/header";
import AOS from "aos";
import "aos/dist/aos.css";
import { ga } from "~/consts";
import { Footer } from "~/components/sections/footer";
import { useServicesLoader, useTechniciansLoader } from "./layout";

export default component$(() => {
	useOnDocument(
		"DOMContentLoaded",
		$(() => {
			AOS.init({
				duration: 800,
			});
		}),
	);

	const techniciansSignal = useTechniciansLoader();
	const servicesSignal = useServicesLoader();

	return (
		<>
			<Header />
			<Hero />
			<ServicesSection services={servicesSignal.value} />
			<TeamSection technicians={techniciansSignal.value} />
			<Work />
			<About />
			<Contact />
			<Footer />
		</>
	);
});

export const head: DocumentHead = {
	title: "Aesthetic Lab - Beauty & Wellness",
	meta: [
		{
			name: "description",
			content: "Where Expertise Crafts Unique Beauty",
		},
	],
	scripts: ga,
};
