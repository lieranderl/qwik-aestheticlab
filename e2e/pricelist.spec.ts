import { test, expect } from "@playwright/test";

test("renders the pricelist page with heading and CTA", async ({ page }) => {
	await page.goto("/en-BE/pricelist");

	await expect(page).toHaveURL(/\/en-BE\/pricelist\/?$/);
	await expect(
		page.getByRole("heading", { name: "Services & Pricing", level: 1 }),
	).toBeVisible({ timeout: 15000 });
	await expect(
		page.getByRole("button", { name: "Book Appointment" }),
	).toBeVisible({ timeout: 15000 });
});
