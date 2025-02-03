import { component$ } from "@builder.io/qwik";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";
import { BookingBtn } from "../booking-button";

export default component$(() => {
  return (
    <section
      id="home"
      class="relative min-h-screen flex items-center justify-center bg-primary pt-16"
    >
      <div class="container mx-auto text-center px-4">
        <ImgAestheticlab class="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8" />
        <p class="text-xl md:text-2xl text-base-100 mb-8 font-light">
          Where beauty meets artistry
        </p>
        <BookingBtn additionalClasses="btn-lg" myText={"Book Your Visit"} />
      </div>
    </section>
  );
});
