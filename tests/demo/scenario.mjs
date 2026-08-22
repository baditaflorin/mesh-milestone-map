export default async function milestoneMapScenario(a, b) {
  await a.getByLabel("Next milestone").fill("Choose a goal");
  await a.getByRole("button", { name: "Add" }).click();
  await b.getByLabel("Next milestone").fill("Share the plan");
  await b.getByRole("button", { name: "Add" }).click();
  await a.getByText("0 of 2 complete").waitFor({ timeout: 10_000 });
  await b.getByRole("checkbox").first().check();
  await a.getByText("1 of 2 complete").waitFor({ timeout: 10_000 });
  await a.waitForTimeout(1_000);
}
