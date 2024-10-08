import axios from "axios";
import { addMinutes } from "date-fns";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const API_URL = process.env.NEXT_PUBLIC_LOBBY_SERKSA_API_URL || "";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

const TOKEN_KEY = "lobby-serksa-token";

axiosInstance.interceptors.request.use(async (req) => {
  const token = getLobbySerksaToken();
  let isExpired = true;
  if (token !== "") {
    req.headers["authorization"] = `Bearer ${token}`;

    const decodedExpToken = jwtDecode(token).exp;
    isExpired = decodedExpToken ? decodedExpToken < Date.now() / 1000 : true;
  }

  if (isExpired) {
    const token = await fetch("/api/lobby-serksa/generate-token", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => res.token);

    const futureDate = addMinutes(new Date(), 55);
    Cookies.set(TOKEN_KEY, JSON.stringify({ token }), {
      expires: futureDate,
      sameSite: "strict",
    });

    req.headers["authorization"] = `Bearer ${token}`;
  }

  return req;
});

axiosInstance.interceptors.response.use((response) => {
  return response;
});

function getLobbySerksaToken() {
  const auth = Cookies.get(TOKEN_KEY);
  const { token } = JSON.parse(auth || `{"token": ""}`);
  return token;
}
