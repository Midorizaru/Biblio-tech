"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function QuickSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    fetch("https://openlibrary.org/search.json?q=" + search)
      .then((response) => response.json())
      .then((data) => {
        const uniqueResults = removeDuplicatesByKey(data.docs);
        setResults(uniqueResults.slice(0, 5));
      });
  }, [search]);

  function removeDuplicatesByKey(list: any[] = []) {
    const seen = new Set();
    const result = [];

    for (let item of list) {
      if (item.key && !seen.has(item.key)) {
        seen.add(item.key);
        result.push(item);
      }
    }

    return result;
  }

  function handleInputChange(e: any) {
    setSearch(e.target.value);
  }

  function doTheSearch() {
    if (search === "") {
      return;
    }
    router.push("/search?q=" + search);
    setResults([]);
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <div className="header">
      <div className="header-content">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>

        <div className="search-wrapper">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search a book..."
              value={search}
              onChange={handleInputChange}
            />
            <button onClick={doTheSearch}>Search</button>
          </div>

          {results.length > 0 && (
            <div className="search-results">
              {results.map((book) => {
                let cover = null;

                if (book.cover_i) {
                  cover = (
                    <img
                      className="search-result-cover"
                      src={
                        "https://covers.openlibrary.org/b/id/" +
                        book.cover_i +
                        "-S.jpg"
                      }
                      alt="Book cover"
                    />
                  );
                }

                return (
                  <Link
                    key={book.key}
                    href={"/book/" + book.key.replace("/works/", "")}
                    className="search-result-item"
                    onClick={() => setResults([])}
                  >
                    {cover}
                    <span className="search-result-title">
                      {book.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <h1 className="site-title">Biblio-Tech</h1>
      </div>

      {menuOpen && (
        <div className="menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/advanced-search" onClick={() => setMenuOpen(false)}>
            Advanced search
          </Link>
        </div>
      )}
    </div>
  );
}
