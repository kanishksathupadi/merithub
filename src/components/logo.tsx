import React from 'react';

export const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
  >
    <defs>
      <linearGradient id="a" x1="50" x2="50" y1="95" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#003B73" />
        <stop offset="1" stopColor="#0B98A1" />
      </linearGradient>
      <linearGradient id="b" x1="50" x2="50" y1="80" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#63B233" />
        <stop offset="1" stopColor="#A3D978" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      d="M43.75 95 12.5 15h11.75l20.5 59h.25l20.5-59h11.75L43.75 95Z"
    />
    <path
      fill="url(#b)"
      d="M31.25 80h10v-7.5h-10V80Zm12.5-12.5h10v-7.5h-10v7.5Zm12.5-12.5h10v-7.5h-10v7.5Zm12.5-12.5h10v-7.5h-10v7.5Z"
    />
    <path
      fill="#A3D978"
      d="M87.5 32.5 83.75 35l-1.5-4-3.75-1.25 2.5-3.5-1-4L83.75 20l3.75 2.5Z"
    />
    <path
      fill="#0B98A1"
      d="M80 25h12.5l-6.25-5L80 25Z"
    />
  </svg>
);
