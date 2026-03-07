import { spotifyAuthApi } from "@/services/api";
import * as AuthSession from "expo-auth-session";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SpotifyAuth() {
  const { setToken } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: "beatblitz", path: "spotify-auth" });

  useEffect(() => {
    if (params.code) {
      exchangeCode(params.code as string);
    }
  }, [params.code]);

  const exchangeCode = async (authCode: string) => {
    try {
      // 1. GET THE VERIFIER WE SAVED IN THE PREVIOUS STEP
      const savedVerifier = await SecureStore.getItemAsync("temp_code_verifier");

      const data = await spotifyAuthApi.exchangeCode(authCode, redirectUri, savedVerifier || "");

      if (data.access_token) {
        // 2. CLEAN UP THE TEMPORARY VERIFIER
        await SecureStore.deleteItemAsync("temp_code_verifier");

        // 3. SAVE THE ACTUAL TOKEN
        const expirationDate = new Date().getTime() + data.expires_in * 1000;
        await SecureStore.setItemAsync(
          "auth_data",
          JSON.stringify({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expirationDate,
          }),
        );

        setToken(data.access_token);
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("Exchange Error:", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1DB954" />
      <Text>Connecting to Spotify...</Text>
    </View>
  );
}
