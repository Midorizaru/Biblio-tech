import { render, screen } from "@testing-library/react";
import QuickSearch from "../../app/components/QuickSearch";

test("search input is displayed", () => {
  render(<QuickSearch />);

  const input = screen.getByPlaceholderText("Search a book...");
  expect(input).toBeInTheDocument();
});
