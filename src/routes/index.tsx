import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/sections/hero";
import About from "~/components/sections/about";
import Services from "~/components/sections/services";
import Team from "~/components/sections/team";
import Work from "~/components/sections/work";
import Contact from "~/components/sections/contact";
import Header from "~/components/header/header";

export default component$(() => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Team />
      <Work />
      <Contact />
    </>
  );
});

export const head: DocumentHead = {
  title: "Aesthetic Lab - Beauty & Wellness",
  meta: [
    {
      name: "description",
      content: "Experience the transformative power of beauty at Aesthetic Lab",
    },
  ],
};
