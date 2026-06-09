'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  MapPin,
  Navigation,
  Clock,
  Home,
  Briefcase,
  Dumbbell,
  Coffee,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const RECENT_PLACES = [
  { id: 'p1', name: 'Home', address: '742 Evergreen Terrace', icon: Home, distance: '0.5 km' },
  { id: 'p2', name: 'Office', address: '1600 Innovation Drive', icon: Briefcase, distance: '3.2 km' },
  { id: 'p3', name: 'Gym', address: '55 Fitness Blvd', icon: Dumbbell, distance: '1.8 km' },
  { id: 'p4', name: 'Cafe', address: '12 Maple Street', icon: Coffee, distance: '0.3 km' },
];

const LIVE_DURATION_OPTIONS = [
  { label: '15 minutes', value: 15 },
  { label: '1 hour', value: 60 },
  { label: '8 hours', value: 480 },
];

interface LocationShareProps {
  onShareLocation?: (location: { lat: number; lng: number; name: string }) => void;
  onShareLiveLocation?: (duration: number) => void;
  onClose: () => void;
}

export default function LocationShare({
  onShareLocation,
  onShareLiveLocation,
  onClose,
}: LocationShareProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showLiveOptions, setShowLiveOptions] = useState(false);
  const [liveDuration, setLiveDuration] = useState(60);

  const filteredPlaces = searchQuery.trim()
    ? RECENT_PLACES.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : RECENT_PLACES;

  const handleShareCurrent = () => {
    onShareLocation?.({
      lat: 37.7749,
      lng: -122.4194,
      name: 'Current Location',
    });
    onClose();
  };

  const handleSharePlace = (place: (typeof RECENT_PLACES)[number]) => {
    onShareLocation?.({
      lat: 37.7749 + Math.random() * 0.01,
      lng: -122.4194 + Math.random() * 0.01,
      name: place.name,
    });
    onClose();
  };

  const handleShareLive = () => {
    onShareLiveLocation?.(liveDuration);
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl"
      style={{ maxHeight: '80vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Share Location</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh]">
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="pl-9 h-10 rounded-xl bg-muted/50"
            />
          </div>

          {/* Map Preview */}
          <div className="relative rounded-xl overflow-hidden border border-border bg-muted/20 h-48">
            {/* Grid lines to simulate a map */}
            <div className="absolute inset-0">
              {/* Horizontal grid lines */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-border/30"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {/* Vertical grid lines */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-border/30"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {/* Roads simulation */}
              <div className="absolute top-1/2 w-full h-[2px] bg-border/50" />
              <div className="absolute left-1/3 h-full w-[2px] bg-border/50" />
              <div className="absolute left-2/3 h-full w-[2px] bg-border/50" />
              <div className="absolute top-1/3 w-full h-[2px] bg-border/50" />
            </div>

            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="w-0.5 h-2 bg-primary" />
                <div className="w-3 h-1 bg-primary/50 rounded-full" />
              </div>
            </div>

            {/* Map label */}
            <div className="absolute bottom-2 left-2 bg-background/90 rounded-md px-2 py-0.5 text-[9px] text-muted-foreground backdrop-blur">
              Map Preview
            </div>
          </div>

          {/* Share Current Location */}
          <Button
            className="w-full h-11 rounded-xl gap-2"
            onClick={handleShareCurrent}
          >
            <Navigation className="h-4 w-4" />
            Share Current Location
          </Button>

          {/* Share Live Location */}
          <div>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setShowLiveOptions(!showLiveOptions)}
            >
              <Clock className="h-4 w-4" />
              Share Live Location
            </Button>

            <AnimatePresence>
              {showLiveOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-2">
                    {LIVE_DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setLiveDuration(opt.value)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors border ${
                          liveDuration === opt.value
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 rounded-xl"
                    onClick={handleShareLive}
                  >
                    Start Sharing for {LIVE_DURATION_OPTIONS.find((o) => o.value === liveDuration)?.label}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Recent Places */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent Places</h4>
            <div className="space-y-1">
              {filteredPlaces.map((place) => {
                const Icon = place.icon;
                const isSelected = selectedPlace === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(isSelected ? null : place.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary/20' : 'bg-muted/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{place.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{place.distance}</span>
                  </button>
                );
              })}
            </div>

            {selectedPlace && (
              <Button
                className="w-full mt-3 rounded-xl"
                onClick={() => {
                  const place = RECENT_PLACES.find((p) => p.id === selectedPlace);
                  if (place) handleSharePlace(place);
                }}
              >
                <Check className="h-4 w-4 mr-1" />
                Share This Location
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Cancel */}
      <div className="border-t px-4 py-3">
        <Button variant="ghost" className="w-full rounded-xl text-muted-foreground" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
