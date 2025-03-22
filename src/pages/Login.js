import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
  }, []);
  const handleNormalLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://lyrics-masti-game-backend.vercel.app/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("access_token", response.data.token);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Login successful:", response.data);
      alert("Login Successful!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };
  const handleDirectRegister = async () => {
    try {
      const response = await axios.post(
        "https://lyrics-masti-game-backend.vercel.app/direct-register"
      );

      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Direct registration successful:", response.data);
      alert("You have been registered as a temporary player!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrorMessage("Direct registration failed. Please try again.");
    }
  };

  return (
    <div>
      <main className="container">
        <div className="container-fluid log-text">
          <header className="text-center">
            <h1>Welcome to Lyrics Masti</h1>
            <hr />
            <img
              src="/song-lyrics.png"
              alt="Logo"
              width="100"
              height="100"
              className="d-inline-block align-text-top"
              style={{
                border: "3px solid black",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
          </header>
        </div>

        <section className="my-custom-shadow p-3 mb-5 my-5 text-black bg-secondary bg-gradient border rounded-3 login-container">
          <div className="d-flex align-items-center flex-column">
            <img
              src="/Play Button.gif"
              alt="Play Now"
              style={{ cursor: "pointer", width: "150px" }}
              onClick={handleDirectRegister}
            />
            <strong className="mt-3">Use for admin only</strong>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="mt-3">
              <form onSubmit={handleNormalLogin}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success mt-3">
                  Login
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
