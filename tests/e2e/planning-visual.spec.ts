import { expect, test, type Browser } from "@playwright/test";

const APP_PATH = "/mesh-milestone-map/";
// The product name changed, but the room namespace intentionally did not.
// Seed that real prefix so visual tests cannot collide through the default
// room with a preceding browser test or an earlier viewport in this test.
const LEGACY_ROOM_PREFIX = "Milestone Map";

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "planning-display", width: 1141, height: 602 },
] as const;

async function openIsolatedPlanningPage(
  browser: Browser,
  viewport: { width: number; height: number },
  roomId: string,
) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(
    ({ prefix, room }) => {
      try {
        localStorage.setItem(`${prefix}:room`, room);
        localStorage.setItem(`${prefix}:signalingUrl`, "ws://localhost:1/never-connects");
        localStorage.setItem(`${prefix}:turnTokenUrl`, "http://127.0.0.1:1/never-connects");
        localStorage.removeItem(`${prefix}:iceServers`);
      } catch {
        // Browser test environments always provide localStorage, but keeping
        // this harmless makes the room-isolation helper safe in hardened runs.
      }
    },
    { prefix: LEGACY_ROOM_PREFIX, room: roomId },
  );
  const page = await context.newPage();
  await page.goto(APP_PATH, { waitUntil: "domcontentloaded" });
  return { context, page };
}

test("the decisive first milestone action is visible on phone and planning display", async ({
  browser,
}, testInfo) => {
  for (const viewport of VIEWPORTS) {
    const { context, page } = await openIsolatedPlanningPage(
      browser,
      viewport,
      `visual-${testInfo.workerIndex}-${viewport.name}`,
    );

    try {
      await expect(page.getByRole("heading", { name: "Pathline" })).toBeVisible();
      const field = page.getByLabel("Next milestone");
      const action = page.getByRole("button", { name: /create first milestone/i });
      await expect(field).toBeVisible();
      await expect(action).toBeVisible();

      const fieldBox = await field.boundingBox();
      const actionBox = await action.boundingBox();
      expect(fieldBox, `${viewport.name} field has a box`).not.toBeNull();
      expect(actionBox, `${viewport.name} action has a box`).not.toBeNull();
      expect(
        (actionBox?.y ?? viewport.height) + (actionBox?.height ?? 0),
        `${viewport.name} primary planning action stays in the first viewport`,
      ).toBeLessThanOrEqual(viewport.height);

      await page.screenshot({
        path: testInfo.outputPath(`pathline-${viewport.name}-landing.png`),
        fullPage: false,
      });

      await field.fill("Agree the workshop brief");
      await expect(action).toBeEnabled();
      await action.click();
      await expect(
        page.getByRole("button", { name: "Complete milestone: Agree the workshop brief" }),
      ).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`pathline-${viewport.name}-with-milestone.png`),
        fullPage: false,
      });
    } finally {
      await context.close();
    }
  }
});

test("the planning form and shared room settings remain keyboard-accessible", async ({
  browser,
}, testInfo) => {
  const { context, page } = await openIsolatedPlanningPage(
    browser,
    { width: 390, height: 844 },
    `keyboard-${testInfo.workerIndex}`,
  );

  try {
    const field = page.getByLabel("Next milestone");
    await field.focus();
    await expect(field).toBeFocused();
    await page.keyboard.type("Prepare the decision notes");
    await expect(page.getByRole("button", { name: /create first milestone/i })).toBeEnabled();
    await field.press("Enter");
    await expect(
      page.getByRole("button", { name: "Complete milestone: Prepare the decision notes" }),
    ).toBeVisible();

    await page.getByLabel("Open settings").click();
    const dialog = page.getByRole("dialog", { name: "Settings" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: "Room ID" })).toBeVisible();
  } finally {
    await context.close();
  }
});
