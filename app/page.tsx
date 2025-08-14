"use client";

import { useState } from "react";

export default function Home() {
    const [essay, setEssay] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/check-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ essay }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            console.log("Frontend got:", data);
            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    IELTS Essay Checker
                </h1>
                <textarea
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    placeholder="Write your essay here..."
                    className="w-full h-100 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none text-gray-700"
                />
                <button
                    onClick={handleCheck}
                    disabled={loading}
                    className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-semibold transition 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    {loading ? "Checking..." : "Check Essay"}
                </button>

                {result && !result.error && (
                    <div className="mt-6 space-y-2 text-gray-800">
                        <p>
                            <strong>Coherence:</strong>{" "}
                            {result.scores.coherence.score}/9
                        </p>
                        <p>
                            <strong>Cohesion:</strong>{" "}
                            {result.scores.cohesion.score}/9
                        </p>
                        <p>
                            <strong>Lexical Resource:</strong>{" "}
                            {result.scores.lexicalResource.score}/9
                        </p>
                        <p>
                            <strong>Grammar:</strong>{" "}
                            {result.scores.grammar.score}/9
                        </p>
                        <hr className="my-2" />
                        <p className="text-lg font-semibold">
                            Overall Score: {result.overallScore}/9
                        </p>
                    </div>
                )}

                {result?.error && (
                    <p className="text-red-500 mt-4">{result.error}</p>
                )}
            </div>
        </div>
    );
}
