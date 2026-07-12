import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmptyState from "./EmptyState";

// Sample test — proves the Vitest + React Testing Library setup works.
// Copy this pattern for your own components.
describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState title="No items yet" description="Add your first item." />,
    );

    expect(screen.getByText("No items yet")).toBeInTheDocument();
    expect(screen.getByText("Add your first item.")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(<EmptyState title="Empty" action={<button>Create</button>} />);

    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
