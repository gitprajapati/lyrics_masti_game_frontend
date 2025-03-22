import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [editingSong, setEditingSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        "https://lyrics-masti-game-backend.vercel.app/songs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();

    if (!title.trim() || !artist.trim()) {
      console.error("Title and artist are required");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const requestData = { title: title.trim(), artist: artist.trim() };

      await axios.post(
        "https://lyrics-masti-game-backend.vercel.app/songs",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTitle("");
      setArtist("");
      fetchSongs();
    } catch (error) {
      console.error(
        "Error adding song:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditSong = (song) => {
    setEditingSong(song);
    setTitle(song.title);
    setArtist(song.artist);
  };

  const handleUpdateSong = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `https://lyrics-masti-game-backend.vercel.app/songs/${editingSong.id}`,
        { title, artist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingSong(null);
      setTitle("");
      setArtist("");
      fetchSongs();
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `https://lyrics-masti-game-backend.vercel.app/songs/${songId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard - Manage Songs</h2>

      <form
        onSubmit={editingSong ? handleUpdateSong : handleAddSong}
        className="mb-3"
      >
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Artist Name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingSong ? "Update Song" : "Add Song"}
        </button>
      </form>

      <h3>All Songs</h3>
      <ul className="list-group">
        {songs.map((song) => (
          <li
            key={song.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{song.title}</strong> - {song.artist}
            </span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEditSong(song)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteSong(song.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
