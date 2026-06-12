import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

type Loc = { lat: number; lng: number };

declare global {
  interface Window {
    google?: any;
    __initStoreMap?: () => void;
  }
}

const DEFAULT: Loc = { lat: 30.0444, lng: 31.2357 }; // Cairo

export function MapLocationPicker({
  value,
  onChange,
}: {
  value: Loc | null;
  onChange: (loc: Loc) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [locating, setLocating] = useState(false);

  // Load Maps JS API once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps) {
      setReady(true);
      return;
    }
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return;

    if (document.querySelector("script[data-store-maps]")) {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check);
          setReady(true);
        }
      }, 100);
      return () => clearInterval(check);
    }

    window.__initStoreMap = () => setReady(true);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initStoreMap${
      channel ? `&channel=${channel}` : ""
    }`;
    s.async = true;
    s.defer = true;
    s.dataset.storeMaps = "1";
    document.head.appendChild(s);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const start = value ?? DEFAULT;
    const map = new window.google.maps.Map(containerRef.current, {
      center: start,
      zoom: value ? 15 : 11,
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
    const marker = new window.google.maps.Marker({
      position: start,
      map,
      draggable: true,
    });
    mapRef.current = map;
    markerRef.current = marker;

    if (value) onChange(value);

    const update = (latLng: any) => {
      const loc = { lat: latLng.lat(), lng: latLng.lng() };
      marker.setPosition(loc);
      onChange(loc);
    };

    map.addListener("click", (e: any) => update(e.latLng));
    marker.addListener("dragend", (e: any) => update(e.latLng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(loc);
        if (mapRef.current && markerRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(16);
          markerRef.current.setPosition(loc);
        }
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const hasKey = !!import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="h-4 w-4 text-primary" />
          حدد موقعك على الخريطة
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating || !ready}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent/30 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-accent/50 disabled:opacity-50"
        >
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
          موقعى الحالى
        </button>
      </div>

      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-xl border-2 border-border bg-muted"
      >
        {!ready && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {hasKey ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> جارى تحميل الخريطة...
              </span>
            ) : (
              <span>الخريطة غير متاحة</span>
            )}
          </div>
        )}
      </div>

      {value && (
        <p className="text-xs text-muted-foreground">
          الإحداثيات: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}{" "}
          <a
            href={`https://maps.google.com/?q=${value.lat},${value.lng}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 text-primary underline"
          >
            معاينة
          </a>
        </p>
      )}
    </div>
  );
}
