import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/test-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders card with content", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Card>Card</Card>);
    expect(screen.getByText("Card").getAttribute("data-slot")).toBe("card");
  });
});

describe("CardHeader", () => {
  it("renders header content", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Header").getAttribute("data-slot")).toBe("card-header");
  });
});

describe("CardTitle", () => {
  it("renders title text", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Title").getAttribute("data-slot")).toBe("card-title");
  });
});

describe("CardDescription", () => {
  it("renders description text", () => {
    render(<CardDescription>Description here</CardDescription>);
    expect(screen.getByText("Description here")).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders content", () => {
    render(<CardContent>Body content</CardContent>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Body content").getAttribute("data-slot")).toBe("card-content");
  });
});

describe("CardFooter", () => {
  it("renders footer", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Footer").getAttribute("data-slot")).toBe("card-footer");
  });
});

describe("CardAction", () => {
  it("renders action element", () => {
    render(<CardAction><button>Action</button></CardAction>);
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("Card composition", () => {
  it("renders a composed card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
