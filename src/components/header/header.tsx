import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";

const navLinks = [
  { href: "/#home", text: "Home" },
  { href: "/#about", text: "About" },
  { href: "/#services", text: "Services" },
  { href: "/#team", text: "Team" },
  { href: "/#work", text: "Our Work" },
  { href: "/#contact", text: "Contact" },
];

export default component$(() => {
  const isMenuOpen = useSignal(false);
  const menuRef = useSignal<HTMLDivElement>();
  const buttonRef = useSignal<HTMLButtonElement>();

  // Handle click outside
  useOnDocument(
    "click",
    $((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen.value &&
        menuRef.value &&
        !menuRef.value.contains(target) &&
        buttonRef.value &&
        !buttonRef.value.contains(target)
      ) {
        isMenuOpen.value = false;
      }
    })
  );

  return (
    <header class="fixed w-full bg-[#8b9687]/90 backdrop-blur-sm z-50">
      <nav class="max-w-5xl mx-auto px-4 py-2">
        <div class="flex items-center justify-between h-12">
          <div class="flex items-center">
            {/* <a href="/" class="text-2xl font-serif text-cream">
              <ImgAestheticlab class="h-12 w-12" />
            </a> */}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            ref={buttonRef}
            onClick$={() => {
              isMenuOpen.value = !isMenuOpen.value;
            }}
            class="md:hidden text-cream p-2"
            aria-label="Toggle menu"
          >
            <div class="w-6 h-5 relative flex flex-col justify-between">
              <span
                class={`w-full h-0.5 bg-cream transition-all duration-300 ${isMenuOpen.value ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                class={`w-full h-0.5 bg-cream transition-all duration-300 ${isMenuOpen.value ? "opacity-0" : ""}`}
              />
              <span
                class={`w-full h-0.5 bg-cream transition-all duration-300 ${isMenuOpen.value ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="text-sm text-cream hover:text-cream/80 transition-colors"
              >
                {link.text}
              </a>
            ))}
            <a
              href="/booking"
              class="bg-cream text-[#8b9687] px-4 py-1.5 rounded-full text-sm hover:bg-cream/90 transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={menuRef}
          class={`md:hidden ${isMenuOpen.value ? "block" : "hidden"} pt-4 pb-2`}
        >
          <div class="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="text-sm text-cream hover:text-cream/80 transition-colors"
              >
                {link.text}
              </a>
            ))}
            <a
              href="/booking"
              class="bg-cream text-[#8b9687] px-4 py-1.5 rounded-full text-sm hover:bg-cream/90 transition-colors w-fit"
            >
              Book Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
});
