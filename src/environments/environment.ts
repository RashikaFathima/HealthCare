// DEFAULT environment (used when no file replacement is configured).
// The backend team will provide the real apiBaseUrl.
// See README.md -> "Future API Integration" for exact steps.
export const environment = {
  production: false,
  useMockData: true, // <-- flip to false once real backend endpoints are wired up
  apiBaseUrl: 'http://localhost:8080/api',
  apiTimeoutMs: 15000,
  mockNetworkDelayMs: 500 // simulated latency so loading states are visible with mock data
};
