import { $, component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { HiLanguageSolid } from '@qwikest/icons/heroicons';
import {
  useSpeakLocale,
  useSpeakConfig,
  useDisplayName,
  inlineTranslate,
  localizePath
} from 'qwik-speak';



export const ChangeLocale = component$(() => {
  const t = inlineTranslate();
  const pathname = useLocation().url.pathname;
  const locale = useSpeakLocale();
  const config = useSpeakConfig();
  const dn = useDisplayName();
  const getPath = localizePath();


  const humanreadble_lang = (lang: string) => {
    const displayName = dn(lang, { type: 'language' });
    const displayNameWithoutParentheses = displayName.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    const capitalizedDisplayName = displayNameWithoutParentheses.charAt(0).toUpperCase() + displayNameWithoutParentheses.slice(1);
    return capitalizedDisplayName;
  };

  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-primary mx-2 w-30">
        <HiLanguageSolid class="text-lg" /> {humanreadble_lang(locale.lang)}
      </label>
      <ul tabIndex={0} class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36 z-[1]">
        {config.supportedLocales.map(value => (
          <li key={value.lang}>
            <a
              href={getPath(pathname, value.lang)}
              class="w-full text-left"
            >
              {humanreadble_lang(value.lang)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
