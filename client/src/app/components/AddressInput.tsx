import { useCallback, useRef } from 'react';

interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
}

export function AddressInput({ value, onChange, placeholder, className }: AddressInputProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setInputRef = useCallback((input: HTMLInputElement | null) => {
    if (!input || !window.google || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
      types: ['establishment', 'geocode'],
      fields: ['formatted_address', 'name', 'place_id']
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      const address = place?.formatted_address || place?.name || '';
      if (input) {
        input.value = address;
      }
      onChangeRef.current(address);
    });
  }, []);

  return (
    <input
      ref={setInputRef}
      type="text"
      defaultValue={value}
      onChange={(e) => onChangeRef.current(e.target.value)}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    />
  );
}