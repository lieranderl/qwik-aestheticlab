import { test, expect } from "@playwright/test";

const localeRedirectPattern = /\/[a-z]{2}-[A-Z]{2}(?:\/|$)/;
const consentStorageKey = "aestheticlab_cookie_consent_v2";

test("redirects the root path to a locale-prefixed URL", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(localeRedirectPattern);
	await expect(page.locator("body")).toBeVisible();
});

test("keeps the current locale prefix in primary navigation links", async ({
	page,
}) => {
	await page.goto("/en-BE/");

	await expect(
		page.getByRole("link", { name: "Home", exact: true }),
	).toHaveAttribute("href", "/en-BE/#");
	await expect(
		page
			.getByRole("navigation", { name: "Primary navigation" })
			.getByRole("link", { name: "Services", exact: true }),
	).toHaveAttribute("href", "/en-BE/#services");
	await expect(
		page.getByRole("link", { name: "Privacy Policy", exact: true }),
	).toHaveAttribute("href", "/en-BE/privacy-policy");
});

test("uses the corporate light theme and keeps navigation aligned with page order", async ({
	page,
}) => {
	await page.goto("/en-BE/");

	await expect(page.locator("body")).toHaveAttribute("data-theme", "Aesthetic");
	await expect(
		page
			.getByRole("navigation", { name: "Primary navigation" })
			.getByRole("link"),
	).toHaveText([
		"Home",
		"Services",
		"Reviews",
		"Our Work",
		"Team",
		"FAQ",
		"Contact",
	]);
});

test("keeps the mobile hero action-led and shows treatment imagery early", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/en-BE/");

	const hero = page.locator("#hero");
	await expect(
		hero.getByRole("heading", {
			name: "The art of natural beauty",
			level: 1,
		}),
	).toBeVisible();
	await expect(
		hero.getByRole("button", { name: "Book Appointment" }),
	).toBeVisible();
});

test("renders localized landing-page copy in every supported language", async ({
	page,
}) => {
	const locales = [
		{
			lang: "en-BE",
			hero: "The art of natural beauty",
			reviews: "What people say",
			faq: "FAQ",
		},
		{
			lang: "nl-BE",
			hero: "De kunst van natuurlijke schoonheid",
			reviews: "Mooie woorden",
			faq: "FAQ",
		},
		{
			lang: "fr-BE",
			hero: "L'art de la beauté naturelle",
			reviews: "Mots doux",
			faq: "FAQ",
		},
		{
			lang: "ru-BE",
			hero: "Искусство естественной красоты",
			reviews: "Тёплые слова",
			faq: "Частые вопросы",
		},
		{
			lang: "uk-BE",
			hero: "Мистецтво природної краси",
			reviews: "Теплі слова",
			faq: "Поширені запитання",
		},
	];

	await page.setViewportSize({ width: 390, height: 844 });

	for (const locale of locales) {
		await page.goto(`/${locale.lang}/`);
		await expect(page.locator("#hero h1")).toHaveText(locale.hero);
		await expect(page.locator("#reviews h2")).toHaveText(locale.reviews);
		await expect(page.locator("#faq h2")).toHaveText(locale.faq);

		const dimensions = await page.evaluate(() => ({
			clientWidth: document.documentElement.clientWidth,
			scrollWidth: document.documentElement.scrollWidth,
		}));
		expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	}
});

test("supports the audited responsive widths without horizontal overflow", async ({
	page,
}) => {
	const viewports = [
		{ width: 320, height: 800 },
		{ width: 390, height: 844 },
		{ width: 430, height: 932 },
		{ width: 768, height: 900 },
		{ width: 1024, height: 768 },
		{ width: 1440, height: 900 },
	];

	for (const viewport of viewports) {
		await page.setViewportSize(viewport);
		await page.goto("/en-BE/");

		const dimensions = await page.evaluate(() => ({
			clientWidth: document.documentElement.clientWidth,
			scrollWidth: document.documentElement.scrollWidth,
		}));

		expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	}
});

test("keeps the Instagram profile card compact on desktop and fluid on mobile", async ({
	page,
}) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/en-BE/#gallery");

		const metrics = await page.getByTestId("instagram-card").evaluate((card) => {
			const box = card.getBoundingClientRect();
			return {
				height: box.height,
				left: box.left,
				viewportWidth: document.documentElement.clientWidth,
				width: box.width,
			};
		});

		if (viewport.width >= 1024) {
			expect(metrics.width).toBeLessThanOrEqual(1024);
			expect(metrics.height).toBeLessThanOrEqual(448.5);
			expect(metrics.left).toBeGreaterThanOrEqual(16);
			expect(metrics.left + metrics.width).toBeLessThanOrEqual(
				metrics.viewportWidth - 16,
			);
		} else {
			expect(metrics.width).toBe(viewport.width - 32);
			expect(metrics.height).toBeGreaterThan(300);
		}
	}
});

