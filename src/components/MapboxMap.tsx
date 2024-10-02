import React, { useRef, useState } from 'react';
import ReactMapGL, { Marker, MapRef, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocalState } from '@/hooks/useLocalStorage'; // Assuming this is implemented for local state persistence
import { SearchBox } from '@/components/map/SearchBox'; // Assuming the search functionality is implemented
import { MapReview, MapReviews } from '@/types/review'; // Mock reviews data type
import { MapPinCheckIcon, XIcon } from 'lucide-react';
import { PopupContent } from './map/PopupContent';
import { Dialog, DialogContent, DialogHeader } from './ui/DialogShad';

interface IProps {
  setDataBounds: (bounds: string) => void;
  reviews: MapReview[];
  highlightedId: string | null;
}

export default function Map({ setDataBounds, highlightedId }: IProps) {
  const [selected, setSelected] = useState<MapReview | null>(null);
  const mapRef = useRef<MapRef | null>(null); // Ref for the map instance
  const [viewState, setViewState] = useLocalState<ViewState>('viewState', {
    latitude: 50.8503, // Brussels default
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

  const handleMoveEnd = () => {
    if (mapRef.current && mapRef.current.getMap) {
      const bounds = mapRef.current.getMap()?.getBounds();
      if (bounds) {
        setDataBounds(JSON.stringify(bounds.toArray()));
      }
    }
  };

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)} // onMove handles viewState changes
        onMoveEnd={handleMoveEnd} // Replacing deprecated onInteractionStateChange
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        style={{ width: '100%', height: '120vh' }} // Custom map sizing
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/mapbox/dark-v11">
        {/* Search Box for searching addresses */}
        <div className="absolute top-0 w-full z-10 p-4">
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
                handleMoveEnd(); // Trigger bounds update after selection
              }
            }}
          />
        </div>

        {/* Map Markers for reviews */}
        {MapReviews.map((review) => (
          <Marker
            key={review.id}
            latitude={review.latitude}
            longitude={review.longitude}
            className={highlightedId === review.id ? 'marker-active' : ''}>
            <button
              style={{ width: '30px', height: '30px', fontSize: '30px' }}
              type="button"
              onClick={() => setSelected(review)}>
              <MapPinCheckIcon className="text-red-600" />
            </button>
          </Marker>
        ))}

        {/* Popup for selected review */}
        {selected && (
          <Dialog
            open={!!selected}
            onOpenChange={() => setSelected(null)}
            closeOnOverlayClick={false}>
            <DialogContent className="bg-gradient-to-br from-primary to-white">
              <DialogHeader className="flex justify-end items-end">
                <button
                  className="text-white bg-transparent hover:text-red-500 transition-colors"
                  onClick={() => setSelected(null)}>
                  <XIcon className="h-6 w-6 self-end" />
                </button>
              </DialogHeader>
              <PopupContent
                title={`${selected.country.toUpperCase()} Review`}
                content={selected.content}
                rating={selected.rating}
                onClick={() => console.log('Details clicked')}
              />
            </DialogContent>
          </Dialog>
        )}
      </ReactMapGL>
    </div>
  );
}
