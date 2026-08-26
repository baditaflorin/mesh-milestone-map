import { expect, test } from "@playwright/test";

const APP_PATH = "/mesh-milestone-map/";

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "planning-display", width: 1141, height: 602 },
] as const;

test("the decisive first milestone action is visible on phone and planning display", async ({
  page,
}, testInfo) => {
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto(APP_PATH, { waitUntil: "domcontentloaded" });

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
  }
});

test("the planning form and shared room settings remain keyboard-accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: "domcontentloaded" });

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
});
