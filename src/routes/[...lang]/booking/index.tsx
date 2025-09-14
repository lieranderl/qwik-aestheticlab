import { $, component$, useOnDocument } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import AOS from "aos";
import Header from "~/components/header/header";
import "aos/dist/aos.css";
import { Footer } from "~/components/sections/footer";
import { ga } from "~/consts";

export default component$(() => {
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      AOS.init({
        duration: 800,
      });
    })
  );

  return (
    <>
      <div
        class="d-flex justify-content-center "
        style="min-height: calc(100vh - 160px);"
      >
        <iframe
          src="https://bookings.gettimely.com/aestheticlab2/bb/book?location=372146"
          id="timelyWidget"
          style="width: 100%; height: calc(100vh - 160px); border: none;"
        />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Best Manicure in Leuven | Aesthetic Lab",
  meta: [
    {
      name: "description",
      content:
        "Looking for expert nails and manicure in Leuven? Visit Aesthetic Lab for top-tier beauty & nail care.",
    },
  ],
  scripts: ga,
};
