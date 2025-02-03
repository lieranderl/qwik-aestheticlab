import { component$ } from "@builder.io/qwik";
import { useTechniciansLoader } from "~/routes/layout";
import type { Technician } from "~/types";


export default component$(() => {
  const techniciansSignal = useTechniciansLoader();

  return (
    <section id="team" class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-qestero text-center mb-12">Meet Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techniciansSignal.value.map((tech: Technician) => (
            <div key={tech.id} class="text-center">
              <div class="avatar">
                <div class="w-32 rounded-full">
                  <img src={tech.photo_url} alt={tech.name} />
                </div>
              </div>
              <h3 class="text-xl  mb-2">{tech.name}</h3>
              <p class=" mb-4 capitalize font-inter">
                {tech.role || "Technician"}
              </p>
              {tech.about && (
                <p class="text-sm leading-relaxed text-left font-inter">{tech.about}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
