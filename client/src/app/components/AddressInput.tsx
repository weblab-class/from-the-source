import { useCallback, useRef } from 'react';

type PlacePayload = {
  address: string;
  name: string;
  placeId: string;
  city: string;
  lat?: number;
  lng?: number;
};

interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onPlaceSelected?: (place: PlacePayload) => void;
  placeholder?: string;
  className?: string;
}

function getCityFromComponents(components?: google.maps.GeocoderAddressComponent[]) {
  if (!components) return '';

  const pick = (type: string) =>
    components.find(c => c.types?.includes(type))?.long_name || '';

  return (
    pick('locality') ||
    pick('postal_town') ||
    pick('administrative_area_level_2') ||
    ''
  );
}

export function AddressInput({ value, onChange, onPlaceSelected, placeholder, className }: AddressInputProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  const onPlaceSelectedRef = useRef(onPlaceSelected);

  onChangeRef.current = onChange;
  onPlaceSelectedRef.current = onPlaceSelected;

  const setInputRef = useCallback((input: HTMLInputElement | null) => {
    if (!input || !window.google || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
      types: ['establishment', 'geocode'],
      fields: ['formatted_address', 'name', 'place_id', 'address_components', 'geometry'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      const address = place?.formatted_address || place?.name || '';
      const name = place?.name || '';
      const placeId = place?.place_id || '';
      const city = getCityFromComponents(place?.address_components);

      const lat = place?.geometry?.location?.lat?.();
      const lng = place?.geometry?.location?.lng?.();

      if (input) input.value = address;
      onChangeRef.current(address);

      if (onPlaceSelectedRef.current && placeId) {
        onPlaceSelectedRef.current({ address, name, placeId, city, lat, lng });
      }
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