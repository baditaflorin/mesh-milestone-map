export default async function milestoneMapScenario(a, b) {
  const first = "Align on the workshop brief";
  const second = "Invite the project partners";

  await a.getByLabel("Next milestone").fill(first);
  await a.getByRole("button", { name: /create first milestone/i }).click();
  await b
    .getByRole("button", { name: `Complete milestone: ${first}` })
    .waitFor({ timeout: 10_000 });

  await b.getByRole("button", { name: `Complete milestone: ${first}` }).click();
  await a.getByRole("button", { name: `Reopen milestone: ${first}` }).waitFor({ timeout: 10_000 });

  await b.getByLabel("Next milestone").fill(second);
  await b.getByRole("button", { name: /add milestone/i }).click();
  await a.getByText("1 of 2 milestones complete").waitFor({ timeout: 10_000 });
  await a.waitForTimeout(1_000);
}
