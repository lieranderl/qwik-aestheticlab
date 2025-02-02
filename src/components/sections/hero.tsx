import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <section id="home" class="relative min-h-screen flex items-center justify-center bg-[#8b9687] pt-16">
      <div class="container mx-auto text-center px-4">
        <img src="/AestheticLab.svg" alt="Aesthetic Lab" class="w-64 md:w-80 mx-auto mb-8" />
        <p class="text-xl md:text-2xl text-cream mb-8 font-light">
          Where beauty meets artistry
        </p>
        <a 
          href="/booking" 
          class="inline-block bg-cream text-[#8b9687] px-8 py-3 rounded-full text-lg hover:bg-cream/90 transition-colors"
        >
          Book Your Visit
        </a>
      </div>
    </section>
  );
});