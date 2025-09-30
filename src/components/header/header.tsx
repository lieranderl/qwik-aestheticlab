import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import {
  type InlineTranslateFn,
  inlineTranslate,
  localizePath,
  type SpeakLocale,
  useSpeakLocale,
} from "qwik-speak";
import { Booking } from "../booking-modal";
import { ChangeLocale } from "../change-locale";

const NAV_LINKS = (t: InlineTranslateFn, locale: SpeakLocale) => {
  const getPath = localizePath();
  return [
    { href: getPath("/#home", locale.lang), text: t("app.nav.home@@Home") },
    {
      href: getPath("/#services", locale.lang),
      text: t("app.nav.services@@Services"),
    },

    { href: getPath("/#team", locale.lang), text: t("app.nav.team@@Team") },
    {
      href: getPath("/#policy", locale.lang),
      text: t("app.nav.policy@@Policy"),
    },
    { href: getPath("/#work", locale.lang), text: t("app.nav.work@@Work") },
    { href: getPath("/#about", locale.lang), text: t("app.nav.about@@About") },
    {
      href: getPath("/#contact", locale.lang),
      text: t("app.nav.contact@@Contact"),
    },
  ];
};

export default component$(() => {
  const isMenuOpen = useSignal(false);
  const menuRef = useSignal<HTMLDivElement>();
  const buttonRef = useSignal<HTMLButtonElement>();
  const t = inlineTranslate();
  const locale = useSpeakLocale();

  // Memoized click handler
  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

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
      <nav class="py-2 mx-4 xl:mx-8">
        <div class="flex items-center justify-between h-12 w-full">
          {/* Left spacer */}
          <div class="flex-1" />

          {/* Center Booking (mobile only) */}
          <div class="flex justify-center flex-1 xl:hidden">
            <Booking
              id="modal_location_header"
              text={t("app.book.book_now@@Book Now")}
              classes="btn text-nowrap"
              location="372146"
            />
          </div>

          {/* Desktop Navigation (center) */}
          <div class="hidden xl:flex flex-1 items-center justify-center space-x-6">
            {NAV_LINKS(t, locale).map(({ href, text }) => (
              <a
                key={href}
                href={href}
                class="link no-underline text-base-100 hover:text-base-100/50 transition-colors text-nowrap"
              >
                {text}
              </a>
            ))}
          </div>

          {/* Right side: booking (desktop), locale + menu */}
          <div class="flex items-center gap-2 flex-1 justify-end">
            {/* Desktop Booking */}
            <div class="hidden xl:block">
              <Booking
                id="modal_location_header"
                text={t("app.book.book_now@@Book Now")}
                classes="btn text-nowrap"
                location="372146"
              />
            </div>

            <ChangeLocale />

            <button
              type="button"
              ref={buttonRef}
              onClick$={toggleMenu}
              class="xl:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <div class="w-6 h-5 relative flex flex-col justify-between">
                <span
                  class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${
                    isMenuOpen.value ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${
                    isMenuOpen.value ? "opacity-0" : ""
                  }`}
                />
                <span
                  class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${
                    isMenuOpen.value ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* --- Mobile Navigation --- */}
        <div
          ref={menuRef}
          class={`xl:hidden ${isMenuOpen.value ? "block" : "hidden"} p-2`}
        >
          <div class="flex flex-col space-y-3 items-end">
            {NAV_LINKS(t, locale).map(({ href, text }) => (
              <a
                key={href}
                href={href}
                onClick$={toggleMenu}
                class="link no-underline text-base-100 text-right hover:text-base-100/50 transition-colors text-nowrap"
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
});
