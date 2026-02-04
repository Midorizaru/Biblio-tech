"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function doTheSearch() {
    if (search === "") {
      return;
    }

    router.push("/search?q=" + search);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search a book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={doTheSearch}>
        Search
      </button>
    </div>
  );
}
