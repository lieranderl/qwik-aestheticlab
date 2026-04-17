import { test, expect } from "@playwright/test";

test("has title and navigates to correct prefix", async ({ page }) => {
	await page.goto("/");
	// Qwik apps typically redirect to /[lang]/ if generic path is hit
	await expect(page).toHaveURL(/.*\/[a-z]{2}-[A-Z]{2}\/.*/);
	// Basic check that the page loaded successfully
	await expect(page.locator("body")).toBeVisible();
});
