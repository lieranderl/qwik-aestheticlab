import { expect, test } from "@playwright/test";

test("pricelist renders categories, localized prices, and booking actions", async ({
	page,
}) => {
	await page.goto("/en-BE/pricelist");

	await expect(page).toHaveURL(/\/en-BE\/pricelist\/?$/);
	await expect(
		page.getByRole("heading", { name: "Pricing & duration" }),
	).toBeVisible({ timeout: 15000 });
	await expect(page.locator('[id^="pricing-category-"]').first()).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Book now" }).first(),
	).toBeVisible();
	await expect(page.locator("main")).toContainText("€50");
});
