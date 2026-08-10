import { test, expect } from "@playwright/test";

test("pricelist page loads without crashing", async ({ page }) => {
	await page.goto("/en-BE/pricelist");

	await expect(page).toHaveURL(/\/en-BE\/pricelist\/?$/);
	await expect(page.locator("main")).toBeVisible({ timeout: 15000 });
});
