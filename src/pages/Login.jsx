import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isBlocked, handleLoginAttempt } from "./Authentication";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setShowSuccessPopup(false);
    setSuccessPopupMessage("");

    if (isBlocked()) {
      setError("You are blocked from logging in. Try again later.");
      return;
    }

    const result = handleLoginAttempt(username, password);

    if (result.success) {
      setSuccessPopupMessage(
        <>Login successful! Welcome <strong>{username}</strong></>
      );
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessPopupMessage("");

        navigate("/dashboard");

      }, 1000);
    } else {
      setShowSuccessPopup(false);
      setSuccessPopupMessage("");
      if (result.error) {
        setError(result.error);
      } else {
        setError("Invalid username or password");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        <div className="heading-text">
          <div className="logo"></div>
        </div>
        <div className="form-part">
          <form onSubmit={handleSubmit}>
             <div className="form-control">
               <input
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 required
                 aria-label="username"
               />
                <label>
                  <span style={{ transitionDelay: "0ms" }}>U</span>
                  <span style={{ transitionDelay: "50ms" }}>s</span>
                  <span style={{ transitionDelay: "100ms" }}>e</span>
                  <span style={{ transitionDelay: "150ms" }}>r</span>
                  <span style={{ transitionDelay: "200ms" }}>n</span>
                  <span style={{ transitionDelay: "250ms" }}>a</span>
                  <span style={{ transitionDelay: "300ms" }}>m</span>
                  <span style={{ transitionDelay: "350ms" }}>e</span>
                </label>
             </div>

             <div className="form-control password-container">
               <input
                 type={showPassword ? "text" : "password"}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 aria-label="Password"
               />
                <label>
                  <span style={{ transitionDelay: "0ms" }}>P</span>
                  <span style={{ transitionDelay: "50ms" }}>a</span>
                  <span style={{ transitionDelay: "100ms" }}>s</span>
                  <span style={{ transitionDelay: "150ms" }}>s</span>
                  <span style={{ transitionDelay: "200ms" }}>w</span>
                  <span style={{ transitionDelay: "250ms" }}>o</span>
                  <span style={{ transitionDelay: "300ms" }}>r</span>
                  <span style={{ transitionDelay: "350ms" }}>d</span>
                </label>
               <span
                 className="eye-icon"
                 onClick={() => setShowPassword(!showPassword)}
                 aria-label={showPassword ? "Hide password" : "Show password"}
               >
                 {showPassword ? "🙈" : "👁"}
               </span>
             </div>

            {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

            <button className="login-button" type="submit">
              Login
            </button>

            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#016962", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/create-account")}
              >
                Create one
              </span>
            </p>
          </form>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="success-popup-container">
          <div className="alert success">
            {successPopupMessage}
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;