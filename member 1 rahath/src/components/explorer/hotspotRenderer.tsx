import type { DetectedComponent, NormalizedPoint } from '../../types/imageExplorer';

interface HotspotRendererProps {
  components: DetectedComponent[];
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  showLabels: boolean;
  onSelectComponent: (component: DetectedComponent) => void;
  onHoverComponent: (componentId: string | null) => void;
}

function getPolygonCentroid(points: NormalizedPoint[]): NormalizedPoint {
  if (points.length === 0) return { x: 0.5, y: 0.5 };
  const sum = points.reduce(
    (acc, pt) => ({ x: acc.x + pt.x, y: acc.y + pt.y }),
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

export function HotspotRenderer({
  components,
  selectedComponentId,
  hoveredComponentId,
  showLabels,
  onSelectComponent,
  onHoverComponent,
}: HotspotRendererProps) {
  if (components.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-label="Interactive detected space components overlay"
    >
      {/* Polygon Layer (stretched accurately to normalized 0..1 image coordinates) */}
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {components.map((component) => {
          const isSelected = component.id === selectedComponentId;
          const isHovered = component.id === hoveredComponentId;
          const pointsAttr = component.region.points
            .map((pt) => `${Math.round(pt.x * 1000)},${Math.round(pt.y * 1000)}`)
            .join(' ');

          return (
            <polygon
              key={component.id}
              points={pointsAttr}
              onClick={(e) => {
                e.stopPropagation();
                onSelectComponent(component);
              }}
              onMouseEnter={() => onHoverComponent(component.id)}
              onMouseLeave={() => onHoverComponent(null)}
              fill={
                isSelected
                  ? 'rgba(34, 211, 238, 0.28)'
                  : isHovered
                    ? 'rgba(34, 211, 238, 0.18)'
                    : 'rgba(6, 182, 212, 0.08)'
              }
              stroke={
                isSelected
                  ? '#22D3EE'
                  : isHovered
                    ? '#67E8F9'
                    : 'rgba(103, 232, 249, 0.72)'
              }
              strokeWidth={isSelected ? 3.5 : 2}
              vectorEffect="non-scaling-stroke"
              className="pointer-events-auto cursor-pointer transition-colors duration-150"
            />
          );
        })}
      </svg>

      {/* Crisp Undistorted HTML Pin & Label Controls */}
      {components.map((component, index) => {
        const isSelected = component.id === selectedComponentId;
        const isHovered = component.id === hoveredComponentId;
        const centroid = getPolygonCentroid(component.region.points);
        const leftPct = Math.max(6, Math.min(94, centroid.x * 100));
        const topPct = Math.max(8, Math.min(92, centroid.y * 100));

        return (
          <button
            key={component.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent(component);
            }}
            onMouseEnter={() => onHoverComponent(component.id)}
            onMouseLeave={() => onHoverComponent(null)}
            onFocus={() => onHoverComponent(component.id)}
            onBlur={() => onHoverComponent(null)}
            aria-label={`Inspect component ${index + 1}: ${component.name}`}
            aria-pressed={isSelected}
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
            }}
            className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 cursor-pointer transition-transform duration-150 ${
              isSelected ? 'z-20 scale-105' : isHovered ? 'z-10 scale-105' : 'z-0'
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-md transition-colors ${
                isSelected
                  ? 'border-cyan-200 bg-cyan-600 text-white'
                  : isHovered
                    ? 'border-cyan-300 bg-[#0B1120] text-cyan-200'
                    : 'border-cyan-400 bg-[#060913]/95 text-white'
              }`}
            >
              {index + 1}
            </span>

            {showLabels && (
              <span
                className={`max-w-[160px] truncate rounded-md border px-2 py-0.5 text-xs font-semibold shadow-md backdrop-blur-sm ${
                  isSelected
                    ? 'border-cyan-400 bg-[#060913]/95 text-cyan-200'
                    : 'border-slate-600/80 bg-[#060913]/90 text-slate-100'
                }`}
              >
                {component.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
