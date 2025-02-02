import { component$ } from '@builder.io/qwik';

export interface ContactFormProps {
  name: string;
  email: string;
  phone: string;
  onNameChange$: (value: string) => void;
  onEmailChange$: (value: string) => void;
  onPhoneChange$: (value: string) => void;
}

export default component$<ContactFormProps>(({
  name,
  email,
  phone,
  onNameChange$,
  onEmailChange$,
  onPhoneChange$
}) => {
  return (
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-sage-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onInput$={(e) => onNameChange$((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-sage-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400"
          required
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-sage-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onInput$={(e) => onEmailChange$((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-sage-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400"
          required
        />
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-sage-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onInput$={(e) => onPhoneChange$((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-sage-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400"
          required
        />
      </div>
    </div>
  );
});