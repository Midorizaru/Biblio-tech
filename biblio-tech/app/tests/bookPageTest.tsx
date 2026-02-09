import { render, screen } from "@testing-library/react";
import BookPage from "../book/[id]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "OL12345W" }),
}));

describe("Book page", () => {
  it("displays loading state initially", () => {
    render(<BookPage />);

    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });
});
