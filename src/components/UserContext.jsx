import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [imageSrc, setImageSrc] = useState(() => {
    return localStorage.getItem("profileImage") || "src/images/user-logo.png";
  });

  const [fullName, setFullName] = useState(
    () => localStorage.getItem("fullName") || ""
  );
  const [birthday, setBirthday] = useState(
    () => localStorage.getItem("birthday") || ""
  );
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "");

  useEffect(() => {
    localStorage.setItem("profileImage", imageSrc);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("birthday", birthday);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
  }, [imageSrc, fullName, birthday, email, phone]);

  return (
    <UserContext.Provider
      value={{
        imageSrc,
        setImageSrc,
        fullName,
        setFullName,
        birthday,
        setBirthday,
        email,
        setEmail,
        phone,
        setPhone,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
