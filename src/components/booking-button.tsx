import { component$ } from "@builder.io/qwik";

interface BookingBtnProps {
  additionalClasses?: string;
  myText?: string;
}

export const BookingBtn = component$<BookingBtnProps>(
  ({ additionalClasses = "", myText = "Book Now" }) => {
    return (
      <button
        type="button"
        class={`btn ${additionalClasses}`}
        onClick$={() => {
          window.location.href = "/booking/";
        }}
      >
        {myText}
      </button>
    );
  }
);
