import { render, screen } from "@testing-library/react";
import QuickSearch from "../components/QuickSearch";

test("search input is displayed", () => {
  render(<QuickSearch />);

  const input = screen.getByPlaceholderText("Search a book...");
  expect(input).toBeInTheDocument();
});
