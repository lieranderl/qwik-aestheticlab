import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { useServicesLoader } from "~/routes/layout";
import type { Service } from "~/types";
import AOS from "aos";

export default component$(() => {
  const servicesSignal = useServicesLoader();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Sort services by price in ascending order
  const sortedServices = [...servicesSignal.value].sort(
    (a: Service, b: Service) => a.price - b.price
  );

  const isAosInitialized = useSignal(false);

	useOnDocument(
		"DOMContentLoaded",
		$(() => {
			if (!isAosInitialized.value) {
				AOS.init({
					duration: 1000,
					once: false,
					disable: window.innerWidth < 768,
				});
				isAosInitialized.value = true;
			}
		}),
	);

  return (
    <section id="services" class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-qestero text-center mb-12">
          Our Services
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedServices.map((service: Service) => (
            <div key={service.id} class="p-8 rounded-lg bg-base-100" data-aos="fade-up">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-2xl font-serif  capitalize">
                  {service.name}
                </h3>
                <div class=" font-semibold ">
                  {formatPrice(service.price)}
                </div>
              </div>
              <p class=" mb-4">{service.description}</p>
              <div class="text-sm font-inter">
                Duration: {service.duration} minutes
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
