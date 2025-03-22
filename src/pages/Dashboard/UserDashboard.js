import React, { useState } from "react";
import { Music, RefreshCw, Send, Trophy, User } from "lucide-react";

// Helper function for fuzzy matching
const cleanString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

function UserDashboard() {
  const [lyricSnippet, setLyricSnippet] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [chances, setChances] = useState(5);
  const [correctSong, setCorrectSong] = useState("");
  const [singerName, setSingerName] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNewLyric = async () => {
    if (chances === 0) return;

    setLoading(true);
    setLyricSnippet("Fetching lyrics, please wait...");
    setGameStatus("playing");
    setUserGuess("");

    try {
      const res = await fetch(
        "https://lyrics-masti-game-backend.vercel.app/generate-lyrics"
      );
      const data = await res.json();

      if (res.ok) {
        setLyricSnippet(data.generated_lyrics);
        setCorrectSong(data.title);
        setSingerName(data.artist);
      } else {
        setLyricSnippet("Error: " + (data.error || "Error fetching lyrics."));
        setGameStatus("idle");
      }
    } catch (err) {
      setLyricSnippet("Error fetching lyrics. Please try again.");
      setGameStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!userGuess.trim() || chances === 0) return;

    // Always consume a chance when checking answer
    setChances((prev) => Math.max(0, prev - 1));

    // Fuzzy match logic
    const cleanedGuess = cleanString(userGuess);
    const cleanedCorrect = cleanString(correctSong);
    const isCorrect =
      cleanedCorrect.includes(cleanedGuess) ||
      cleanedGuess.includes(cleanedCorrect);

    if (isCorrect) {
      setGameStatus("correct");
      setScore((prev) => prev + 1);
    } else {
      setGameStatus("incorrect");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-4"
      style={{
        background: "linear-gradient(to bottom right, #7c3aed, #2563eb)",
      }}
    >
      <div
        className="bg-white rounded-4 shadow p-4 p-md-5"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0 d-flex align-items-center gap-2">
            <Music className="text-primary" size={32} />
            Lyric Match
          </h1>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <Trophy className="text-warning" size={20} />
              <span className="fw-bold">{score}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <User className="text-primary" size={20} />
              <span className="fw-bold">{chances} chances left</span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-4">
          <div className="bg-light rounded-3 p-4">
            <p
              className="lead fst-italic mb-0"
              style={{ whiteSpace: "pre-line" }}
            >
              {lyricSnippet || "Click 'Generate Lyrics' to start playing!"}
            </p>
          </div>

          <div>
            <button
              onClick={generateNewLyric}
              disabled={loading || chances === 0}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <RefreshCw size={20} />
              {loading ? "Loading..." : "Generate Lyrics"}
            </button>
          </div>

          <div className="d-flex flex-column gap-3">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Enter your song title guess..."
              className="form-control form-control-lg"
              disabled={chances === 0}
            />
            <button
              onClick={checkAnswer}
              disabled={!userGuess || gameStatus !== "playing" || chances === 0}
              className="btn btn-success d-flex align-items-center justify-content-center gap-2"
            >
              <Send size={20} />
              Check Answer
            </button>
          </div>

          {gameStatus === "correct" && (
            <div className="alert alert-success">Correct! Well done! 🎉</div>
          )}

          {gameStatus === "incorrect" && (
            <div className="alert alert-danger">
              <p className="mb-1">
                Incorrect! The song was:{" "}
                <strong>
                  {correctSong} by {singerName}
                </strong>
              </p>
              {chances > 0 ? (
                <p className="small mb-0">Try again with a new lyric!</p>
              ) : (
                <p className="small mb-0">No chances left!</p>
              )}
            </div>
          )}

          {/* Show game over panel separately */}
          {chances === 0 && (
            <div className="alert alert-dark">
              <p className="mb-1">Game Over! You’ve used all your chances.</p>
              <button
                onClick={() => {
                  setScore(0);
                  setChances(5);
                  setGameStatus("idle");
                  setLyricSnippet("");
                  setUserGuess("");
                }}
                className="btn btn-dark"
              >
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
