import Cookies from "js-cookie";

const TOKEN_KEY = "userToken";

// ✅ Set Token in Cookie
export const setToken = (token: string, expiryInHours: number = 24) => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiryInHours);

  Cookies.set(TOKEN_KEY, token, {
    expires: expiryDate, // Expiry time in hours
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "strict",
  });
};

// ✅ Get Token from Cookie
export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null;
};

// ✅ Remove Token (Logout)
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
