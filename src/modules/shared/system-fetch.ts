import axios from "axios";
import { addMonths } from "date-fns";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const SYSTEM_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const systemAxiosInstance = axios.create({
  baseURL: SYSTEM_API_URL,
});

systemAxiosInstance.interceptors.request.use(async (req) => {
  const token = getAuthCookie();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  const decodedExpToken = jwtDecode(token).exp;
  const isExpired = decodedExpToken
    ? decodedExpToken < Date.now() / 1000
    : true;

  if (isExpired) {
    const refreshToken = localStorage.getItem("refresh-token");
    if (!refreshToken || !token) {
      Cookies.remove("auth");
      localStorage.removeItem("refresh-token");
      throw new Error("Unauthorized");
    }

    const result = await axios
      .post(
        `${SYSTEM_API_URL}/auth/refresh-token`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .catch((e) => {
        Cookies.remove("auth");
        localStorage.removeItem("refresh-token");
        return Promise.reject(e);
      });

    const { token: newToken } = result.data.data;
    const futureDate = addMonths(new Date(), 1);

    Cookies.set("auth", JSON.stringify({ token: newToken }), {
      path: "/",
      expires: futureDate,
      secure: true,
    });

    req.headers.Authorization = `Bearer ${newToken}`;
  }

  return req;
});

systemAxiosInstance.interceptors.response.use((response) => {
  return response;
});

function getAuthCookie() {
  const auth = Cookies.get("auth");
  const { token } = JSON.parse(auth || "{}");

  if (!token) {
    Cookies.remove("auth");
    localStorage.removeItem("refresh-token");
    throw new Error("Unauthorized");
  }

  return token;
}
