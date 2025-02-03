import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <section id="about" class="py-20 bg-sage-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-4xl font-qestero text-sage-800 mb-8">Our Story</h2>
          <p class="text-sage-700 text-lg mb-8 leading-relaxed">
            At Aesthetic Lab, we believe in the transformative power of beauty.
            Our approach combines artistry with expertise, creating a sanctuary
            where you can discover your most radiant self.
          </p>
        </div>
      </div>
    </section>
  );
});
