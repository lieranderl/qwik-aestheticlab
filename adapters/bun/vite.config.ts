import { bunServerAdapter } from "@qwik.dev/router/adapters/bun-server/vite";
import { extendConfig } from "@qwik.dev/router/vite";
import baseConfig from "../../vite.config.ts";

export default extendConfig(baseConfig, () => {
	return {
		build: {
			ssr: true,
			rollupOptions: {
				input: ["src/entry.bun.ts", "@qwik-router-config"],
			},
			minify: true,
		},
		plugins: [bunServerAdapter({ ssg: null })],
	};
});
