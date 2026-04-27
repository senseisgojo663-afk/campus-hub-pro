import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const COLLEGE_LAT = 8.7379;
const COLLEGE_LNG = 77.7029;

// Campus building SVG rendered as a Leaflet HTML marker
const CAMPUS_MARKER_HTML = `
<div class="campus-marker">
  <div class="cm-scene">
    <!-- Sun -->
    <div class="cm-sun"></div>

    <!-- Main building -->
    <div class="cm-building cm-main">
      <div class="cm-roof"></div>
      <div class="cm-body">
        <div class="cm-windows">
          <div class="cm-win w0"></div>
          <div class="cm-win w1"></div>
          <div class="cm-win w2"></div>
        </div>
        <div class="cm-windows">
          <div class="cm-win w1"></div>
          <div class="cm-win w0"></div>
          <div class="cm-win w2"></div>
        </div>
        <div class="cm-gate">
          <div class="cm-arch"></div>
        </div>
      </div>
    </div>

    <!-- Left wing -->
    <div class="cm-building cm-wing cm-wing-l">
      <div class="cm-roof"></div>
      <div class="cm-body">
        <div class="cm-windows">
          <div class="cm-win w2"></div>
          <div class="cm-win w0"></div>
        </div>
      </div>
    </div>

    <!-- Right wing -->
    <div class="cm-building cm-wing cm-wing-r">
      <div class="cm-roof"></div>
      <div class="cm-body">
        <div class="cm-windows">
          <div class="cm-win w1"></div>
          <div class="cm-win w2"></div>
        </div>
      </div>
    </div>

    <!-- Flag -->
    <div class="cm-pole"><div class="cm-flag"></div></div>

    <!-- Trees -->
    <div class="cm-tree cm-tree-l"><div class="cm-treetop"></div><div class="cm-trunk"></div></div>
    <div class="cm-tree cm-tree-r"><div class="cm-treetop"></div><div class="cm-trunk"></div></div>

    <!-- Ground line -->
    <div class="cm-ground"></div>

    <!-- Sonar rings -->
    <div class="cm-rings">
      <div class="cm-ring r1"></div>
      <div class="cm-ring r2"></div>
      <div class="cm-ring r3"></div>
    </div>
  </div>

  <!-- Label -->
  <div class="cm-label">🏛️ FXEC Campus</div>
  <div class="cm-stem"></div>
</div>
`;

export default function CampusMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return; // already initialized

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      const map = L.map(mapRef.current, {
        center: [COLLEGE_LAT, COLLEGE_LNG],
        zoom: 16,
        zoomControl: false, // we'll add custom zoom
        scrollWheelZoom: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Dark-styled OpenStreetMap tiles (CartoDB Dark Matter)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 20 }
      ).addTo(map);

      // Custom zoom control bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Attribution
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addTo(map)
        .addAttribution("© OpenStreetMap contributors © CARTO");

      // Custom campus HTML marker
      const campusIcon = L.divIcon({
        className: "",
        html: CAMPUS_MARKER_HTML,
        iconSize: [160, 140],
        iconAnchor: [80, 140], // bottom-center of the marker
        popupAnchor: [0, -140],
      });

      L.marker([COLLEGE_LAT, COLLEGE_LNG], { icon: campusIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;font-size:0.78rem;line-height:1.5;">
            <strong>🏛️ Francis Xavier Engineering College</strong><br/>
            103/G2, Bypass Road, Vannarpettai,<br/>
            Tirunelveli – 627 003, Tamil Nadu
          </div>`,
          { maxWidth: 220 }
        );
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="leaflet-map-container" />;
}
