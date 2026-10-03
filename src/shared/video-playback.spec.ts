import { describe, expect, test, vi } from "vitest";
import { getVideoState, toggleVideo } from "./video-playback";

function fakeVideo(state: { paused: boolean; ended: boolean }) {
	return {
		...state,
		currentTime: 4.2,
		muted: false,
		play: vi.fn(() => Promise.resolve()),
		pause: vi.fn(),
	};
}

describe("video playback", () => {
	test("reports playing, paused and ended", () => {
		expect(getVideoState(fakeVideo({ paused: false, ended: false }))).toBe(
			"playing",
		);
		expect(getVideoState(fakeVideo({ paused: true, ended: false }))).toBe(
			"paused",
		);
		expect(getVideoState(fakeVideo({ paused: true, ended: true }))).toBe(
			"ended",
		);
	});

	test("pauses a playing clip", () => {
		const video = fakeVideo({ paused: false, ended: false });
		toggleVideo(video);
		expect(video.pause).toHaveBeenCalledOnce();
		expect(video.play).not.toHaveBeenCalled();
	});

	test("resumes a paused clip where it stopped", () => {
		const video = fakeVideo({ paused: true, ended: false });
		toggleVideo(video);
		expect(video.play).toHaveBeenCalledOnce();
		expect(video.currentTime).toBe(4.2);
		expect(video.muted).toBe(true);
	});

	test("plays an ended clip again from the start", () => {
		const video = fakeVideo({ paused: true, ended: true });
		toggleVideo(video);
		expect(video.currentTime).toBe(0);
		expect(video.play).toHaveBeenCalledOnce();
	});
});
