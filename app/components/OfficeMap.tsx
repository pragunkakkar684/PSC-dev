import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

const MAP_WIDTH = 600;
const MAP_HEIGHT = 320;

// Fetched once per request on the server, no client-side map library required.
export async function getWorldFeatures() {
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json', {
    // Country borders don't change; safe to cache aggressively.
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  const topology = (await res.json()) as Topology;
  const collection = feature(
    topology,
    topology.objects.countries as GeometryCollection
  );
  return 'features' in collection ? collection.features : [collection];
}

type Office = { id: string; city: string; isHeadquarters?: boolean };

export async function OfficeMap({
  offices,
  coordinates,
  label,
}: {
  offices: Office[];
  coordinates: Record<string, [number, number]>;
  label: string;
}) {
  const worldFeatures = await getWorldFeatures();

  const projection = geoNaturalEarth1().fitSize(
    [MAP_WIDTH, MAP_HEIGHT],
    { type: 'FeatureCollection', features: worldFeatures } as GeoPermissibleObjects
  );
  const pathGenerator = geoPath(projection);

  const hqOffice = offices.find((o) => o.isHeadquarters);
  const hqCoords = hqOffice ? coordinates[hqOffice.city] : undefined;

  const markerOffices = offices.filter((o) => coordinates[o.city]);
  const linkedOffices = hqCoords
    ? offices.filter((o) => !o.isHeadquarters && coordinates[o.city])
    : [];

  return (
    <div className="relative flex min-h-64 flex-col items-center justify-center gap-3 overflow-hidden bg-black py-8 text-white">
      <style>{`
        @keyframes officeMapLandFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes officeMapLineDraw {
          from { stroke-dashoffset: var(--line-length); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes officeMapAnts {
          to { stroke-dashoffset: -16; }
        }
        @keyframes officeMapMarkerIn {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <p className="font-mono text-xs tracking-[.18em] text-slate-400">{label}</p>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-72 w-full"
        role="img"
        aria-label="Map of office locations"
      >
        <defs>
          <filter id="officeMapGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Landmass — fades in once on load */}
        <g style={{ animation: 'officeMapLandFade 1s ease-out both' }}>
          {worldFeatures.map((f, i) => (
            <path
              key={i}
              d={pathGenerator(f as GeoPermissibleObjects) || ''}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={0.4}
            />
          ))}
        </g>

        {/* Dotted lines connecting the HQ to every other office */}
        {hqCoords &&
          linkedOffices.map((o, i) => {
            const from = projection(hqCoords);
            const to = projection(coordinates[o.city]);
            if (!from || !to) return null;
            const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
            return (
              <line
                key={`line-${o.id}`}
                x1={from[0]}
                y1={from[1]}
                x2={to[0]}
                y2={to[1]}
                stroke="#38bdf8"
                strokeWidth={1}
                strokeDasharray="2 2"
                style={{
                  ['--line-length' as string]: length,
                  strokeDasharray: length,
                  animation: `officeMapLineDraw 1.1s ease-out ${0.6 + i * 0.15}s both, officeMapAnts 1s linear ${1.6 + i * 0.15}s infinite`,
                } as React.CSSProperties}
              />
            );
          })}

        {/* City markers */}
        {markerOffices.map((o, i) => {
          const pos = projection(coordinates[o.city]);
          if (!pos) return null;
          const [x, y] = pos;
          const isHQ = !!o.isHeadquarters;
          const color = isHQ ? '#fbbf24' : '#38bdf8';
          const delay = 0.5 + i * 0.12;

          return (
            <g
              key={o.id}
              filter="url(#officeMapGlow)"
              style={{
                animation: `officeMapMarkerIn 0.5s ease-out ${delay}s both`,
                transformOrigin: `${x}px ${y}px`,
              }}
            >
              {/* Radar ping ring */}
              <circle cx={x} cy={y} r={4} fill="none" stroke={color} strokeWidth={1.2} opacity={0.7}>
                <animate
                  attributeName="r"
                  values="4;12;4"
                  dur={isHQ ? '2s' : '2.6s'}
                  begin={`${delay + 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0;0.7"
                  dur={isHQ ? '2s' : '2.6s'}
                  begin={`${delay + 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Solid center dot */}
              <circle cx={x} cy={y} r={4} fill={color} stroke="#0f172a" strokeWidth={1.5}>
                {isHQ && (
                  <animate
                    attributeName="r"
                    values="4;5;4"
                    dur="1.8s"
                    begin={`${delay + 0.3}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                style={{ fontFamily: 'monospace', fontSize: 8, fill: '#e2e8f0' }}
              >
                {o.city.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}