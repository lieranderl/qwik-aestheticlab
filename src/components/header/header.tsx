import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";

const navLinks = [
  { href: "/#home", text: "Home" },
  { href: "/#about", text: "About" },
  { href: "/#services", text: "Services" },
  { href: "/#team", text: "Team" },
  { href: "/#work", text: "Our Work" },
  { href: "/#contact", text: "Contact" },
];

const BookingBtn = component$(() => {
  return (
    <button
      type="button"
      class="btn btn-sm max-w-fit"
      onClick$={() => {
        window.location.href = "/booking/";
      }}
    >
      Book Now
    </button>
  );
});

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
    <header class="fixed w-full bg-primary/90 backdrop-blur-sm z-50">
      <nav class="max-w-5xl mx-auto px-4 py-2">
        <div class="flex items-center justify-between h-12">
          <div />
          {/* Desktop Navigation */}
          <div class="hidden md:flex flex-1 items-center justify-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="link no-underline text-base-100 hover:text-base-100/80 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
          <div class="hidden md:block">
            <BookingBtn />
          </div>
          {/* Mobile menu button */}
          <button
            type="button"
            ref={buttonRef}
            onClick$={() => {
              isMenuOpen.value = !isMenuOpen.value;
            }}
            class="md:hidden "
            aria-label="Toggle menu"
          >
            <div class="w-6 h-5 relative flex flex-col justify-between">
              <span
                class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "opacity-0" : ""}`}
              />
              <span
                class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={menuRef}
          class={`md:hidden ${isMenuOpen.value ? "block" : "hidden"} pt-4 pb-2`}
        >
          <div class="flex flex-col space-y-3 items-end">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="link no-underline text-base-100 text-right hover:text-base-100/80 transition-colors"
              >
                {link.text}
              </a>
            ))}
            <BookingBtn />
          </div>
        </div>
      </nav>
    </header>
  );
});
