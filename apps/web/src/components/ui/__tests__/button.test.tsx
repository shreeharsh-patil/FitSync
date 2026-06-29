import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders children text", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Styled</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("forwards additional props", () => {
    render(<Button data-testid="test-btn">Test</Button>);
    expect(screen.getByTestId("test-btn")).toBeInTheDocument();
  });
});
