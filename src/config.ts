import { createMeshConfig } from "@baditaflorin/mesh-common";

const legacyRoomConfig = createMeshConfig({
  // Keep this stable legacy namespace so existing shared plans and room links
  // continue to meet the same Yjs document after the product visual refresh.
  appName: "Milestone Map",
  displayName: "Pathline",
  visualProfile: "utility",
  shellLayout: "inset",
  description: "A calm peer-to-peer planning room for turning a next step into shared momentum.",
  accentHex: "#7ea5ff",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});

// createMeshConfig correctly retains the legacy storage and Yjs namespace
// above. These public links are repository routes, not room identifiers.
export const config = {
  ...legacyRoomConfig,
  repositoryUrl: "https://github.com/baditaflorin/mesh-milestone-map",
  pagesUrl: "https://baditaflorin.github.io/mesh-milestone-map/",
} as const;
