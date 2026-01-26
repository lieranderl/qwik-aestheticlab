import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const Footer = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();

	/* Shared navigation logic imported from shared/locale-navigation.ts */

	return (
		<footer class="bg-base-200 text-base-content border-t border-base-content/10 pt-8 pb-8">
			<div class="custom-container">
				<div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
					{/* Left: Brand & Copyright */}
					<div class="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
						<img
							src="/media/AestheticLab.svg"
							alt="Aesthetic Lab"
							width="200"
							height="60"
							class="h-10 w-auto"
						/>
						<p class="font-montserrat text-xs tracking-wide opacity-80">
							{t("app.footer.copyright@@Copyright")} ©{" "}
							{new Date().getFullYear()} -{" "}
							{t("app.footer.all_rights@@All right reserved")}
						</p>
					</div>

					{/* Right: Navigation */}
					<nav class="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-montserrat text-sm tracking-wider">
						<a
							class="link link-primary"
							href={getLocaleNavLink(location.url.pathname, "privacy-policy")}
						>
							{t("app.privacy.privacy_title@@Privacy Policy")}
						</a>
						<a
							class="link link-primary"
							href={getLocaleNavLink(location.url.pathname, "notice")}
						>
							{t("app.privacy.important_info@@Important Information")}
						</a>
					</nav>
				</div>
			</div>
		</footer>
	);
});
