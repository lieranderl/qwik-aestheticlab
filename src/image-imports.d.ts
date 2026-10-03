// vite-imagetools `as=srcset` imports (used for <picture> art direction).
declare module "*as=srcset" {
	const srcset: string;
	export default srcset;
}

// Plain asset URLs (videos and their posters).
declare module "*?url" {
	const url: string;
	export default url;
}
