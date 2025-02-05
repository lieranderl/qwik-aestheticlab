import { component$ } from "@builder.io/qwik";
import { useTechniciansLoader } from "~/routes/layout";
import type { Technician } from "~/types";

export default component$(() => {
  const techniciansSignal = useTechniciansLoader();

  return (
    <section id="team" class="py-20 bg-base-200">
      <div class="custom-container">
        <h2 class="text-4xl font-qestero text-center mb-12 font-bold">Meet Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {techniciansSignal.value.map((tech: Technician) => (
            <div key={tech.id} class="card bg-base-100" data-aos="fade-up">
              <div class="card-body">
                <div class="avatar justify-center">
                  <div class="w-32 rounded-full">
                    <img
                      src={tech.photo_url}
                      alt={tech.name}
                      width={128}
                      height={128}
                    />
                  </div>
                </div>
                {tech.about && (
                  <div class="collapse collapse-arrow bg-base-100 " data-aos="fade-up">
                    <input type="checkbox" />
                    <div class="collapse-title ">
                      <p class="text-xl">{tech.name}</p>
                      <p class="font-inter badge badge-soft badge-info mb-4">
                        {tech.role || "Technician"}
                      </p>
                    </div>
                    <div class="collapse-content text-sm">{tech.about}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
