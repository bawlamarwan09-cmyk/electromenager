import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string): NextConfig {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  const dashboardOrigin = process.env.DASHBOARD_ORIGIN || `http://127.0.0.1:${process.env.DASHBOARD_PORT || '8100'}`;
  return {
    output: development ? undefined : 'export',
    turbopack: { root: process.cwd() },
    images: { unoptimized: true },
    trailingSlash: true,
    ...(development && {
      async redirects() {
        return ['/dashboard/', '/dashbord/'].map(source => ({
          source, destination: new URL('/', dashboardOrigin).href, permanent: false,
        }));
      },
    }),
  };
}
