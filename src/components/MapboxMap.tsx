'use client';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Marker, MapRef, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocalState } from '@/hooks/useLocalStorage';
import { SearchBox } from '@/components/map/SearchBox';
import { MapReview, Review } from '@/types/review';
import { MapPinCheckIcon } from 'lucide-react';
import PopupContent from './map/PopupContent';
import { Dialog, DialogContent } from './ui/DialogShad';
import { useReviewStore, useUserStore } from '@/zustand/store';
import Navbar from './Navbar';
import { useOverallReviews } from '@/hooks/useOverallReviews';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import mapboxgl from 'mapbox-gl';

interface IProps {
  setDataBounds: (bounds: string) => void;
  reviews: MapReview[];
  highlightedId: string | null;
}
const Map: React.FC<IProps> = ({ setDataBounds, highlightedId }) => {
  const { isLoading, data: totalReviews } = useOverallReviews();
  const { selectedReview } = useReviewStore();
  const { playerId } = useUserStore();
  const mapRef = useRef<MapRef | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewState, setViewState] = useLocalState<ViewState>('viewState', {
    latitude: 50.8503,
    longitude: 4.3517,
    zoom: 13,
    bearing: 2,
    pitch: 2,
    padding: {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2
    }
  });

  // New state for filters
  const [venueType, setVenueType] = useState<string>('');
  const [starRating, setStarRating] = useState<number | null>(null);
  const [showMyReviews, setShowMyReviews] = useState<boolean>(false);

  useEffect(() => {
    if (selectedReview) {
      setViewState((old) => ({
        ...old,
        latitude: selectedReview.metadata.latitude,
        longitude: selectedReview.metadata.longitude,
        zoom: 12
      }));
      setIsDialogOpen(false);
    } else {
      setViewState((old) => ({
        ...old,
        latitude: 50.8503,
        longitude: 4.3517,
        zoom: 13
      }));
    }
  }, [selectedReview, setViewState]);

  const handleMoveEnd = () => {
    if (mapRef.current && mapRef.current.getMap) {
      const bounds = mapRef.current.getMap()?.getBounds();
      if (bounds) {
        setDataBounds(JSON.stringify(bounds.toArray()));
      }
    }
  };

  // Filter reviews based on selected filters
  const filteredReviews = totalReviews?.filter((review: Review) => {
    if (venueType && review.placeCategory !== venueType) return false;
    // Updated logic to handle decimal ratings
    if (starRating && review.rating < starRating) return false;
    // Updated logic to check against globally stored playerId
    if (showMyReviews && review.playerId !== playerId) return false; // Assuming globalPlayerId is defined
    return true;
  });

  // Function to handle filter changes
  const applyFilters = () => {
    if (filteredReviews && filteredReviews.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      if (filteredReviews) {
        // Check if filteredReviews is defined
        filteredReviews.forEach((review: Review) => {
          bounds.extend([review.metadata.longitude, review.metadata.latitude]);
        });
      }
      mapRef.current?.getMap().fitBounds(bounds, { padding: 50 });
    }
  };
  const clearFilters = () => {
    setVenueType(''); // Reset venue type
    setStarRating(null); // Reset star rating
    setShowMyReviews(false); // Reset show my reviews
  };

  return (
    <div className="relative w-full h-screen">
      <ReactMapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onMoveEnd={handleMoveEnd}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        style={{ width: '100%', height: '100%', zIndex: 40 }}
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/mapbox/dark-v11">
        <div className="absolute top-0 right-0 w-full z-20 flex justify-between items-center p-4">
          <div className="flex justify-center w-full">
            <SearchBox
              defaultValue=""
              onSelectAddress={(_address, latitude, longitude) => {
                if (latitude && longitude) {
                  setViewState((old) => ({
                    ...old,
                    latitude,
                    longitude,
                    zoom: 12
                  }));
                }
              }}
            />
          </div>
          <Navbar />
        </div>

        {!isLoading &&
          filteredReviews &&
          filteredReviews.map((review: Review) => (
            <Marker
              key={review.id}
              latitude={review.metadata.latitude}
              longitude={review.metadata.longitude}
              className={highlightedId === review.id ? 'marker-active' : ''}>
              <button
                style={{ width: '30px', height: '30px', fontSize: '30px' }}
                type="button"
                onClick={() => setIsDialogOpen(true)}>
                <MapPinCheckIcon className="text-blue-600" />
              </button>
            </Marker>
          ))}

        {selectedReview && (
          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
            <DialogContent className="p-0">
              <PopupContent placeId={selectedReview.placeId} />
            </DialogContent>
          </Dialog>
        )}
        {/* Filter controls */}

        <div className="absolute bottom-0 left-0 right-0 bg-transparent p-4 flex justify-end gap-4 items-center">
          <Select onValueChange={(value) => setVenueType(value)} value={venueType}>
            <SelectTrigger className="w-[200px] bg-black/50 text-slate-300">
              <SelectValue placeholder="Type of venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="cafe">Cafe</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setStarRating(Number(value))}
            value={starRating?.toString() || ''}>
            <SelectTrigger className="w-[200px] bg-black/50 text-slate-300">
              <SelectValue placeholder="Star rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showMyReviews ? 'default' : 'outline'}
            onClick={() => setShowMyReviews(!showMyReviews)}>
            My reviews
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>

          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
