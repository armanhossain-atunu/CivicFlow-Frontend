import { ofetch } from "ofetch/node";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const apiClient = ofetch.create({
  baseURL: BASE_URL,
});

export default apiClient;
