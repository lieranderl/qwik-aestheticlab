import { component$ } from '@builder.io/qwik';

export interface DateSelectorProps {
  selectedDate: string;
  onDateChange$: (date: string) => void;
}

export default component$<DateSelectorProps>(({
  selectedDate,
  onDateChange$
}) => {
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div>
      <label for="date" class="block text-sm font-medium text-sage-700 mb-1">
        Select Date
      </label>
      <input
        type="date"
        id="date"
        name="date"
        min={getMinDate()}
        value={selectedDate}
        onChange$={(e) => onDateChange$((e.target as HTMLInputElement).value)}
        class="w-full px-4 py-2 border border-sage-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400"
        required
      />
    </div>
  );
});