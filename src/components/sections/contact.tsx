import { component$ } from "@builder.io/qwik";
import {
  HiEnvelopeOutline,
  HiMapPinOutline,
  HiPhoneOutline,
} from "@qwikest/icons/heroicons";
import { SiInstagram } from "@qwikest/icons/simpleicons";

export default component$(() => {
  return (
    <section id="contact" class="py-20 bg-base-300">
      <div class="custom-container">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl font-qestero text-center mb-12 ">Visit Us</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 class="text-2xl mb-6 font-semibold">Hours</h3>
              <ul class="space-y-2 list-disc pl-6 text-lg">
                <li>Monday - Friday: 9:00 AM - 7:00 PM</li>
                <li>Saturday: 9:00 AM - 6:00 PM</li>
                <li>Sunday: 10:00 AM - 5:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 class="text-2xl mb-6 font-semibold ">Contact</h3>
              <ul class="space-y-2 list-none pl-6 text-lg">
                <li class="flex items-center gap-2">
                  <HiPhoneOutline />
                  <a href="tel:+32484123567" class=" hover:underline">
                    +32 484 123 567
                  </a>
                </li>
                <li class="flex items-center gap-2">
                  <HiEnvelopeOutline />
                  <a
                    href="mailto:info@aestheticlab.com"
                    class="hover:underline"
                  >
                    info@aestheticlab.com
                  </a>
                </li>
                <li class="flex items-center gap-2">
                  <HiMapPinOutline /> Somestraat 22, Leuven
                </li>
              </ul>
            </div>
          </div>

          {/* Centered Instagram Section */}
          <div class="mt-12 flex justify-center">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/aestheticlabbe/"
              class="link inline-flex items-center gap-2 text-lg font-inter hover:text-base-content/70 transition-colors"
            >
              <SiInstagram class="w-6 h-6" />
              Follow us on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
