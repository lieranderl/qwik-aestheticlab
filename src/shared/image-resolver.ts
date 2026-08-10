type ImageComponent =
	typeof import("~/media/gallery/universal.jpg?jsx").default;

const GALLERY_IMAGES = import.meta.glob("../media/gallery/*.jpg", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, ImageComponent>;

const SERVICE_IMAGES = import.meta.glob("../media/services/*.webp", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, ImageComponent>;

const TEAM_IMAGES = import.meta.glob("../media/*.jpg", {
	eager: true,
	query: "?jsx",
	import: "default",
}) as Record<string, ImageComponent>;

const IMAGE_COMPONENTS = new Map<string, ImageComponent>([
	...Object.entries(GALLERY_IMAGES).map(
		([path, component]) =>
			[`gallery:${path.split("/").at(-1)}`, component] as const,
	),
	...Object.entries(SERVICE_IMAGES).map(
		([path, component]) =>
			[`service:${path.split("/").at(-1)}`, component] as const,
	),
]);

const TEAM_COMPONENTS = new Map(
	Object.entries(TEAM_IMAGES).map(([path, component]) => {
		const filename =
			path
				.split("/")
				.at(-1)
				?.replace(/\.jpg$/i, "") ?? "";
		return [filename, component] as const;
	}),
);

export function resolveImageComponent(image: string) {
	return IMAGE_COMPONENTS.get(image) ?? null;
}

export function resolveTeamImage(image: string) {
	if (!image) return null;
	const imageName = image.replace(/\.jpg$/i, "");
	return TEAM_COMPONENTS.get(imageName) ?? null;
}
