const BASE_URL = "https://disha-a-true-saver-in-disaster-scenarios.onrender.com";

export const sendOTP = async (phone) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  return response.json();
};

export const verifyOTP = async (phone, otp) => {
  const response = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, otp }),
  });

  return response;
};