import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMockRoom } from "@baditaflorin/mesh-common/testing";
import { Feature } from "../../src/Feature";
import { config } from "../../src/config";

describe("Pathline planning surface", () => {
  it("renders the human product name and a real first milestone action", () => {
    const room = createMockRoom();
    render(<Feature room={room} config={config} />);
    expect(screen.getByRole("heading", { level: 1, name: "Pathline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create first milestone" })).toBeDisabled();
  });

  it("adds a milestone through the shared hook instead of a local-only list", () => {
    const room = createMockRoom();
    render(<Feature room={room} config={config} />);

    fireEvent.change(screen.getByLabelText("Next milestone"), {
      target: { value: "Align on the brief" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create first milestone" }));

    expect(
      screen.getByRole("button", { name: "Complete milestone: Align on the brief" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("0 of 1 milestones complete")).toBeInTheDocument();
  });

  it("names an honest opening state before a room exists", () => {
    render(<Feature room={null} config={config} />);
    expect(screen.getByText("Opening the shared plan…")).toBeInTheDocument();
  });
});
