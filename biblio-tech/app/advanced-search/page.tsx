"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdvancedSearchPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");

  const [books, setBooks] = useState<any[]>([]);

  const [selectingTitle, setSelectingTitle] = useState(false);
  const [selectingAuthor, setSelectingAuthor] = useState(false);
  const [selectingSubject, setSelectingSubject] = useState(false);

  /* ===== AUTOCOMPLETE STATES ===== */
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

  /* ===== TITLE AUTOCOMPLETE ===== */
  useEffect(() => {
    if (selectingTitle) {
        setSelectingTitle(false);
        return;
    }

    if (title.length < 2) {
        setTitleSuggestions([]);
        return;
    }

    fetch("https://openlibrary.org/search.json?title=" + title)
        .then((res) => res.json())
        .then((data) => {
        const titles = data.docs
            .map((b: any) => b.title)
            .filter(Boolean)

        const uniqueTitles = Array.from(new Set(titles)) as string[];

        setTitleSuggestions(uniqueTitles.slice(0, 5));
        });
    }, [title]);

  /* ===== AUTHOR AUTOCOMPLETE ===== */
  useEffect(() => {
    if (selectingAuthor) {
        setSelectingAuthor(false);
        return;
    }

    if (author.length < 2) {
        setAuthorSuggestions([]);
        return;
    }

    fetch("https://openlibrary.org/search.json?author=" + author)
        .then((res) => res.json())
        .then((data) => {
        const authors = data.docs
            .map((b: any) => b.author_name?.[0])
            .filter(Boolean)

        const uniqueAuthors = Array.from(new Set(authors)) as string[];

        setAuthorSuggestions(uniqueAuthors.slice(0, 5));
        });
    }, [author]);

  /* ===== SUBJECT AUTOCOMPLETE ===== */
  useEffect(() => {
    if (selectingSubject) {
        setSelectingSubject(false);
        return;
    }

    if (subject.length < 2) {
        setSubjectSuggestions([]);
        return;
    }

    fetch("https://openlibrary.org/search.json?subject=" + subject)
        .then((res) => res.json())
        .then((data) => {
        const subjects = data.docs
            .map((b: any) => b.subject?.[0])
            .filter(Boolean)

        const uniqueSubjects = Array.from(new Set(subjects)) as string[];

        setSubjectSuggestions(uniqueSubjects.slice(0, 5));
        });
    }, [subject]);

  /* ===== FINAL SEARCH ===== */
  function doTheSearch() {
    setBooks([]);
    
    let url = "https://openlibrary.org/search.json?";

    if (title !== "") url += "title=" + title + "&";
    if (author !== "") url += "author=" + author + "&";
    if (year !== "") url += "first_publish_year=" + year + "&";
    if (subject !== "") url += "subject=" + subject + "&";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const uniqueBooks = removeDuplicatesByKey(data.docs);
        setBooks(uniqueBooks);
        });
  }

  function removeDuplicatesByKey(list: any[]) {
    const seen = new Set();
    const result = [];

    for (let item of list) {
        if (!seen.has(item.key)) {
        seen.add(item.key);
        result.push(item);
        }
    }

    return result;
    }

  return (
    <div className="container">
      <h1>Advanced search</h1>

      {/* ===== TITLE ===== */}
      <div className="autocomplete-field">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {titleSuggestions.length > 0 && (
          <div className="autocomplete-list">
            {titleSuggestions.map((t, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => {
                  setSelectingTitle(true);
                  setTitle(t);
                  setTitleSuggestions([]);
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== AUTHOR ===== */}
      <div className="autocomplete-field">
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        {authorSuggestions.length > 0 && (
          <div className="autocomplete-list">
            {authorSuggestions.map((a, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => {
                  setSelectingAuthor(true);
                  setAuthor(a);
                  setAuthorSuggestions([]);
                }}
              >
                {a}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== SUBJECT ===== */}
      <div className="autocomplete-field">
        <input
          type="text"
          placeholder="Subject / Tag"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {subjectSuggestions.length > 0 && (
          <div className="autocomplete-list">
            {subjectSuggestions.map((s, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => {
                  setSelectingSubject(true);
                  setSubject(s);
                  setSubjectSuggestions([]);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== YEAR ===== */}
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <button onClick={doTheSearch}>Search</button>

      {/* ===== RESULTS ===== */}
      {books.map((book) => {
        let cover = null;

        if (book.cover_i) {
            cover = (
            <img
                className="book-card-cover"
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
            <div key={book.key} className="book-card">
            <div className="book-card-content">
                {cover}

                <div className="book-card-text">
                <h2>{book.title}</h2>

                <Link href={"/book/" + book.key.replace("/works/", "")}>
                    See details
                </Link>
                </div>
            </div>
            </div>
        );
        })}

    </div>
  );
}
