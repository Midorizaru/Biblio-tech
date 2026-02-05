"use client";

import { useEffect, useState } from "react";

export default function BookPage({ params }: any) {
    const [book, setBook] = useState<any>(null);

    useEffect(() => {
        fetch("https://openlibrary.org" + params.id + ".json")
            .then((response) => response.json())
            .then((data) => {
                setBook(data);
            });
    }, [params.id]);

    if (!book) {
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
        </div>
    );
}