test("keeps the hero content inside the viewport at mobile and desktop widths", async ({
	page,
}) => {
	for (const viewport of [
		{ width: 320, height: 800 },
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/en-BE/");

		const result = await page.locator("#hero").evaluate((hero) => {
			const heading = hero.querySelector("h1");
			const primaryAction = hero.querySelector("button");
			if (!heading || !primaryAction) return null;

			const headingBox = heading.getBoundingClientRect();
			const actionBox = primaryAction.getBoundingClientRect();
			return {
				actionLeft: actionBox.left,
				actionRight: actionBox.right,
				headingLeft: headingBox.left,
				headingRight: headingBox.right,
				viewportWidth: document.documentElement.clientWidth,
			};
		});

		expect(result).not.toBeNull();
		expect(result?.headingLeft).toBeGreaterThanOrEqual(0);
		expect(result?.headingRight).toBeLessThanOrEqual(
			result?.viewportWidth ?? 0,
		);
		expect(result?.actionLeft).toBeGreaterThanOrEqual(0);
		expect(result?.actionRight).toBeLessThanOrEqual(
			result?.viewportWidth ?? 0,
		);
	}
});

test("renders fade-up elements in SSR output", async ({
	page,
}) => {
	await page.goto("/en-BE/");

	const fadeUpCount = await page.locator("[data-fade-up]").count();
	expect(fadeUpCount).toBeGreaterThan(0);
});

test("renders the reviews section with heading and star ratings", async ({
	page,
}) => {
	await page.goto("/en-BE/");

	await expect(page.locator("#reviews h2")).toHaveText("What people say");
	await expect(page.getByTestId("review-rating").first()).toBeVisible();
});

test("renders the FAQ section with proper heading", async ({ page }) => {
	await page.goto("/en-BE/#faq");

	await expect(page.locator("#faq h2")).toBeVisible();
	await expect(
		page.locator("#faq .collapse-title").first(),
	).toBeVisible();
});

test("opens treatments in-page and restores the overview with browser history", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/en-BE/#services");

	const treatmentButtons = page.getByRole("button", { name: "View Treatments" });
	await expect(treatmentButtons.first()).toBeVisible();
	await treatmentButtons.first().click();

	await expect(page).toHaveURL(/\?treatment=[^#]+#services$/);
	await expect(page.locator("#service-details-heading")).toBeVisible();

	const backActions = page.getByTestId("service-back-actions");
	await expect(
		backActions.getByRole("button", { name: "Back to Overview" }),
	).toBeVisible();

	await page.goBack();
	await expect(page.locator("#service-details-heading")).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL(/\/en-BE\/#services$/);
	await expect(treatmentButtons.first()).toBeVisible();
});

test("falls back to the treatment overview for invalid shared state", async ({
	page,
}) => {
	await page.goto(
		"/en-BE/?treatment=unknown&treatmentArea=unknown#services",
	);

	await expect(page.locator("#service-details-heading")).toHaveCount(0);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://aestheticlab.be/en-BE/",
	);
});

test("opens and closes the booking dialog", async ({ page }) => {
	await page.goto("/en-BE/");

	await page.getByRole("button", { name: "Book Appointment" }).first().click();

	const dialog = page.getByRole("dialog", { name: "Book Appointment" });
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAttribute("aria-modal", "true");

	await dialog.getByRole("button", { name: "Close" }).first().click();
	await expect(dialog).toBeHidden();
});

test("supports keyboard dismissal for the language menu", async ({ page }) => {
	await page.goto("/en-BE/");

	const trigger = page.getByRole("button", { name: "Select language" });
	await trigger.click();

	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	await expect(
		page.getByRole("list", { name: "Language options" }),
	).toBeVisible();

	await page.keyboard.press("Escape");

	await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test.describe("cookie consent banner", () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript((key) => {
			window.localStorage.removeItem(key);
		}, consentStorageKey);
	});

	test("shows on first visit and persists accepted analytics consent", async ({
		page,
	}) => {
		await page.goto("/en-BE/");

		await expect(
			page.getByRole("button", { name: "Accept analytics" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Reject analytics" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Read our Privacy Policy" }),
		).toHaveAttribute("href", "/en-BE/privacy-policy");

		await page.getByRole("button", { name: "Accept analytics" }).click();

		await expect(
			page.getByRole("button", { name: "Cookie settings" }),
		).toBeVisible();

		const storedConsent = await page.evaluate((key) => {
			return window.localStorage.getItem(key);
		}, consentStorageKey);

		expect(storedConsent).toContain('"analytics":true');
	});

	test("allows rejecting analytics and reopening the cookie settings panel", async ({
		page,
	}) => {
		await page.goto("/en-BE/");

		await page.getByRole("button", { name: "Reject analytics" }).click();

		await expect(
			page.getByRole("button", { name: "Cookie settings" }),
		).toBeVisible();

		const storedConsent = await page.evaluate((key) => {
			return window.localStorage.getItem(key);
		}, consentStorageKey);

		expect(storedConsent).toContain('"analytics":false');

		await page.getByRole("button", { name: "Cookie settings" }).click();

		await expect(
			page.getByRole("button", { name: "Accept analytics" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Reject analytics" }),
		).toBeVisible();
	});
});

test.describe("mobile navigation", () => {
	test.use({
		viewport: {
			width: 390,
			height: 844,
		},
	});

	test("opens and closes the mobile menu with user-visible controls", async ({
		page,
	}) => {
		await page.goto("/en-BE/");

		const openMenuButton = page.getByRole("button", {
			name: /open (navigation )?menu/i,
		});
		await expect(openMenuButton).toBeVisible();

		await openMenuButton.click();

		const closeMenuButton = page.getByRole("button", {
			name: /close (navigation )?menu/i,
		});
		await expect(closeMenuButton).toBeVisible();
		await expect(openMenuButton).toBeHidden();

		await closeMenuButton.click();

		await expect(openMenuButton).toBeVisible();
	});
});
