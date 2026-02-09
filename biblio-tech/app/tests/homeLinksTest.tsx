import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home navigation", () => {
  it("contains a See details link", () => {
    render(<Home />);

    const link = screen.getAllByText(/see details/i)[0];
    expect(link).toBeInTheDocument();
  });
});
