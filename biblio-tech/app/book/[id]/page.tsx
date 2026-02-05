"use client";

import { useEffect, useState } from "react";

export default function BookPage({ params }: any) {
    const [book, setBook] = useState<any>(null);
    const [wiki, setWiki] = useState<any>(null);

    useEffect(() => {
        fetch("https://openlibrary.org" + params.id + ".json")
            .then((response) => response.json())
            .then((data) => {
                setBook(data);
            });
    }, [params.id]);

    useEffect(() => {
        if (!book || !book.title) {
            return;
        }

        fetch(
            "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(book.title)
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data.title || data.type === "disambiguation") {
                    return;
                }

                setWiki(data);
            });
    }, [book]);

    if (book === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <h1 className="book-title">{book.title}</h1>

            {book.description && (
                <p className="book-description">
                    {typeof book.description === "string"
                        ? book.description
                        : book.description.value}
                </p>
            )}

            {wiki && (
                <div className="wiki">
                    <h2>Wikipedia</h2>

                    <p>{wiki.extract}</p>

                    <a href={wiki.content_urls.desktop.page} target="_blank">
                        Read more on Wikipedia
                    </a>
                </div>
            )}
        </div>
    );
}
