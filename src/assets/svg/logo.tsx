const Logo = () => {
  return (
    <div className="h-12 w-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          {/* Primary gradient */}
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Flow gradient */}
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Building gradient */}
          <linearGradient id="buildingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Transparent background — no rect */}

        <g transform="translate(10, 10)">
          {/* Civic network outline */}
          <path
            d="M 50 15 C 25 15, 10 30, 10 55 C 10 80, 50 95, 50 95 C 50 95, 90 80, 90 55 C 90 30, 75 15, 50 15 Z"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
          />

          {/* Left building */}
          <rect
            x="28"
            y="48"
            width="10"
            height="32"
            rx="2"
            fill="url(#buildingGrad)"
          />

          {/* Center building */}
          <rect
            x="42"
            y="32"
            width="16"
            height="48"
            rx="2"
            fill="url(#primaryGrad)"
          />

          {/* Right building */}
          <rect
            x="62"
            y="42"
            width="10"
            height="38"
            rx="2"
            fill="url(#buildingGrad)"
          />

          {/* Network connection */}
          <line
            x1="33"
            y1="48"
            x2="50"
            y2="32"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          <line
            x1="50"
            y1="32"
            x2="67"
            y2="42"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Network nodes */}
          <circle cx="33" cy="48" r="3.5" fill="#38BDF8" />

          <circle cx="50" cy="32" r="4.5" fill="#06B6D4" />

          <circle cx="67" cy="42" r="3.5" fill="#38BDF8" />

          {/* CivicFlow */}
          <path
            d="M 12 70 C 30 52, 55 88, 88 52 C 92 47, 95 44, 98 48 C 96 56, 88 64, 76 72 C 58 84, 32 78, 12 70 Z"
            fill="url(#flowGrad)"
            opacity="0.95"
          />

          {/* Flow endpoint */}
          <circle cx="88" cy="52" r="3" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
