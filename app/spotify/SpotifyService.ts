import SpotifyModule, { SpotifyPlayerState } from "./SpotifyModule";

const CLIENT_ID = "YOUR_CLIENT_ID";
const REDIRECT_URI = "myapp://spotify-auth";

class SpotifyService {
  async connect() {
    return SpotifyModule.connect(CLIENT_ID, REDIRECT_URI);
  }

  async disconnect() {
    return SpotifyModule.disconnect();
  }

  async playTrack(trackId: string) {
    return SpotifyModule.playUri(`spotify:track:${trackId}`);
  }

  async playPlaylist(playlistId: string) {
    return SpotifyModule.playUri(`spotify:playlist:${playlistId}`);
  }

  async pause() {
    return SpotifyModule.pause();
  }

  async resume() {
    return SpotifyModule.resume();
  }

  async skipNext() {
    return SpotifyModule.skipNext();
  }

  async skipPrevious() {
    return SpotifyModule.skipPrevious();
  }

  async seek(positionMs: number) {
    return SpotifyModule.seekTo(positionMs);
  }

  async getState(): Promise<SpotifyPlayerState> {
    return SpotifyModule.getPlayerState();
  }
}

export default new SpotifyService();
