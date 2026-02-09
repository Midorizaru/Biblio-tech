"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- TYPES ---------- */

type RecentChange = {
  key: string;
};

type Book = {
  key: string;
  title: string;
  cover_i: number;
};

/* ---------- COMPONENT ---------- */

export default function Home() {
  const [recentWorks, setRecentWorks] = useState<RecentChange[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  /* ===== RECENT CHANGES ===== */

  useEffect(() => {
    fetch("https://openlibrary.org/recentchanges.json?limit=30")
      .then((res) => res.json())
      .then((data) => {
        const works: RecentChange[] = [];

        for (let changeSet of data) {
          if (!Array.isArray(changeSet.changes)) continue;

          for (let change of changeSet.changes) {
            if (
              typeof change.key === "string" &&
              change.key.startsWith("/works/")
            ) {
              if (!works.find((w) => w.key === change.key)) {
                works.push({ key: change.key });
              }
            }
          }

          if (works.length >= 5) break;
        }

        setRecentWorks(works);
      });
  }, []);

  /* ===== BOOK SELECTION ===== */

  useEffect(() => {
    fetch(
      "https://openlibrary.org/search.json?q=fantasy&sort=rating&limit=100"
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.docs)) return;

        const goodBooks = [];

        for (let book of data.docs) {
          if (
            book.key &&
            book.title &&
            book.cover_i &&
            book.edition_count &&
            book.edition_count > 10
          ) {
            goodBooks.push(book);
          }

          if (goodBooks.length >= 12) break;
        }

        setBooks(goodBooks);
      });
  }, []);

  /* ===== RENDER ===== */

  return (
    <div className="container">

      {/* ===== SECTION BOOK SELECTION ===== */}
      <h1 style={{ marginTop: "40px" }}>Book selection</h1>

      <div className="home-grid">
        {books.map((book) => (
          <div key={book.key} className="home-card">
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt="Book cover"
              className="home-cover"
            />

            <h2 className="home-title">{book.title}</h2>

            <Link href={`/book/${book.key.replace("/works/", "")}`}>
              See details
            </Link>
          </div>
        ))}
      </div>

      {/* ===== SECTION RECENT CHANGES ===== */}
      <h1>Recently updated documents</h1>

      <ul>
        {recentWorks.map((work) => (
          <li key={work.key}>
            Updated work:{" "}
            <Link href={`/book/${work.key.replace("/works/", "")}`}>
              {work.key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
