import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { HiEnvelopeOutline, HiPhoneOutline, HiUserOutline } from "@qwikest/icons/heroicons";

export interface ContactFormInputsProps {
  nameSignal: Signal<string>;
  emailSignal: Signal<string>;
  phoneSignal: Signal<string>;
  showConfirmationPanelSignal: Signal<boolean>;
}

export const ContactFormInputs = component$<ContactFormInputsProps>(
  ({ nameSignal, emailSignal, phoneSignal, showConfirmationPanelSignal }) => {
    return (
      <>
        <div>
          <label class="input validator w-full">
            <HiUserOutline class="text-primary w-4 h-4" />
            <input
              name="name"
              type="text"
              placeholder="Enter you name..."
              pattern="^[a-zA-Z\s]{2,50}$"
              required
              bind:value={nameSignal}
              disabled={showConfirmationPanelSignal.value}
            />
          </label>
          <div class="validator-hint hidden">Please enter your name</div>
        </div>
        <div>
          <label class="input validator w-full">
            <HiEnvelopeOutline class="text-primary w-4 h-4" />
            <input
              name="email"
              type="email"
              placeholder="mail@site.com"
              required
              bind:value={emailSignal}
              disabled={showConfirmationPanelSignal.value}
            />
          </label>
          <div class="validator-hint hidden">
            Please enter valid email address
          </div>
        </div>
        <div>
          <label class="input validator w-full">
            <HiPhoneOutline class="text-primary w-4 h-4" />
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number..."
              required
              pattern="^\+?[0-9\-\s]{10,15}$"
              bind:value={phoneSignal}
              disabled={showConfirmationPanelSignal.value}
            />
          </label>
          <div class="validator-hint hidden">
            Please enter valid phone number
          </div>
        </div>
      </>
    );
  }
);
