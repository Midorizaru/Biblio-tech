"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HomeBook = {
  id: string;
  title: string;
};

export default function Home() {
  const [books, setBooks] = useState<HomeBook[]>([]);

  useEffect(() => {
    fetch("https://openlibrary.org/search.json?sort=new&limit=12")
      .then((res) => res.json())
      .then((data) => {
        const result: HomeBook[] = [];

        for (let book of data.docs) {
          if (book.key && book.title) {
            result.push({
              id: book.key.replace("/works/", ""),
              title: book.title,
            });
          }
        }

        setBooks(result);
      });
  }, []);

  return (
    <div className="container">
      <h1>Recently added books</h1>

      <div className="home-grid">
        {books.map((book) => {
          const coverUrl =
            "https://covers.openlibrary.org/b/olid/" +
            book.id +
            "-M.jpg";

          return (
            <div key={book.id} className="home-card">
              <img
                src={coverUrl}
                alt="Book cover"
                className="home-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              <h2 className="home-title">{book.title}</h2>

              <Link href={"/book/" + book.id}>
                See details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
