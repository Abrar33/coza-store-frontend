const BASE_URL = "http://localhost:3000/api/users";

// ⏩ Initial Signup – Sends OTP to email
export const signupUser = async ({ name, email, password, role }) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    return await res.json();
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error };
  }
};

// 📩 OTP Verification – Validates OTP
export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    console.log("OTP Response:", data);
    return data;
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, error };
  }
};


// 🔐 Login – Fetches token & role
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error };
  }
};

// 🔄 Resend OTP (optional)
export const resendOtp = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { success: false, error };
  }
};