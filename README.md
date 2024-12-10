# DojoLibre

A comprehensive martial arts training and dojo management platform.

## Timer Component

The Timer component provides precise timing functionality with audio cues for martial arts training sessions.

### Features

- Precise timing using requestAnimationFrame
- Audio cues at 10 seconds and 0 seconds
- Pause/resume functionality with exact timing
- Rest period support
- Configurable round and rest durations
- Settings persistence in localStorage

### Usage

```tsx
import Timer from './components/tools/Timer';

function App() {
  return (
    <div>
      <Timer />
    </div>
  );
}
```

### Audio Files

The Timer component requires two audio files in the public directory:
- `beep.mp3` - Final beep sound at 0:00
- `cookedtimer.mp3` - 10-second warning sound

### Configuration

Timer settings are automatically saved to localStorage and include:
- Round duration (minutes and seconds)
- Rest period duration (minutes)
- Audio preferences

### Timing Precision

The Timer uses requestAnimationFrame for precise timing and ensures:
- Audio cues play exactly at 10 seconds and 0 seconds
- Pause/resume maintains exact timing
- Rest periods transition smoothly

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
