import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onResponseError({ response }) {
    const message = response._data?.message || "Something went wrong.";

    throw new Error(message);
  },
});

export default apiClient;
