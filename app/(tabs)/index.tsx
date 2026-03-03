import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { SpotifyPlayerState } from "../spotify/SpotifyModule";
import SpotifyService from "../spotify/SpotifyService";

export default function HomeScreen() {
  const [state, setState] = useState<SpotifyPlayerState | null>(null);

  const connectSpotify = async () => {
    try {
      await SpotifyService.connect();
      console.log("Connected");
    } catch (e) {
      console.log("Connection error", e);
    }
  };

  const playSong = async () => {
    await SpotifyService.playTrack("3n3Ppam7vgaVa1iaRUc9Lp"); // example track ID
  };

  const pauseSong = async () => {
    await SpotifyService.pause();
  };

  const resumeSong = async () => {
    await SpotifyService.resume();
  };

  const nextSong = async () => {
    await SpotifyService.skipNext();
  };

  const previousSong = async () => {
    await SpotifyService.skipPrevious();
  };

  const getState = async () => {
    const current = await SpotifyService.getState();
    setState(current);
  };

  return (
    <View style={{ padding: 40 }}>
      <Button title="Connect" onPress={connectSpotify} />
      <Button title="Play" onPress={playSong} />
      <Button title="Pause" onPress={pauseSong} />
      <Button title="Resume" onPress={resumeSong} />
      <Button title="Next" onPress={nextSong} />
      <Button title="Previous" onPress={previousSong} />
      <Button title="Get State" onPress={getState} />

      {state && (
        <View style={{ marginTop: 20 }}>
          <Text>Track: {state.trackName}</Text>
          <Text>Artist: {state.artistName}</Text>
          <Text>Album: {state.albumName}</Text>
          <Text>Paused: {state.isPaused ? "Yes" : "No"}</Text>
          <Text>
            Position: {Math.floor(state.position / 1000)}s / {Math.floor(state.duration / 1000)}s
          </Text>
        </View>
      )}
    </View>
  );
}
