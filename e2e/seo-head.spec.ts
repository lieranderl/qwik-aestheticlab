import { expect, test } from "@playwright/test";

test("uses production canonical and localized alternate URLs", async ({
	page,
}) => {
	await page.goto("/fr-BE/pricelist/?campaign=ignored#booking");

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://aestheticlab.be/fr-BE/pricelist/",
	);
	await expect(
		page.locator('link[rel="alternate"][hreflang="en-BE"]'),
	).toHaveAttribute("href", "https://aestheticlab.be/en-BE/pricelist/");
	await expect(
		page.locator('link[rel="alternate"][hreflang="fr-BE"]'),
	).toHaveAttribute("href", "https://aestheticlab.be/fr-BE/pricelist/");
	await expect(
		page.locator('link[rel="alternate"][hreflang="x-default"]'),
	).toHaveAttribute("href", "https://aestheticlab.be/en-BE/pricelist/");
	await expect(page.locator('link[rel="alternate"]')).toHaveCount(6);
});

test("returns not found for unsupported or nested locale captures", async ({
	request,
}) => {
	for (const path of ["/de-BE/", "/en-BE/unknown-page/"]) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(404);
	}
});
