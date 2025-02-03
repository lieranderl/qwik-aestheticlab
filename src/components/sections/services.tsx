import { component$ } from "@builder.io/qwik";
import { useServicesLoader } from "~/routes/layout";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  created_at: string;
  active: boolean;
}

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

  return (
    <section id="services" class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-qestero text-center mb-12">
          Our Services
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedServices.map((service: Service) => (
            <div key={service.id} class="bg-neutral-100 p-8 rounded-lg">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-2xl font-serif  capitalize">
                  {service.name}
                </h3>
                <div class=" font-semibold text-neutral-content">
                  {formatPrice(service.price)}
                </div>
              </div>
              <p class="text-neutral-content mb-4">{service.description}</p>
              <div class="text-sm text-neutral-content">
                Duration: {service.duration} minutes
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
