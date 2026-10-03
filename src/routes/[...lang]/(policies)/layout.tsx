import { component$, Slot } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { ScrollToTop } from "~/components/ui/scroll-to-top";

export default component$(() => {
	const t = inlineTranslate();

	return (
		<div class="min-h-screen bg-base-100 text-base-content">
			<a
				href="#main-content"
				class="btn btn-neutral btn-sm fixed top-3 left-4 z-50 -translate-y-24 opacity-0 transition-[opacity,transform] duration-150 focus-visible:translate-y-0 focus-visible:opacity-100 motion-reduce:transition-none"
			>
				{t("app.nav.skip_to_content@@Skip to content")}
			</a>
			<Navigation />
			<main id="main-content" tabIndex={-1} class="pt-16 lg:pt-20">
				<Slot />
			</main>
			<Footer />
			<ScrollToTop />
		</div>
	);
});
