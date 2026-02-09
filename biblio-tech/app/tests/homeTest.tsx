import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home page", () => {
  it("displays the main title", () => {
    render(<Home />);

    const title = screen.getByText(/book selection/i);
    expect(title).toBeInTheDocument();
  });
});
