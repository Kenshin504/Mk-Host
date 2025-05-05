import { useState, useContext, useEffect, useRef } from "react"; // <-- add useRef
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { UploadCloud } from "lucide-react";

const placeholderImage = "https://via.placeholder.com/150?text=Profile";

function Account() {
  const {
    imageSrc,
    setImageSrc,
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  const contentRef = useRef(null); // <-- reference to content section

  const [tempFullName, setTempFullName] = useState(fullName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [showUpload, setShowUpload] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop,
  });

  const handleSave = (event) => {
    event.preventDefault();
    setFullName(tempFullName);
    setEmail(tempEmail);
    setPhone(tempPhone);

    localStorage.setItem("fullName", tempFullName);
    localStorage.setItem("email", tempEmail);
    localStorage.setItem("phone", tempPhone);

    alert("Profile information saved successfully!");
  };

  const handleChangeCredentials = () => {
    navigate("/change-credentials");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
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
        <b className="content-header">Account</b>
        <div className="account-container">
          <form className="account-form" onSubmit={handleSave}>
            <b>Name</b>
            <p>
              <input
                type="text"
                className="editprofile-input"
                value={tempFullName}
                onChange={(e) => setTempFullName(e.target.value)}
              />
            </p>
            <b>Email</b>
            <p>
              <input
                type="email"
                className="editprofile-input"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
              />
            </p>
            <b>Phone Number</b>
            <p>
              <input
                type="text"
                className="editprofile-input"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
              />
            </p>
            <Button type="submit" className="saveprofile-button">
              Save
            </Button>
          </form>

          <div className="change-picture">
            <img
              src={imageSrc}
              className="account-pic"
              alt="Profile Picture"
            />

            {/* Button under profile picture */}
            <div className="button-container">
              <Button onClick={() => setShowUpload(!showUpload)}>Change Picture</Button>
            </div>

            {showUpload && (
              <div {...getRootProps()} className="upload-box">
                <input {...getInputProps()} />
                <div className="upload-content text-center">
                  <UploadCloud className="w-10 h-10 text-gray-500 mx-auto" />
                  <p className="text-gray-600">Drag & drop or click to upload</p>
                  <Button className="mt-3">Choose File</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Account;
