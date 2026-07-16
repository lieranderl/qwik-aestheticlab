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
	).toHaveAttribute(
		"href",
		"/en-BE/#",
	);
	await expect(
		page.getByRole("link", { name: "Services", exact: true }),
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
		page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link"),
	).toHaveText(["Home", "Services", "Team", "Our Work", "About", "Contact"]);
});

test("keeps the hero as the complete first viewport", async ({ page }) => {
	await page.goto("/en-BE/");

	const heroHeight = await page.locator("#hero").evaluate((element) => {
		return element.getBoundingClientRect().height;
	});
	const viewportHeight = page.viewportSize()?.height ?? 0;

	expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight - 1);
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
			expect(metrics.height).toBeLessThanOrEqual(448);
			expect(metrics.left).toBeCloseTo(
				(metrics.viewportWidth - metrics.width) / 2,
				0,
			);
		} else {
			expect(metrics.width).toBe(viewport.width - 32);
			expect(metrics.height).toBeGreaterThan(400);
		}
	}
});

test("keeps hero service copy readable at mobile and desktop widths", async ({
	page,
}) => {
	for (const viewport of [
		{ width: 320, height: 800 },
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/en-BE/");

		const result = await page.evaluate(() => {
			const line = document.querySelector('[data-testid="hero-service-line"]');
			const textRotate = document.querySelector(
				'[data-testid="hero-text-rotate"]',
			);
			const track = textRotate?.firstElementChild;
			const footnote = document.querySelector(
				'[data-testid="hero-service-footnote"]',
			);
			if (!line || !textRotate || !track || !footnote) return null;

			const lineBox = line.getBoundingClientRect();
			const textRotateBox = textRotate.getBoundingClientRect();
			const footnoteBox = footnote.getBoundingClientRect();
			return {
				animationName: getComputedStyle(track).animationName,
				colorCount: new Set(
					Array.from(track.children, (row) => getComputedStyle(row).color),
				).size,
				lineBottom: lineBox.bottom,
				lineHeight: lineBox.height,
				textRotateHeight: textRotateBox.height,
				footnoteTop: footnoteBox.top,
			};
		});

		expect(result).not.toBeNull();
		expect(result?.animationName).toBe("rotator");
		expect(result?.colorCount).toBe(5);
		expect(result?.lineHeight).toBeGreaterThan(0);
		expect(result?.textRotateHeight).toBeGreaterThan(0);
		expect(result?.lineBottom).toBeLessThanOrEqual(result?.footnoteTop ?? 0);
	}
});

test("uses one card radius and a non-looping review rail", async ({ page }) => {
	await page.goto("/en-BE/");

	const cardRadii = await page.locator(".surface-card").evaluateAll((cards) => {
		return [...new Set(cards.map((card) => getComputedStyle(card).borderRadius))];
	});
	const reviewRail = page.getByRole("region", { name: "Kind Words" });

	expect(cardRadii).toEqual(["16px"]);
	await expect(reviewRail.locator("article")).toHaveCount(11);
	await expect(reviewRail).toHaveCSS("animation-name", "none");
});

test("opens treatments in-page and restores the overview with browser history", async ({
	page,
}) => {
	await page.goto("/en-BE/#services");

	const treatmentButtons = page.getByRole("button", { name: "View Treatments" });
	await expect(treatmentButtons).toHaveCount(4);
	await treatmentButtons.first().click();

	await expect(page).toHaveURL(/\?treatment=[^#]+#services$/);
	await expect(page.locator("#service-details-heading")).toBeVisible();

	await page.goBack();
	await expect(page).toHaveURL(/\/en-BE\/#services$/);
	await expect(treatmentButtons).toHaveCount(4);
});

test("falls back to the treatment overview for invalid shared state", async ({
	page,
}) => {
	await page.goto(
		"/en-BE/?treatment=unknown&treatmentArea=unknown#services",
	);

	await expect(page.getByRole("button", { name: "View Treatments" })).toHaveCount(
		4,
	);
	await expect(page.locator("#service-details-heading")).toHaveCount(0);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"http://localhost:5173/en-BE/",
	);
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
	await expect(trigger).toBeFocused();
});

test("opens and closes the booking dialog without eagerly rendering it", async ({
	page,
}) => {
	await page.goto("/en-BE/");

	await page.getByRole("button", { name: "Book Appointment" }).first().click();

	const dialog = page.getByRole("dialog", { name: "Book Appointment" });
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAttribute("aria-modal", "true");
	await expect(dialog.getByTitle("Booking Widget")).toHaveCount(1);

	await dialog.getByRole("button", { name: "Close" }).first().click();
	await expect(dialog).toBeHidden();
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

		const openMenuButton = page.getByRole("button", { name: "Open menu" });
		await expect(openMenuButton).toBeVisible();

		await openMenuButton.click();

		await expect(
			page.getByRole("button", { name: "Close menu" }),
		).toBeVisible();
		await expect(openMenuButton).toBeHidden();

		await page.getByRole("button", { name: "Close menu" }).click();

		await expect(openMenuButton).toBeVisible();
	});
});
