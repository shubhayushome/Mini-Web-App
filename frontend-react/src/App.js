import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [history, setHistory] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const submitUrl = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await axios.post("http://host.docker.internal:8080/summarize-url", { url });
      setSummary(res.data.summary || "Summary received.");
      setUrl("");
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setSummary("");
  };

  useEffect(() => {
    if (activeTab === "history") {
      axios.get("http://host.docker.internal:8080/history").then((res) => {
        setHistory(res.data);
      });
    }
  }, [activeTab]);

  const groupHistoryByDate = () => {
    const grouped = {};
    history.forEach((item) => {
      const date = new Date(item.createdAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
      <nav className="bg-white shadow-md py-4 mb-12">
        <div className="flex justify-center space-x-8">
          <button
            className={`text-lg font-semibold px-6 py-2 rounded-full transition duration-300 ease-in-out ${
              activeTab === "home" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-200"
            }`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`text-lg font-semibold px-6 py-2 rounded-full transition duration-300 ease-in-out ${
              activeTab === "history" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-200"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
      </nav>

      {activeTab === "home" && (
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter a website URL"
            className="w-[80%] max-w-2xl p-4 border border-gray-300 rounded-2xl shadow-sm mb-4 bg-white"
          />
          <button
            onClick={submitUrl}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
          >
            {loading ? "Summarizing..." : "Submit"}
          </button>

          {summary && (
            <div className="mt-10 w-[80%] max-w-3xl p-6 bg-white rounded-2xl shadow-xl text-left">
              <h2 className="text-xl font-bold mb-3 text-gray-800">Summary</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-600 font-medium">{JSON.stringify(error)}</div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="px-6 pb-12">
          {Object.entries(groupHistoryByDate()).map(([date, entries]) => (
            <div key={date} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">{date}</h2>
              {entries.map((entry) => {
                let summaryText = "";
                try {
                  const parsed = typeof entry.summary === "string" ? JSON.parse(entry.summary) : entry.summary;
                  summaryText = parsed.summary || "";
                } catch {
                  summaryText = entry.summary || "";
                }
                const isExpanded = expandedItems.has(entry.id);
                const shortSummary = summaryText.split(" ").slice(0, 20).join(" ") + "...";
                return (
  <div
    key={entry.id}
    className="w-[80%] mx-auto p-6 bg-white rounded-xl shadow-md mb-4 transition duration-200 hover:shadow-xl border-l-4 border-blue-500"
  >
    <div className="flex justify-between items-start mb-2 text-sm text-gray-500">
      <div className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg max-w-[70%] truncate">
        🔗 {entry.url}
      </div>
      <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
    </div>
    <p className="text-gray-700 mt-2">
      {isExpanded ? summaryText : shortSummary}
      <span
        className="text-blue-500 ml-2 cursor-pointer hover:underline"
        onClick={() => toggleExpand(entry.id)}
      >
        {isExpanded ? "Show less" : "Read more"}
      </span>
    </p>
  </div>
);

              })}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
