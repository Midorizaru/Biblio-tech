"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuickSearch() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        if (!query) {
            return;
        }

        fetch("https://openlibrary.org/search.json?q=" + query)
            .then((response) => response.json())
            .then((data) => {
                setBooks(data.docs);
            });
    }, [query]);

    return (
        <div className="container">
            <h1>Results for "{query}"</h1>

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
