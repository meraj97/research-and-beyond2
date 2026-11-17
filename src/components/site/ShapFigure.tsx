// The hero's signature element: a stylized SHAP beeswarm summary plot.
// SHAP plots are named in the company's own service list (Explainable AI),
// so the hero shows the firm's actual subject matter instead of a stock photo.
// The feature names and dots are illustrative, not real data.

type Dot = { cx: number; cy: number; r: number; color: string };

const FEATURES: { label: string; dots: [number, number][] }[] = [
  // [offset from zero line (−100..100), colorMix 0..1 (blue → pink)]
  { label: 'study_hours', dots: [[62, 0.95], [48, 0.85], [34, 0.75], [18, 0.6], [6, 0.5], [-8, 0.35], [-20, 0.25], [-33, 0.1]] },
  { label: 'sample_size', dots: [[44, 0.9], [30, 0.7], [16, 0.55], [4, 0.45], [-12, 0.3], [-26, 0.15]] },
  { label: 'income_level', dots: [[-38, 0.9], [-22, 0.7], [-10, 0.55], [2, 0.45], [14, 0.3], [28, 0.1]] },
  { label: 'age_group', dots: [[24, 0.2], [12, 0.8], [3, 0.5], [-6, 0.65], [-16, 0.4], [-28, 0.85]] },
  { label: 'region', dots: [[18, 0.6], [8, 0.3], [-4, 0.75], [-14, 0.5], [-24, 0.2]] },
];

function mix(t: number): string {
  // low impact #1e88ff → high impact #ff2e63
  const a = [30, 136, 255];
  const b = [255, 46, 99];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

export default function ShapFigure({ label }: { label: string }) {
  const width = 560;
  const height = 400;
  const left = 150;
  const right = width - 40;
  const zero = left + (right - left) / 2; // x of the zero line
  const rowGap = 58;
  const top = 86;

  const rows = FEATURES.map((f, i) => {
    const cy = top + i * rowGap;
    const dots: Dot[] = f.dots.map(([offset, t]) => ({
      cx: zero + offset * 1.85,
      cy: cy + ((offset * 7) % 11) - 5, // fixed vertical jitter
      r: 6.5,
      color: mix(t),
    }));
    return { ...f, cy, dots };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block w-full font-display" role="img" aria-label={label}>
      <defs>
        <linearGradient id="shap-scale" x1="0" x2="1">
          <stop offset="0" stopColor="#1e88ff" />
          <stop offset="1" stopColor="#ff2e63" />
        </linearGradient>
        <linearGradient id="shap-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2166" />
          <stop offset="1" stopColor="#0a1648" />
        </linearGradient>
        <linearGradient id="shap-scanline" x1="0" x2="1">
          <stop offset="0" stopColor="#13d5fb" stopOpacity="0" />
          <stop offset="1" stopColor="#13d5fb" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id="shap-plot">
          <rect x={left} y={top - 24} width={right - left} height={height - top - 28} />
        </clipPath>
      </defs>

      <rect x="0" y="0" width={width} height={height} rx="18" fill="url(#shap-card)" />
      <rect x="0.5" y="0.5" width={width - 1} height={height - 1} rx="17.5" fill="none" stroke="rgba(255,255,255,.16)" />

      {/* window chrome */}
      <circle cx="26" cy="26" r="5" fill="#fc5f2c" />
      <circle cx="44" cy="26" r="5" fill="#f5b113" />
      <circle cx="62" cy="26" r="5" fill="#13d5fb" />
      <text x={width - 28} y="31" textAnchor="end" fontSize="13" fill="rgba(255,255,255,.55)">
        shap.summary_plot(model, X)
      </text>

      <text x="24" y="62" fontSize="15" fill="#ffffff" fontWeight="600">
        Feature impact
      </text>

      {/* moving scan line: "analysis running" */}
      <g clipPath="url(#shap-plot)">
        <rect
          className="shap-scan"
          style={{ '--scan-distance': `${right - left}px` } as React.CSSProperties}
          x={left - 60}
          y={top - 24}
          width="60"
          height={height - top - 28}
          fill="url(#shap-scanline)"
        />
      </g>

      {/* zero line */}
      <line x1={zero} y1={top - 18} x2={zero} y2={height - 52} stroke="rgba(255,255,255,.3)" strokeDasharray="3 5" />

      {rows.map((row, rowIndex) => (
        <g key={row.label}>
          <text x="24" y={row.cy + 4} fontSize="13" fill="rgba(255,255,255,.78)">
            {row.label}
          </text>
          <line x1={left} y1={row.cy} x2={right} y2={row.cy} stroke="rgba(255,255,255,.08)" />
          {row.dots.map((d, i) => (
            <circle
              key={i}
              className="shap-dot"
              style={{ '--from': `${zero - d.cx}px`, '--delay': `${500 + rowIndex * 90 + i * 45}ms` } as React.CSSProperties}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.color}
              fillOpacity="0.94"
            />
          ))}
        </g>
      ))}

      {/* colour legend */}
      <rect x={left} y={height - 34} width={right - left} height="6" rx="3" fill="url(#shap-scale)" />
      <text x={left} y={height - 12} fontSize="11.5" fill="rgba(255,255,255,.6)">
        Low impact
      </text>
      <text x={right} y={height - 12} textAnchor="end" fontSize="11.5" fill="rgba(255,255,255,.6)">
        High impact
      </text>
    </svg>
  );
}
