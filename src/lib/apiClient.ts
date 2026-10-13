import { ofetch } from "ofetch";

const apiClient = ofetch.create({
  baseURL: "/api",
  credentials: "include",
  onResponseError({ response }) {
    const message = response._data?.message || "Something went wrong.";

    throw new Error(message);
  },
});

export default apiClient;
