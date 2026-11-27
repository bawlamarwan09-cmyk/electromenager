import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string): NextConfig {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  const live=process.env.LIVE_CATALOGUE==='1';
  const dashboardOrigin = process.env.DASHBOARD_ORIGIN || `http://127.0.0.1:${process.env.DASHBOARD_PORT || '8100'}`;
  return {
    output: development || live ? undefined : 'export',
    turbopack: { root: process.cwd() },
    images: { unoptimized: true },
    trailingSlash: true,
    ...( (development || live) && {
      async rewrites(){return live?[{source:'/catalogue-live.json',destination:`http://127.0.0.1:${process.env.DASHBOARD_PORT||'8100'}/catalogue.json`}]:[]},
      async redirects() {
        return ['/dashboard/', '/dashbord/'].map(source => ({
          source, destination: new URL('/', dashboardOrigin).href, permanent: false,
        }));
      },
    }),
  };
}
