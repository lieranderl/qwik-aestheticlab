export type VideoState = "playing" | "paused" | "ended";

type PlayableVideo = Pick<
	HTMLVideoElement,
	"paused" | "ended" | "currentTime" | "muted" | "play" | "pause"
>;

export function getVideoState(video: PlayableVideo): VideoState {
	if (video.ended) return "ended";
	return video.paused ? "paused" : "playing";
}

/**
 * One control for every clip: pauses a playing clip, resumes a paused one,
 * and plays an ended one again from the start.
 */
export function toggleVideo(video: PlayableVideo): void {
	const state = getVideoState(video);
	if (state === "playing") {
		video.pause();
		return;
	}
	if (state === "ended") video.currentTime = 0;
	video.muted = true;
	// Playback can be refused (e.g. low-power mode); the poster then stays.
	video.play().catch(() => undefined);
}
