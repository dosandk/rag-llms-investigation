import { UnauthorizedError, BadRequestError, FetchError } from "./errors";

const httpClient = {
  async request(url = "", options = {}) {
    const urlString = url.toString();
    const response = await fetch(urlString, options);
    const data = await response.json();

    if (response.status === 401) {
      throw new UnauthorizedError(data, response);
    }

    if (response.status === 400) {
      throw new BadRequestError(data, response);
    }

    if (response.status !== 200) {
      throw new FetchError(data, response);
    }

    return data;
  },

  async get(url = "", options = {}) {
    const data = await this.request(url, {
      method: "GET",
      ...options,
    });

    return data;
  },

  async post(url = "", options = {}) {
    const data = await this.request(url, {
      method: "POST",
      ...options,
    });

    return data;
  },
};

export default httpClient;
