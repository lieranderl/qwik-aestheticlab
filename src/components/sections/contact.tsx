import { component$ } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";

export default component$(() => {
  return (
    <section id="contact" class="py-20 bg-sage-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl font-qestero text-center text-sage-800 mb-12">
            Visit Us
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-2xl font-serif text-sage-800 mb-4">Hours</h3>
              <ul class="space-y-2 text-sage-600">
                <li>Monday - Friday: 9:00 AM - 7:00 PM</li>
                <li>Saturday: 9:00 AM - 6:00 PM</li>
                <li>Sunday: 10:00 AM - 5:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 class="text-2xl font-serif text-sage-800 mb-4">Contact</h3>
              <ul class="space-y-2 text-sage-600">
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@aestheticlab.com</li>
                <li>Address: 123 Beauty Lane, Style City</li>
                <li class="flex items-center mt-4">
                  <a
                    href="https://instagram.com/aestheticlab"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-sage-600 hover:text-sage-800 transition-colors"
                  >
                    <SiInstagram class="w-6 h-6 mr-2" />
                    Follow us on Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
