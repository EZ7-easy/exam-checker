"use client";

import { useState } from "react";

export default function Home() {
    const [essay, setEssay] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAnalysis("");

        try {
            const res = await fetch("/api/check-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ essay }),
            });

            const data = await res.json();
            if (res.ok) {
                setAnalysis(data.analysis);
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Essay Checker</h1>
            <form onSubmit={handleSubmit}>
        <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste your essay here..."
            className="w-full p-3 border rounded-lg h-48"
            required
        />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Checking..." : "Check Essay"}
                </button>
            </form>

            {analysis && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h2 className="font-semibold mb-2">AI Analysis:</h2>
                    <pre className="whitespace-pre-wrap">{analysis}</pre>
                </div>
            )}
        </div>
    );
}
