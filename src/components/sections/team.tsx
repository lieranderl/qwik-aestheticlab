import { component$ } from '@builder.io/qwik';
import { useTechniciansLoader } from '~/routes/layout';

interface WorkingHours {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface Technician {
  id: string;
  name: string;
  photo_url: string;
  email: string;
  calendar_id: string;
  services: string[];
  working_hours: WorkingHours;
  created_at: string;
  active: boolean;
  about: string;
  role: string;
}

export default component$(() => {
  const techniciansSignal = useTechniciansLoader();

  return (
    <section id="team" class="py-20 bg-sage-50">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-serif text-center text-sage-800 mb-12">
          Meet Our Team
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techniciansSignal.value.map((tech: Technician) => (
            <div key={tech.id} class="text-center">
              <div class="w-36 h-36 mx-auto rounded-full mb-4 overflow-hidden">
                <img 
                  src={tech.photo_url} 
                  alt={tech.name}
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="text-xl font-serif text-sage-800 mb-2">{tech.name}</h3>
              <p class="text-sage-600 mb-4 capitalize">{tech.role || 'Technician'}</p>
              {tech.about && (
                <p class="text-sage-600 text-sm leading-relaxed">
                  {tech.about}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});