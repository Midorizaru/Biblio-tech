"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdvancedSearchPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");

  const [books, setBooks] = useState<any[]>([]);

  function doTheSearch() {
    let url = "https://openlibrary.org/search.json?";

    if (title !== "") {
      url += "title=" + title + "&";
    }

    if (author !== "") {
      url += "author=" + author + "&";
    }

    if (year !== "") {
      url += "first_publish_year=" + year + "&";
    }

    if (subject !== "") {
      url += "subject=" + subject + "&";
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.docs);
      });
  }

  return (
    <div className="container">
      <h1>Advanced search</h1>

      <div className="advanced-search">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="text"
          placeholder="Subject / tag"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <button onClick={doTheSearch}>Search</button>
      </div>

      {books.map((book) => (
        <div key={book.key} className="book-card">
          <h2>{book.title}</h2>

          <Link href={"/book/" + book.key.replace("/works/", "")}>
            See details
          </Link>
        </div>
      ))}
    </div>
  );
}
