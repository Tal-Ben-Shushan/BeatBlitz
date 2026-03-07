import { ThemedText } from "@/components/themed-text";
import { env } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import { spotifyPlayerApi } from "@/services/api";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, Button, Linking, StyleSheet, View } from "react-native";

const SCOPES = ["user-modify-playback-state", "user-read-playback-state"];

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function TabTwoScreen() {
  const { token, logout, isLoading } = useAuth();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: "beatblitz", path: "spotify-auth" });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: env.spotifyClientId,
      scopes: SCOPES,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery,
  );

  const handleLogin = async () => {
    if (request?.codeVerifier) {
      // SAVE THE VERIFIER BEFORE THE BROWSER OPENS
      await SecureStore.setItemAsync("temp_code_verifier", request.codeVerifier);
      promptAsync();
    }
  };

  const play = async () => {
    if (!token) return;
    try {
      await spotifyPlayerApi.play(token);
      console.log("Playback resumed!");
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("No active device found. Open Spotify on your phone first!");
      } else {
        console.error("Play Error:", error.response?.data || error.message);
      }
    }
  };

  const pause = async () => {
    if (!token) return;
    try {
      await spotifyPlayerApi.pause(token);
      console.log("Playback paused!");
    } catch (error: any) {
      console.error("Pause Error:", error.response?.data || error.message);
    }
  };

  if (isLoading)
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );

  return (
    <View style={styles.container}>
      {!token ? (
        <Button title="Login to Spotify" disabled={!request} onPress={handleLogin} />
      ) : (
        <>
          <Button title="Play" onPress={play} />
          <Button title="Pause" onPress={pause} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
