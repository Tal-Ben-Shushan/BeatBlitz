import { NativeModules } from 'react-native';

export type SpotifyPlayerState = {
  trackName: string;
  artistName: string;
  albumName: string;
  isPaused: boolean;
  position: number;
  duration: number;
};

export interface SpotifyNativeModule {
  connect(clientId: string, redirectUri: string): Promise<boolean>;
  disconnect(): Promise<boolean>;

  playUri(uri: string): Promise<boolean>;
  pause(): Promise<boolean>;
  resume(): Promise<boolean>;
  skipNext(): Promise<boolean>;
  skipPrevious(): Promise<boolean>;
  seekTo(positionMs: number): Promise<boolean>;

  getPlayerState(): Promise<SpotifyPlayerState>;
}

const { SpotifyModule } = NativeModules;

export default SpotifyModule as SpotifyNativeModule;