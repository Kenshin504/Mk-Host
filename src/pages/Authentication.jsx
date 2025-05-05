export const isBlocked = () => {
    const blockTime = localStorage.getItem("blockTime");
    if (blockTime) {
      const currentTime = new Date().getTime();
      const blockedUntil = parseInt(blockTime) + 1 * 1 * 1000; //eto yung time durtion ng block (hr * minute + millisecond)
      /*Time duration of blocking
          60*60*1000 = 1hr
          30*60*1000 = 30min
          10*60*1000 = 10min
          5*60*1000 = 5min
       */
      if (currentTime < blockedUntil) {
        return true;
      }
      // Unblock after the duration served
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("blockTime");
    }
    return false;
  };
  
  // Function to handle login attempts
  export const handleLoginAttempt = (username, password) => {
    if (username === "admin" && password === "password") {
      localStorage.setItem("username", username);
      localStorage.removeItem("loginAttempts");
      return { success: true, error: "" };
    } else {
      let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
      attempts++;
      localStorage.setItem("loginAttempts", attempts);
  
      // Attemps
      if (attempts >= 3) {
        const blockTime = new Date().getTime();
        localStorage.setItem("blockTime", blockTime.toString());
        return {
          success: false,
          error: "Too many failed attempts. Try again later.",
        };
      } else {
        return { success: false, error: "Invalid username or password" };
      }
    }
  };  