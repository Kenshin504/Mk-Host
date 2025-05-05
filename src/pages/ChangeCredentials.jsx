import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";

function ChangeCredentials() {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [password, setPassword] = useState(localStorage.getItem("password") || "");

  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    localStorage.setItem("username", newUsername);
    localStorage.setItem("password", newPassword);

    setError("");
    navigate("/account");
  };

  useEffect(() => {
    if (contentRef.current) {
      if (darkMode) {
        contentRef.current.classList.add("dark-mode");
      } else {
        contentRef.current.classList.remove("dark-mode");
      }
    }
  }, [darkMode]);

  return (
    <Layout>
      <div ref={contentRef} className="content">
        <b className="content-header">Change Username/Password</b>
        <div className="account-container">
          <form className="account-form" onSubmit={handleSave}>
            <b>New Username</b>
            <p>
              <input
                type="text"
                className="editprofile-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </p>

            <b>New Password</b>
            <div className="password-container">
              <p>
                <input
                  type={showPassword ? "text" : "password"}
                  className="editprofile-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  style={{ paddingTop: "4px"}}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </p>
            </div>

            <b>Confirm New Password</b>
            <div className="password-container">
              <p>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="editprofile-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  style={{ paddingTop: "4px"}}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </span>
              </p>
            </div>

            {/* Error message shown in red text */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Button type="submit" className="saveprofile-button">
              Save
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ChangeCredentials;