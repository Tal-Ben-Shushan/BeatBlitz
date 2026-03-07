import { env } from "@/config/env";
import axios from "axios";

export const AUTH_BASE_URL = "https://accounts.spotify.com";
export const API_BASE_URL = "https://api.spotify.com/v1";

const authInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const spotifyAuthApi = {
  refreshToken: async (refreshToken: string) => {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.spotifyClientId,
    });
    const response = await authInstance.post("/api/token", params.toString());
    return response.data;
  },

  exchangeCode: async (authCode: string, redirectUri: string, codeVerifier: string) => {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUri,
      client_id: env.spotifyClientId,
      code_verifier: codeVerifier,
    });
    const response = await authInstance.post("/api/token", params.toString());
    return response.data;
  },
};

export const spotifyPlayerApi = {
  getDevices: async (token: string) => {
    const response = await apiInstance.get("/me/player/devices", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  transferPlayback: async (token: string, deviceId: string) => {
    const response = await apiInstance.put(
      "/me/player",
      { device_ids: [deviceId], play: true },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  play: async (token: string) => {
    const response = await apiInstance.put(
      "/me/player/play",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  pause: async (token: string) => {
    const response = await apiInstance.put(
      "/me/player/pause",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },
};
