# 3D Euclidean Sequencer

A sophisticated 3D Euclidean rhythm sequencer built with Electron, Three.js, and Web Audio API. This application provides an immersive visual and audio experience for creating complex rhythmic patterns using Euclidean algorithms.

![Sequencer Demo](https://img.shields.io/badge/Platform-Electron-blue)
![License](https://img.shields.io/badge/License-ISC-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🎵 Features

### Core Functionality
- **3D Visual Sequencer**: Real-time 3D visualization of rhythmic patterns
- **Euclidean Rhythm Generation**: Algorithmic rhythm creation using Euclidean distribution
- **Multiple Sequencers**: Add and manage multiple sequencer instances
- **MIDI Support**: Full MIDI input/output capabilities
- **Audio Synthesis**: Built-in Web Audio API synthesis with customizable sounds

### Advanced Features
- **LFO Modulation**: Multiple Low-Frequency Oscillators for parameter modulation
- **Envelope Modulation**: ADSR envelopes for dynamic sound shaping
- **Arpeggiators**: Complex arpeggiator patterns with customizable parameters
- **Real-time Logging**: Comprehensive logging system with CSV export
- **Theme System**: Multiple visual themes for different aesthetics
- **Pop-out Windows**: Detachable sequencer windows for multi-monitor setups

### Visual Elements
- **3D Particle Systems**: Dynamic particle effects and connections
- **Interactive Spheres**: Clickable 3D objects representing rhythm steps
- **Waveform Visualization**: Real-time waveform and envelope displays
- **Shape Deformation**: Procedural geometry with noise-based deformation
- **Glossy Materials**: Advanced Three.js materials with glow effects

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/obblie/euclideanSequencer_AddSequencer.git
cd euclideanSequencer_AddSequencer

# Install dependencies
npm install

# Start the application
npm start
```

### Development Mode
```bash
# Run in development mode with dev tools
npm run dev
```

## 🎛️ Usage

### Basic Controls
- **Play/Pause**: Control sequencer playback
- **BPM**: Adjust tempo (beats per minute)
- **Steps**: Set the number of steps in the sequence
- **Beats**: Configure the number of active beats
- **Velocity**: Control note velocity/intensity

### Advanced Controls
- **LFO Modulation**: Drag LFO controls to modulate parameters
- **Envelope Shaping**: Configure ADSR envelopes for dynamic sounds
- **MIDI Mapping**: Connect external MIDI devices
- **Theme Selection**: Switch between visual themes
- **Shape Controls**: Modify 3D geometry and materials

### Adding Sequencers
- Click the "Add Sequencer" button to create additional sequencer instances
- Each sequencer can have independent parameters and patterns
- Sequencers can be synchronized or run independently

## 🎨 Visual Themes

The application includes multiple visual themes:
- **Luminous**: Default theme with glowing effects
- **Minimal**: Clean, simple aesthetic
- **Dark**: High contrast dark mode
- **Vibrant**: Colorful, energetic appearance

## 📊 Logging System

The application includes a comprehensive logging system:
- **Real-time Logging**: All events and interactions are logged
- **CSV Export**: Export logs for analysis and debugging
- **Performance Monitoring**: Track FPS and system performance
- **Error Tracking**: Capture and log errors for troubleshooting

## 🔧 Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js for WebGL rendering
- **Audio**: Web Audio API for synthesis and processing
- **Desktop**: Electron for cross-platform desktop application
- **Build**: Electron Builder for distribution

### Key Components
- `main.js`: Electron main process
- `preload.js`: Secure preload script for IPC
- `sketch.js`: Main application logic and 3D rendering
- `styles.css`: Application styling and themes

### Dependencies
- **Electron**: Desktop application framework
- **Three.js**: 3D graphics library
- **Web Audio API**: Audio synthesis and processing

## 🎯 Euclidean Rhythm Algorithm

The application implements the Euclidean rhythm algorithm, which distributes beats evenly across a sequence of steps. This creates complex, polyrhythmic patterns that are mathematically elegant and musically interesting.

### Algorithm Overview
1. **Input**: Number of beats and total steps
2. **Distribution**: Evenly distribute beats across steps
3. **Output**: Binary sequence representing active/inactive steps

## 🎵 MIDI Integration

### MIDI Input
- Connect external MIDI devices
- Map MIDI controls to sequencer parameters
- Real-time parameter adjustment

### MIDI Output
- Send MIDI messages to external devices
- Control hardware synthesizers
- Integrate with DAWs

## 🔧 Development

### Project Structure
```
euclideanSequencer_AddSequencer/
├── main.js              # Electron main process
├── preload.js           # Secure preload script
├── sketch.js            # Main application logic
├── index.html           # Main application window
├── styles.css           # Application styling
├── package.json         # Project configuration
└── assets/              # Application assets
```

### Building
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:mac    # macOS
npm run build:win    # Windows
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the excellent 3D graphics library
- **Electron Team**: For the powerful desktop application framework
- **Web Audio API**: For enabling sophisticated audio processing
- **Euclidean Rhythm Algorithm**: For the mathematical foundation of rhythm generation

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/obblie/euclideanSequencer_AddSequencer/issues) page
2. Review the logging system for debugging information
3. Export logs and include them in bug reports

---

**Made with ❤️ for the electronic music community** 