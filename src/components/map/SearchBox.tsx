// src/components/searchBox.tsx
import React, { useState } from 'react';

interface SearchBoxProps {
  defaultValue: string;
  onSelectAddress: (address: string, latitude: number, longitude: number) => void;
}

const mockAddresses = [
  { address: 'Brussels Central, 1000 Brussels', latitude: 50.8503, longitude: 4.3517 },
  { address: 'Parc de Bruxelles, 1000 Brussels', latitude: 50.8452, longitude: 4.3571 },
  { address: 'Royal Museums of Fine Arts', latitude: 50.8549, longitude: 4.3756 },
  { address: 'Rue des Bouchers, 1000 Brussels', latitude: 50.8476, longitude: 4.3527 }
];

export const SearchBox: React.FC<SearchBoxProps> = ({ defaultValue, onSelectAddress }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<typeof mockAddresses>([]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (value.length > 1) {
      const filtered = mockAddresses.filter((place) =>
        place.address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place: (typeof mockAddresses)[0]) => {
    setInputValue(place.address);
    setSuggestions([]);
    onSelectAddress(place.address, place.latitude, place.longitude);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for an address"
        className="p-2 border border-gray-300 w-full rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded z-10">
          {suggestions.map((place) => (
            <li
              key={place.address}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(place)}>
              {place.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
