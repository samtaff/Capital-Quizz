import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { Difficulty, CapitalCoordinates } from '../types';
import { COUNTRIES_DATABASE } from '../data/countries';

interface WorldMapProps {
  countryId: string;
  countryName: string;
  capitalName: string;
  flag: string;
  difficulty: Difficulty;
  coordinates: CapitalCoordinates;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countryId,
  countryName,
  capitalName,
  flag,
  difficulty,
  coordinates,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const difficultyColors: Record<Difficulty, string> = {
    facile: '#4ADE80',
    moyen: '#FB923C',
    difficile: '#F87171',
  };
  const themeColor = difficultyColors[difficulty] || '#FB923C';
  const cleanCountryCode = (countryId || '').toLowerCase();

  // Reliable, high-resolution geographic map tiles
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Initialize Leaflet Map with guaranteed height & resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const lat = coordinates?.lat || 48.8566;
    const lng = coordinates?.lng || 2.3522;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    // Add Carto Voyager tiles (clean, beautiful labels & geography)
    L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add subtle ambient country flag markers on other capitals across the globe
    const flagsGroup = L.layerGroup().addTo(map);
    const otherCountries = COUNTRIES_DATABASE.filter(
      (c) => c.country.toLowerCase() !== countryName.toLowerCase()
    );

    otherCountries.forEach((c) => {
      const otherCode = (c.id || '').toLowerCase();
      const flagIconHtml = `
        <div class="flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125">
          <div class="w-6 h-5 rounded overflow-hidden bg-[#1A1443]/90 border border-white/40 shadow-sm flex items-center justify-center">
            <img src="https://flagcdn.com/w40/${otherCode}.png" alt="${c.country}" class="w-full h-full object-cover" />
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: flagIconHtml,
        className: 'ambient-flag-marker',
        iconSize: [24, 20],
        iconAnchor: [12, 10],
      });

      const m = L.marker([c.coordinates.lat, c.coordinates.lng], {
        icon,
        title: `${c.country} — ${c.capital}`,
      });

      flagsGroup.addLayer(m);
    });

    mapRef.current = map;

    // Create target country marker with animated glowing flag (NO blocking popup bubble)
    const targetIconHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="absolute -inset-3 rounded-full animate-ping opacity-60 pointer-events-none" style="background-color: ${themeColor}"></div>
        <div class="absolute -inset-1.5 rounded-full opacity-30 blur-xs pointer-events-none" style="background-color: ${themeColor}"></div>
        <div class="relative z-10 p-1 rounded-xl bg-[#1A1443] border-2 shadow-2xl flex items-center gap-1.5" style="border-color: ${themeColor}">
          <div class="w-7 h-5 rounded overflow-hidden shadow-sm flex items-center justify-center bg-black/20">
            <img src="https://flagcdn.com/w80/${cleanCountryCode}.png" alt="${countryName}" class="w-full h-full object-cover" />
          </div>
          <span class="text-white font-black text-xs pr-1 tracking-wide">${capitalName}</span>
        </div>
      </div>
    `;

    const targetIcon = L.divIcon({
      html: targetIconHtml,
      className: 'custom-target-marker',
      iconSize: [40, 30],
      iconAnchor: [20, 15],
    });

    const marker = L.marker([lat, lng], {
      icon: targetIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Explicitly NO bindPopup/openPopup here to avoid covering the map!
    markerRef.current = marker;

    // Invalidate size on multiple ticks to guarantee tiles render even during animations
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // Watch for size changes (viewport, orientation, container expansion)
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates?.lat, coordinates?.lng, countryName, capitalName, flag, themeColor]);

  // Controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetTarget = () => {
    mapRef.current?.flyTo([coordinates.lat, coordinates.lng], 5, { duration: 1 });
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0F0A28]"
      style={{ height: '70vh', minHeight: '480px' }}
    >
      {/* Map Leaflet Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ height: '100%', width: '100%', minHeight: '480px' }}
      />

      {/* Floating Zoom & Recenter Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-xl bg-[#1A1443]/90 hover:bg-[#FB923C] text-white hover:text-[#1A1443] border border-white/20 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Zoomer (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-xl bg-[#1A1443]/90 hover:bg-[#FB923C] text-white hover:text-[#1A1443] border border-white/20 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Dézoomer (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetTarget}
          className="w-10 h-10 rounded-xl bg-[#1A1443]/90 hover:bg-[#FB923C] text-white hover:text-[#1A1443] border border-white/20 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Recentrer sur la capitale"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#1A1443]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white/70 text-[11px] font-semibold hidden sm:flex items-center gap-2 pointer-events-none shadow-lg">
        <span>Zoomez et faites glisser la carte pour explorer les pays</span>
      </div>
    </div>
  );
};
