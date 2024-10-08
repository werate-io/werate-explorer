'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL, { Marker, MapRef, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocalState } from '@/hooks/useLocalStorage';
import { SearchBox } from '@/components/map/SearchBox';
import { FlattenedReviews } from '@/types/review';
import { MapPinCheckIcon, MapPinIcon } from 'lucide-react';
import PopupContent from './map/PopupContent';
import { Dialog, DialogContent, DialogTitle } from './ui/DialogShad';
import { useReviewStore, useUserStore } from '@/zustand/store';
import { useOverallReviews } from '@/hooks/useOverallReviews';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import mapboxgl from 'mapbox-gl';
import Navbar from './Navbar';
import Supercluster, { AnyProps, PointFeature } from 'supercluster';

interface IProps {
  setDataBounds: (bounds: string) => void;
  highlightedId: string | null;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
}
const Map: React.FC<IProps> = ({ setDataBounds, isLeftSidebarOpen, isRightSidebarOpen }) => {
  const { isLoading, data: totalReviews } = useOverallReviews();
  const { selectedReview, setSelectedReview } = useReviewStore();
  const { playerId } = useUserStore();
  const mapRef = useRef<MapRef>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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

  /*   useEffect(() => {
    if (selectedReview) {
      setViewState((old) => ({
        ...old,
        latitude: selectedReview.latitude,
        longitude: selectedReview.longitude,
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
  }, [selectedReview, setViewState]); */

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    let timeoutId: NodeJS.Timeout;

    if (mapInstance && !isLeftSidebarOpen && !isRightSidebarOpen) {
      // Set a timeout to resize the map after the sidebar closes
      timeoutId = setTimeout(() => {
        mapInstance.resize();
      }, 300); // Adjust the timeout duration as needed
    }

    // Cleanup function to clear the timeout if the component unmounts or sidebar state changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLeftSidebarOpen, isRightSidebarOpen]);

  const handleMoveEnd = () => {
    if (mapRef.current && mapRef.current.getMap) {
      const bounds = mapRef.current.getMap()?.getBounds();
      if (bounds) {
        setDataBounds(JSON.stringify(bounds.toArray()));
      }
    }
  };

  // Filter reviews based on selected filters
  const filteredReviews = useMemo(() => {
    return totalReviews?.filter((review: FlattenedReviews) => {
      if (starRating && review.overall_rating < starRating) return false;
      if (showMyReviews && review.userId !== playerId) return false;
      return true;
    });
  }, [totalReviews, starRating, showMyReviews, playerId]);

  // Function to handle filter changes
  const applyFilters = () => {
    if (filteredReviews && filteredReviews.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      if (filteredReviews) {
        // Check if filteredReviews is defined
        filteredReviews.forEach((review: FlattenedReviews) => {
          bounds.extend([review.longitude, review.latitude]);
        });
      }
      mapRef.current?.getMap().fitBounds(bounds, { padding: 50 });
    }
    // Zoom out to world map
    setViewState((old) => ({
      ...old,
      zoom: 1 // Set zoom level to 1 for world view
    }));
  };
  const clearFilters = () => {
    setVenueType(''); // Reset venue type
    setStarRating(null); // Reset star rating
    setShowMyReviews(false); // Reset show my reviews
  };

  useEffect(() => {
    // Fetching or loading map data here
    if (filteredReviews) {
      setLoading(false); // Data is ready, stop loading
    }
  }, [filteredReviews]);

  // Create a memoized supercluster instance

  // Get clusters based on zoom and bounds
  const cluster = useMemo(() => {
    if (!filteredReviews || filteredReviews.length === 0) return null; // safeguard for empty reviews

    const supercluster = new Supercluster({
      radius: 40, // pixel radius for clustering
      maxZoom: 16 // max zoom to cluster points
    });

    const points: GeoJSON.Feature[] = filteredReviews.map((review) => ({
      // Specify the type for points
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [review.longitude, review.latitude]
      },
      properties: {
        ...review
      }
    }));

    const pointFeatures = points.filter(
      (point): point is PointFeature<AnyProps> => point.geometry.type === 'Point'
    );
    supercluster.load(pointFeatures);
    return supercluster;
  }, [filteredReviews]);

  const getClusters = useCallback(() => {
    if (!cluster || !mapRef.current) return []; // safeguard for undefined cluster or mapRef

    const bounds = mapRef.current?.getMap()?.getBounds();
    if (!bounds) return [];

    const zoom = Math.floor(viewState.zoom); // Ensure zoom is properly calculated
    const formattedBbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];

    return cluster.getClusters(formattedBbox, zoom); // Use the correct bbox format
  }, [viewState, cluster]);

  const clusters = useMemo(() => getClusters(), [viewState, getClusters]);

  // Memoized rendering for markers
  const renderMarkers = useCallback(() => {
    if (!clusters) return null; // Check if clusters is undefined
    return clusters.map((clusterData) => {
      const [longitude, latitude] = clusterData.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = clusterData.properties;

      if (isCluster) {
        return (
          <Marker key={`cluster-${clusterData.id}`} latitude={latitude} longitude={longitude}>
            <div
              className="relative flex items-center justify-center text-white font-bold"
              style={{
                cursor: 'pointer',
                width: `${30 + (pointCount / (filteredReviews?.length || 1)) * 5}px`
              }}
              onClick={() => {
                const expansionZoom = cluster
                  ? Math.min(cluster.getClusterExpansionZoom(clusterData.id as number) ?? 16, 16)
                  : 16; // Default value if cluster is null
                setViewState({
                  ...viewState,
                  latitude,
                  longitude,
                  zoom: expansionZoom
                });
              }}>
              {/* Map pin icon with a number inside it */}
              <MapPinIcon
                className="text-green-600"
                style={{
                  fontSize: `${30 + (pointCount / (filteredReviews?.length || 1)) * 5}px`,
                  position: 'relative'
                }}
              />
              {/* Display point count number in the middle */}
              <span className="absolute text-white text-sm">{pointCount}</span>
            </div>
          </Marker>
        );
      } else {
        return (
          <Marker key={clusterData.properties.reviewId} latitude={latitude} longitude={longitude}>
            <button
              onClick={() => {
                setIsDialogOpen(true);
                setSelectedReview(clusterData.properties as FlattenedReviews); // Type assertion
              }}>
              <MapPinCheckIcon className="text-green-600" />
            </button>
          </Marker>
        );
      }
    });
  }, [clusters, filteredReviews, viewState, cluster]);

  return (
    <div className="relative min-w-[100%] h-screen flex-1 flex-grow ">
      <ReactMapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onMoveEnd={handleMoveEnd}
        mapboxAccessToken={
          'pk.eyJ1Ijoid2VyYXRlZGV2IiwiYSI6ImNtMWk0amFhaDBraWUyc3F5ZHloamZmcHQifQ.Zk0bYw1S6YI1mAwTms2VTA'
        }
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 40,
          display: 'flex',
          flex: 1,
          flexGrow: 'inherit'
        }}
        minZoom={2}
        maxZoom={30}
        mapStyle="mapbox://styles/mapbox/dark-v11">
        <div className="absolute top-0 right-0 w-full z-50 flex justify-between items-center p-4">
          <div className="flex justify-end w-full">
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
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black opacity-75">
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}
        {!isLoading && renderMarkers()}
        {/* {!isLoading &&
          filteredReviews &&
          filteredReviews.map((review: FlattenedReviews) => (
            <Marker
              key={review.userId}
              latitude={review.latitude}
              longitude={review.longitude}
              className={highlightedId === review.userId ? 'marker-active' : ''}>
              <button
                style={{ width: '30px', height: '30px', fontSize: '30px' }}
                type="button"
                onClick={() => setIsDialogOpen(true)}>
                {showMyReviews ? (
                  <MapPinCheckIcon className="text-blue-600" />
                ) : (
                  <MapPinCheckIcon className="text-green-600" />
                )}
              </button>
            </Marker>
          ))} */}

        {selectedReview && selectedReview?.placeId && (
          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
            <VisuallyHidden>
              <DialogTitle>Review Details</DialogTitle>
            </VisuallyHidden>
            <DialogContent className="p-0">
              <PopupContent placeId={selectedReview.placeId} />
            </DialogContent>
          </Dialog>
        )}
        {/* Filter controls */}

        <div className="absolute bottom-0 left-0 right-0 bg-transparent p-4 flex justify-end gap-4 items-center">
          <Select onValueChange={(value) => setVenueType(value)} value={venueType} disabled={true}>
            <SelectTrigger className="w-[200px] bg-black/50 text-slate-300">
              <SelectValue placeholder="COMING SOON" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESTAURANT">Restaurant</SelectItem>
              <SelectItem value="DRINK">Bar</SelectItem>
              <SelectItem value="OTHER">Cafe</SelectItem>
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
