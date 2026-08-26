import { expect, test } from "@playwright/test";
import { openTwoPeers } from "@baditaflorin/mesh-common/testing";

// Use the production room namespace, not the repository slug. Pathline's
// product name changed, but shared plans continue on this established key.
const storagePrefix = "Milestone Map";

/**
 * Load-bearing peer test for the advertised planning loop. Two independent
 * browser pages write through the real useSharedMilestones Y.Array, then a
 * different peer completes the first item. This proves more than a local UI
 * list: insertion order and completion state merge across the shared room.
 */
test("two planners add and complete the same shared path", async ({ browser, baseURL }) => {
  const { a, b, cleanup } = await openTwoPeers(browser, baseURL ?? "", { storagePrefix });
  try {
    const first = "Align on a working brief";
    const second = "Invite the project partners";

    await expect(a.getByLabel("Next milestone")).toBeVisible();
    await expect(b.getByLabel("Next milestone")).toBeVisible();
    // BroadcastChannel can relay CRDT updates before numeric awareness counts
    // settle. The live room copy must therefore stay neutral for both real
    // peers instead of incorrectly claiming either is alone.
    await expect(a.locator(".pathline-room-status strong")).toHaveText("Plan ready to share");
    await expect(b.locator(".pathline-room-status strong")).toHaveText("Plan ready to share");
    await expect(a.getByText("You are the first planner here")).toHaveCount(0);
    await expect(b.getByText("You are the first planner here")).toHaveCount(0);

    await a.getByLabel("Next milestone").fill(first);
    await a.getByRole("button", { name: /create first milestone/i }).click();

    const completeFirstOnB = b.getByRole("button", { name: `Complete milestone: ${first}` });
    await expect(completeFirstOnB).toBeVisible();

    // A second planner marks an item complete; peer A must receive the
    // updated object from the shared Y.Array, not simulate it locally.
    await completeFirstOnB.click();
    await expect(a.getByRole("button", { name: `Reopen milestone: ${first}` })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await b.getByLabel("Next milestone").fill(second);
    await b.getByRole("button", { name: /add milestone/i }).click();
    await expect(a.getByRole("button", { name: `Complete milestone: ${second}` })).toBeVisible();
    await expect(a.getByText("1 of 2 milestones complete")).toBeVisible();
  } finally {
    await cleanup();
  }
});
