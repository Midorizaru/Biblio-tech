"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookPage() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<any>(null);
  const [wiki, setWiki] = useState<any>(null);

  useEffect(() => {
    fetch("https://openlibrary.org/works/" + id + ".json")
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
      });
  }, [id]);

  useEffect(() => {
    if (book === null) {
      return;
    }

    if (!book.title) {
      return;
    }

    fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(book.title)
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.type === "disambiguation") {
          return;
        }

        setWiki(data);
      });
  }, [book]);

  if (book === null) {
    return <p>Loading...</p>;
  }

  let cover = null;
  if (book.covers && book.covers.length > 0) {
    cover = (
      <img
        className="book-cover"
        src={
          "https://covers.openlibrary.org/b/id/" +
          book.covers[0] +
          "-L.jpg"
        }
        alt="Book cover"
      />
    );
  }

  let subjects = null;
  if (book.subjects && book.subjects.length > 0) {
    subjects = (
      <p>
        <strong>Department:</strong>{" "}
        {book.subjects.slice(0, 3).join(", ")}
      </p>
    );
  }

  let publishDate = null;
  if (book.first_publish_date) {
    publishDate = (
      <p>
        <strong>First published:</strong> {book.first_publish_date}
      </p>
    );
  }

  let description = null;
  if (book.description) {
    description = (
      <p className="book-description">
        {typeof book.description === "string"
          ? book.description
          : book.description.value}
      </p>
    );
  }

  let wikiSection = null;
  if (wiki !== null) {
    let wikiImage = null;

    if (wiki.thumbnail && wiki.thumbnail.source) {
      wikiImage = (
        <img
          className="wiki-cover"
          src={wiki.thumbnail.source}
          alt="Wikipedia illustration"
        />
      );
    }

    wikiSection = (
      <div className="wiki">
        <h2>Wikipedia</h2>
        {wikiImage}
        <p>{wiki.extract}</p>
        <a href={wiki.content_urls.desktop.page} target="_blank">
          Read more on Wikipedia
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      {cover}

      <h1 className="book-title">{book.title}</h1>

      {publishDate}
      {subjects}
      {description}

      {wikiSection}
    </div>
  );
}
