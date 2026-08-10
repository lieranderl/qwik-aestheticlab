import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import BirdLogo from "~/media/Bird.svg?jsx";
import { getLocaleNavLink } from "~/shared/locale-navigation";
import { getNavLinkKeys } from "~/shared/nav-links";

export const Footer = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	const links = getNavLinkKeys(false).map(({ href, key }) => ({
		label: t(key),
		href,
	}));

	return (
		<footer class="border-t border-base-content/10 bg-base-200 px-6 pt-16 pb-6 lg:px-8">
			<div class="mx-auto grid w-full max-w-7xl gap-10 sm:grid-cols-[1fr_auto] sm:items-start">
				{/* Brand */}
				<aside class="max-w-sm">
					<div class="flex items-center gap-3">
						<BirdLogo
							class="h-10 w-auto text-base-content [&_path]:fill-current"
							role="img"
							aria-label={t("app.nav.logo_bird@@Aesthetic Lab Bird Logo")}
						/>
						<div>
							<p class="font-qestero text-2xl leading-none">Aesthetic Lab</p>
							<p class="mt-1 font-main text-[0.6rem] uppercase tracking-[0.24em] text-base-content">
								Leuven
							</p>
						</div>
					</div>
					<p class="mt-4 font-main text-xs leading-relaxed text-base-content">
						{t(
							"app.footer.tagline@@Nails, brows, lashes and laser treatments shaped around you",
						)}
					</p>
				</aside>

				{/* Navigation */}
				<nav aria-label={t("app.footer.navigation@@Footer navigation")}>
					<h2 class="mb-3 font-main text-xs font-semibold uppercase tracking-wider text-base-content">
						{t("app.footer.explore@@Explore")}
					</h2>
					<div class="grid grid-cols-2 gap-x-7 gap-y-2.5 font-main text-sm sm:grid-cols-3">
						{links.map((item) => (
							<a
								key={item.label}
								class="link link-hover min-h-11 content-center text-base-content"
								href={getLocaleNavLink(location.url.pathname, item.href)}
							>
								{item.label}
							</a>
						))}
						<a
							class="link link-hover inline-flex min-h-11 items-center gap-2 text-base-content"
							href="https://www.instagram.com/aestheticlabbe"
							target="_blank"
							rel="noopener noreferrer"
						>
							<SiInstagram class="size-4 text-accent" aria-hidden="true" />
							Instagram
						</a>
					</div>
				</nav>
			</div>

			{/* Bottom bar */}
			<div class="mx-auto mt-12 max-w-7xl border-t border-base-300 pt-5 sm:flex sm:items-center sm:justify-between sm:gap-10">
				<p class="font-main text-xs leading-6 text-base-content">
					{t("app.footer.copyright@@Copyright")} © {new Date().getFullYear()}{" "}
					Aesthetic Lab Leuven
				</p>
				<nav
					aria-label={t("app.footer.legal@@Legal")}
					class="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-main text-xs sm:mt-0 sm:shrink-0"
				>
					<a
						class="link link-hover min-h-11 content-center text-base-content"
						href={getLocaleNavLink(location.url.pathname, "privacy-policy")}
					>
						{t("app.privacy.privacy_title@@Privacy Policy")}
					</a>
					<a
						class="link link-hover min-h-11 content-center text-base-content"
						href={getLocaleNavLink(location.url.pathname, "notice")}
					>
						{t("app.privacy.important_info@@Important Information")}
					</a>
				</nav>
			</div>
		</footer>
	);
});
