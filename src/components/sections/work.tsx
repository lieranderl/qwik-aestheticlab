import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <section id="work" class="py-20 bg-cream">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-qestero text-center text-sage-800 mb-12">
          Our Work
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} class="aspect-square bg-sage-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
});