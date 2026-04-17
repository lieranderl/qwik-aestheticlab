import { test, expect } from "@playwright/test";

test("renders the pricelist hero heading and booking CTA shell", async ({
	page,
}) => {
	await page.goto("/en-BE/pricelist");

	await expect(page).toHaveURL(/\/en-BE\/pricelist\/?$/);
	await expect(
		page.getByRole("heading", { level: 1, name: "Services & Pricing" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Book Your Visit" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Book Appointment" }),
	).toBeVisible();
});
