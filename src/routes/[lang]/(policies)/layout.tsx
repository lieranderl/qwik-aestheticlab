import { component$, Slot } from "@qwik.dev/core";
import { _ } from "compiled-i18n";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";

export default component$(() => {
	return (
		<div class="min-h-screen bg-base-200 text-base-content">
			<a
				href="#main-content"
				class="btn btn-neutral btn-sm fixed top-3 left-4 z-50 -translate-y-24 opacity-0 transition-[opacity,transform] duration-150 focus-visible:translate-y-0 focus-visible:opacity-100 motion-reduce:transition-none"
			>
				{_`nav.skip_to_content`}
			</a>
			<Navigation />
			<main
				id="main-content"
				tabIndex={-1}
				class="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-24"
			>
				<div class="mx-auto w-full max-w-6xl">
					<Slot />
				</div>
			</main>
			<Footer />
		</div>
	);
});
