// src/components/searchBox.tsx
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { ReviewAddress } from '@/types/review';
import { useOverallReviews } from '@/hooks/useOverallReviews';

interface SearchBoxProps {
  defaultValue: string;
  onSelectAddress: (address: string, latitude: number, longitude: number) => void;
}

const mockAddresses: ReviewAddress[] = [
  { address: 'Brussels Central, 1000 Brussels', latitude: 50.8503, longitude: 4.3517 },
  { address: 'Parc de Bruxelles, 1000 Brussels', latitude: 50.8452, longitude: 4.3571 },
  { address: 'Royal Museums of Fine Arts', latitude: 50.8549, longitude: 4.3756 },
  { address: 'Rue des Bouchers, 1000 Brussels', latitude: 50.8476, longitude: 4.3527 }
];

export const SearchBox: React.FC<SearchBoxProps> = ({ defaultValue, onSelectAddress }) => {
  // TODO: should be searchabale for all places
  const { data:reviews, isLoading } = useOverallReviews();

  const mockAddresses: ReviewAddress[] = reviews?.map((review) => ({
    address: `${review.metadata.country}, ${review.metadata.region}`,
    latitude: review.metadata.latitude,
    longitude: review.metadata.longitude
  })) || [];

  // console.log(mockAddresses);
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
    <div className="relative w-[600px] flex self-center z-10">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for an address"
        className="bg-black/50 shadow-lg rounded-sm text-slate-300 placeholder:text-slate-300 border-t-0 border-r-0 border-l-0"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 text-slate-300 border border-gray-300 mt-10 bg-black/50 rounded z-10">
          {suggestions.map((place) => (
            <li
              key={place.address}
              className="p-2 hover:bg-slate-800 cursor-pointer"
              onClick={() => handleSelect(place)}>
              {place.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
