import { createMeshConfig } from "@baditaflorin/mesh-common";

export const config = createMeshConfig({
  appName: "Milestone Map",
  description: "A peer-to-peer shared milestone map.",
  accentHex: "#14b8a6",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});
