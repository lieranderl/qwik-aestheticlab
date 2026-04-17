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

	await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute(
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
