import { component$ } from '@builder.io/qwik';

export interface StatusModalProps {
  isOpen: boolean;
  onClose$: () => void;
  status: 'success' | 'error';
  message?: string;
}

export default component$<StatusModalProps>(({
  isOpen,
  onClose$,
  status,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <div class="text-center">
          {status === 'success' ? (
            <div class="mb-4">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-xl font-serif text-sage-800 mt-4">
                Booking Successful!
              </h3>
              <p class="text-sage-600 mt-2">
                Your appointment has been confirmed. We look forward to seeing you!
              </p>
            </div>
          ) : (
            <div class="mb-4">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-xl font-serif text-sage-800 mt-4">
                Booking Failed
              </h3>
              <p class="text-red-600 mt-2">
                {message || 'An error occurred while booking your appointment. Please try again.'}
              </p>
            </div>
          )}
          
          <button
            onClick$={onClose$}
            class="w-full bg-sage-600 text-white px-6 py-2 rounded-full hover:bg-sage-700 transition-colors"
          >
            {status === 'success' ? 'Return to Home' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
});