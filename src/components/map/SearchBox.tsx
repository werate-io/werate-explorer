// src/components/searchBox.tsx
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { ReviewAddress } from '@/types/review';
import { useOverallReviews } from '@/hooks/useOverallReviews';
import { SearchIcon } from 'lucide-react';
interface SearchBoxProps {
  defaultValue: string;
  onSelectAddress: (address: string, latitude: number, longitude: number) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ defaultValue, onSelectAddress }) => {
  // TODO: should be searchabale for all places
  const { data: reviews } = useOverallReviews();

  const mockAddresses: ReviewAddress[] =
    reviews?.map((review) => ({
      address: review.country,
      latitude: review.latitude,
      longitude: review.longitude
    })) || [];

  // console.log(mockAddresses);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<ReviewAddress[]>([]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (value.length >= 1) {
      const filtered = mockAddresses.filter((place) =>
        place.address.toLowerCase().includes(value.toLowerCase())
      );

      // Use a Set to filter out duplicates based on the address
      const uniqueSuggestions = Array.from(new Set(filtered.map((place) => place.address))).map(
        (address) => filtered.find((place) => place.address === address)
      );

      setSuggestions(
        uniqueSuggestions.filter(
          (suggestion): suggestion is ReviewAddress => suggestion !== undefined
        )
      );
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
      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by country code..."
        className="bg-black/50 shadow-lg rounded-sm text-purple-300 placeholder:text-purple-300 border-t-0 border-r-0 border-l-0 pl-10"
      />
      {/* TODO: add a search icon */}
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
