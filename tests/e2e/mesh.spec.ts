import { expect, test, type Page } from "@playwright/test";
import { openTwoPeers } from "@baditaflorin/mesh-common/testing";

// Pathline deliberately retains this established storage/Yjs namespace so
// existing room links survive the visual product rename.
const storagePrefix = "Milestone Map";

async function closeInitiallyOpenSettings(page: Page): Promise<void> {
  const settings = page.getByRole("dialog", { name: "Settings" });
  if (!(await settings.isVisible().catch(() => false))) return;
  const close = settings.getByRole("button", { name: "close" });
  if (await close.isVisible().catch(() => false)) {
    await close.click();
  } else {
    await page.keyboard.press("Escape");
  }
  await expect(settings).toBeHidden();
}

/**
 * Generic mesh-presence test — works for any mesh-* app without modification.
 * Opens two pages in the same browser context so y-webrtc's BroadcastChannel
 * fallback syncs them with no signaling server / no network.
 *
 * Apps that show a peer count in the UI should pass this. Apps that don't
 * surface peer count can override or skip this test.
 */
test("two peers in the same room can both load", async ({ browser, baseURL }) => {
  const { a, b, cleanup } = await openTwoPeers(browser, baseURL ?? "", { storagePrefix });
  try {
    // A legitimate first-visit Settings sheet hides page content from the
    // accessibility tree. Close it on each peer before asserting the shared
    // app surface, without changing the app's onboarding behavior.
    await Promise.all([closeInitiallyOpenSettings(a), closeInitiallyOpenSettings(b)]);
    // Both peers reach the planning surface and its actual first action,
    // rather than a generic mesh footer. The room remains feature-owned.
    await expect(a.getByRole("heading", { name: "Pathline" })).toBeVisible();
    await expect(b.getByRole("heading", { name: "Pathline" })).toBeVisible();
    await expect(a.getByRole("button", { name: /create first milestone/i })).toBeVisible();
    await expect(b.getByRole("button", { name: /create first milestone/i })).toBeVisible();
  } finally {
    await cleanup();
  }
});
