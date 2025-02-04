import { component$ } from "@builder.io/qwik";
import { useServicesLoader } from "~/routes/layout";
import type { Service } from "~/types";
import { formatPrice } from "~/consts";

export default component$(() => {
  const servicesSignal = useServicesLoader();

  return (
    <section id="services" class="py-20 bg-base-200">
      <div class="custom-container">
        <h2 class="text-4xl font-qestero text-center mb-12 font-bold">
          Our Services
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesSignal.value.map((service: Service) => (
            <div key={service.id} class="p-4 rounded-lg bg-base-100" data-aos="fade-up">
              <div class="collapse collapse-arrow ">
                <input type="checkbox" />
                <div class="collapse-title ">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-serif  capitalize">
                      {service.name}
                    </h3>
                    <div class=" font-semibold ">
                      {formatPrice(service.price)}
                    </div>
                  </div>
                </div>
                <div class="collapse-content text-sm">
                  {service.description}
                </div>
              </div>

              <div class="text-sm font-inter text-end me-4">
                Duration: {service.duration} minutes
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
