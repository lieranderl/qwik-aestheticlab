import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";

export const Footer = component$(() => {
	const t = inlineTranslate();
	return (
		<footer class="footer sm:footer-horizontal bg-primary text-neutral-content items-center px-4 md:px-8">
			<aside class="grid-flow-col items-center">
				<ImgAestheticlab class="w-16 h-16" />
				<p>
					{t("app.footer.copyright@@Copyright")} © {new Date().getFullYear()} -{" "}
					{t("app.footer.all_rights@@All right reserved")}
				</p>
			</aside>
			<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end items-center">
				<a class="link" href="privacy-policy">
					{t("app.privacy.privacy_title@@Privacy Policy")}
				</a>
			</nav>
		</footer>
	);
});
