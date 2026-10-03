import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
	HiArrowPathMini,
	HiPauseMini,
	HiPlayMini,
} from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import {
	getVideoState,
	toggleVideo,
	type VideoState,
} from "~/shared/video-playback";

interface InViewVideoProps {
	/** Links the clip to its VideoControl. */
	id: string;
	src: string;
	/** The clip's first frame, so playback starts without any visible jump. */
	poster: string;
	label: string;
	class?: string;
	/** "auto" for the hero, which is on screen at load. */
	preload?: "auto" | "metadata";
}

/**
 * A short, silent clip that plays once when it scrolls into view and then
 * rests on its last frame. It pauses while scrolled out of view. It never loops and never plays by itself with
 * reduced motion. Clicking it pauses, resumes or replays it; the keyboard
 * path is its VideoControl.
 */
export const InViewVideo = component$<InViewVideoProps>(
	({ id, src, poster, label, class: className, preload = "metadata" }) => {
		const videoRef = useSignal<HTMLVideoElement>();

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Playback needs the element and IntersectionObserver.
		useVisibleTask$(({ cleanup }) => {
			const video = videoRef.value;
			if (
				!video ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches
			) {
				return;
			}
			let started = false;
			let pausedOffscreen = false;
			const observer = new IntersectionObserver(
				(entries) => {
					const visible = entries[0]?.isIntersecting;
					if (visible && (!started || pausedOffscreen)) {
						started = true;
						pausedOffscreen = false;
						video.muted = true;
						// Autoplay can be refused (e.g. low-power mode); the poster then stays.
						video.play().catch(() => undefined);
					} else if (!visible && !video.paused) {
						// Off screen: stop decoding so scrolling stays smooth; resume on return.
						pausedOffscreen = true;
						video.pause();
					}
				},
				{ threshold: 0.4 },
			);
			observer.observe(video);
			cleanup(() => observer.disconnect());
		});

		return (
			<video
				id={id}
				ref={videoRef}
				src={src}
				poster={poster}
				muted
				playsInline
				preload={preload}
				aria-label={label}
				onClick$={$(() => {
					if (videoRef.value) toggleVideo(videoRef.value);
				})}
				class={["cursor-pointer", className]}
			/>
		);
	},
);

interface VideoControlProps {
	/** The InViewVideo's id. */
	videoId: string;
	/** Short name added to the button label when a page has several clips. */
	name?: string;
	class?: string;
}

/**
 * Pause, play and replay button for an InViewVideo (WCAG 2.2.2: moving
 * content longer than five seconds needs a way to stop it).
 */
export const VideoControl = component$<VideoControlProps>(
	({ videoId, name, class: className }) => {
		const t = inlineTranslate();
		const state = useSignal<VideoState>("paused");
		const labels: Record<VideoState, string> = {
			playing: t("app.video.pause@@Pause video"),
			paused: t("app.video.play@@Play video"),
			ended: t("app.video.replay@@Replay video"),
		};
		const label = name
			? `${labels[state.value]}: ${name}`
			: labels[state.value];

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Follows the video element's playback events.
		useVisibleTask$(({ cleanup }) => {
			const video = document.getElementById(videoId);
			if (!(video instanceof HTMLVideoElement)) return;
			function sync() {
				if (video instanceof HTMLVideoElement) {
					state.value = getVideoState(video);
				}
			}
			const events = ["play", "playing", "pause", "ended"] as const;
			for (const event of events) video.addEventListener(event, sync);
			sync();
			cleanup(() => {
				for (const event of events) video.removeEventListener(event, sync);
			});
		});

		return (
			<button
				type="button"
				aria-controls={videoId}
				aria-label={label}
				title={label}
				onClick$={() => {
					const video = document.getElementById(videoId);
					if (video instanceof HTMLVideoElement) toggleVideo(video);
				}}
				class={[
					// Translucent, not frosted: a backdrop blur over a playing video re-renders every frame.
					"flex size-11 cursor-pointer items-center justify-center border border-ink/15 bg-linen/60 text-ink/80 transition-colors duration-300 ease-(--ease-smooth) hover:bg-linen/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none",
					className,
				]}
			>
				{state.value === "playing" ? (
					<HiPauseMini class="size-5" aria-hidden="true" />
				) : state.value === "ended" ? (
					<HiArrowPathMini class="size-5" aria-hidden="true" />
				) : (
					<HiPlayMini class="size-5" aria-hidden="true" />
				)}
			</button>
		);
	},
);
