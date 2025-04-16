import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { localizePath, useSpeakLocale } from "qwik-speak";

interface BookingBtnProps {
	additionalClasses?: string;
	myText?: string;
}

export const BookingBtn = component$<BookingBtnProps>(
	({ additionalClasses = "", myText = "Book Now" }) => {
		const pathname = useLocation().url.pathname;
		const getPath = localizePath();
		const locale = useSpeakLocale();
		const localPath = getPath(pathname, locale.lang);
		return (
			<button
				type="button"
				class={`btn ${additionalClasses}`}
				onClick$={() => {
					window.location.href = `${localPath}booking/`;
				}}
			>
				{myText}
			</button>
		);
	},
);
