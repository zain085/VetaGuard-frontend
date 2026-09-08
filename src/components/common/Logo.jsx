// VetaGuard brand mark: a shield (protection) containing a paw (pet care)
// with a small medical cross accent. Uses currentColor + CSS variables so
// it reads correctly on light, dark, and colored backgrounds.
export default function Logo({ className = "h-9 w-9", withWordmark = false, wordmarkClassName = "" }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 48 48"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M24 3 L42 10 V22 C42 33 34.5 41.5 24 45 C13.5 41.5 6 33 6 22 V10 Z"
          fill="var(--color-primary)"
        />
        <path
          d="M24 3 L42 10 V22 C42 33 34.5 41.5 24 45 V3Z"
          fill="var(--color-secondary)"
          opacity="0.35"
        />
        {/* paw print */}
        <g fill="var(--color-surface)">
          <ellipse cx="24" cy="27" rx="7" ry="5.5" />
          <ellipse cx="16.5" cy="19" rx="2.6" ry="3.4" />
          <ellipse cx="22" cy="15.5" rx="2.6" ry="3.4" />
          <ellipse cx="27.5" cy="15.5" rx="2.6" ry="3.4" />
          <ellipse cx="32" cy="19" rx="2.6" ry="3.4" />
        </g>
        {/* small medical cross accent, bottom-right of the shield */}
        <g>
          <rect x="30" y="30" width="8" height="8" rx="1.5" fill="var(--color-surface)" />
          <rect x="33.1" y="31.2" width="1.8" height="5.6" fill="var(--color-primary)" />
          <rect x="31.2" y="33.1" width="5.6" height="1.8" fill="var(--color-primary)" />
        </g>
      </svg>
      {withWordmark && (
        <span className={`font-semibold tracking-tight text-text ${wordmarkClassName}`}>
          Veta<span style={{ color: "var(--color-primary)" }}>Guard</span>
        </span>
      )}
    </div>
  );
}
