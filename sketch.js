// LOGGING SYSTEM - MUST BE AT THE TOP BEFORE ANY OTHER CODE
// Global log storage for CSV export
let logStorage = [];
const MAX_LOG_ENTRIES = 10000; // Prevent memory issues

// Store original console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Override console methods to capture all logs
console.log = function(...args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    logStorage.push({
        timestamp: timestamp,
        section: 'Console',
        message: message,
        data: null
    });
    
    // Keep log storage under control
    if (logStorage.length > MAX_LOG_ENTRIES) {
        logStorage = logStorage.slice(-MAX_LOG_ENTRIES / 2);
    }
    
    // Call original console.log
    originalConsoleLog.apply(console, args);
    
    // Update button count periodically
    if (logStorage.length % 10 === 0) { // Update every 10 logs
        setTimeout(updateExportButtonCount, 100);
    }
};

console.error = function(...args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    logStorage.push({
        timestamp: timestamp,
        section: 'Error',
        message: message,
        data: null
    });
    
    // Keep log storage under control
    if (logStorage.length > MAX_LOG_ENTRIES) {
        logStorage = logStorage.slice(-MAX_LOG_ENTRIES / 2);
    }
    
    // Call original console.error
    originalConsoleError.apply(console, args);
    
    // Update button count periodically
    if (logStorage.length % 10 === 0) { // Update every 10 logs
        setTimeout(updateExportButtonCount, 100);
    }
};

console.warn = function(...args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    logStorage.push({
        timestamp: timestamp,
        section: 'Warning',
        message: message,
        data: null
    });
    
    // Keep log storage under control
    if (logStorage.length > MAX_LOG_ENTRIES) {
        logStorage = logStorage.slice(-MAX_LOG_ENTRIES / 2);
    }
    
    // Call original console.warn
    originalConsoleWarn.apply(console, args);
    
    // Update button count periodically
    if (logStorage.length % 10 === 0) { // Update every 10 logs
        setTimeout(updateExportButtonCount, 100);
    }
};

// Add immediate test logs to verify logging is working
console.log('Logging system initialized - this should be captured');
console.error('Test error message - this should be captured');
console.warn('Test warning message - this should be captured');

// Test if the application can start
console.log('Application starting...');
try {
    console.log('Testing basic functionality...');
} catch (error) {
    console.error('Startup error:', error);
}

// Simple test function to add logs manually
function addTestLogs() {
    console.log('Test log 1 - manual addition');
    console.log('Test log 2 - manual addition');
    console.error('Test error - manual addition');
    console.warn('Test warning - manual addition');
    console.log('Current log count:', logStorage.length);
}

// Simple CSV export function
function exportLogsSimple() {
    if (logStorage.length === 0) {
        console.log('No logs to export - adding test logs');
        addTestLogs();
    }
    
    console.log('Exporting', logStorage.length, 'logs');
    console.log('Log storage contents:', logStorage);
    
    // Create CSV content
    const csvHeader = 'Timestamp,Section,Message,Data\n';
    const csvContent = logStorage.map(log => {
        const timestamp = log.timestamp || new Date().toISOString();
        const section = log.section || '';
        const message = log.message || '';
        const data = log.data ? JSON.stringify(log.data).replace(/"/g, '""') : '';
        
        return `"${timestamp}","${section}","${message}","${data}"`;
    }).join('\n');
    
    const fullCsv = csvHeader + csvContent;
    
    console.log('CSV content length:', fullCsv.length);
    console.log('CSV header:', csvHeader);
    console.log('First few log entries:', csvContent.split('\n').slice(0, 5));
    
    // Create blob and download
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sequencer-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('CSV exported with', logStorage.length, 'logs');
    alert(`Exported ${logStorage.length} logs to CSV file\n\nFile: ${a.download}\n\nCheck your Downloads folder.`);
}

// Make functions globally available for testing
window.addTestLogs = addTestLogs;
window.exportLogsSimple = exportLogsSimple;
window.logStorage = logStorage;

// Global variables for WebGL and Three.js
let scene, camera, renderer, controls;
let particleSystem, particleGeometry, particleMaterial;
let lineSystem;
let spheres = [];
let spheres2 = [];

// Additional sequencer variables
let additionalSequencers = [];
let nextSequencerRadius = 8; // Start after the second sequencer

// Replace legacy sequencers with unified Sequencer instances
let sequencer1 = null;
let sequencer2 = null;

// Global variables for pop-out window
let popOutWindow = null;
let popOutRenderer = null;
let popOutCamera = null;

let currentThemeName = 'luminous';  // Initialize with default theme
let totalSteps = 16;
let beats = 16;
let sequence = [];
let currentStep = 0;
let bpm = 120;
let lastStepTime1 = 0;
let lastStepTime2 = 0;

// Animation arrays for step animations
let animations = [];
let animations2 = [];

// FPS Counter variables
let fpsCounter;
let frameCount = 0;
let lastFpsUpdate = 0;

let audioContext;
let oscillator;
let gainNode;
let audioStarted = false;
let pitches = [];
let rootNote = 60; // Middle C
let scaleType = 'minor';  // Changed from 'major' to 'minor'
let octaveRange = 2;
let raycaster, mouse;
let sequenceMode1 = 'forward';
let sequenceDirection1 = 1;  // Used for ping-pong mode
let brownianRange1 = 1;
let lastBrownianStep1 = 0;
let midiOutput = null;
let midiOutputs = [];
let midiEnabled = false;
let internalAudioEnabled = false;  // Default to false
let midiOutputEnabled = true;
let sequence2 = [];
let currentStep2 = 0;
let beats2 = 16;
let totalSteps2 = 16;
let pitches2 = [];
let midiChannel1 = 0;  // Channel 1 (0-based)
let midiChannel2 = 1;  // Channel 2 (0-based)
let rotationSpeed = 0;  // Default to no rotation
let autoRotate = true;
let particles = [];
let NUM_PARTICLES = 50;
const BASE_PARTICLE_SPEED = 0.03;  // Doubled base speed
const COHESION_DISTANCE = 3;
const SEPARATION_DISTANCE = 1.5;
const ALIGNMENT_DISTANCE = 2;
let parallaxLayers = 3;
let sphereInfo;
const MAX_LINE_DISTANCE = 2.5; // Reduced for better performance
const MIN_LINE_DISTANCE = 0.8; // Increased minimum distance
let lineSegments = []; // Array to store line segments
const WINDOW_ALPHA = 0.15;  // Base opacity for windows
let particleSpeed = 0.5;    // Default speed multiplier
let swarmCohesion = 1.0;    // Default swarm cohesion
const WINDOW_OPACITY = 0.1;  // Reduced opacity
const WINDOW_FADE_SPEED = 0.1; // Faster fading
let windows = [];
let particleSystemEnabled = true;
let lineConnectionsEnabled = true;
let sequenceMode2 = 'forward';
let sequenceDirection2 = 1;
let brownianRange2 = 1;
let lastBrownianStep2 = 0;
let lfoRate = 1;
let lfoDepth = 50;
let lfoShape = 'sine';
let lfoActive = false;
let lfoPhase = 0;
let lfoTarget = null;
let lfoTargetOriginalValue = 0;
let lfoTargetMin = 0;
let lfoTargetMax = 100;
let lastLfoUpdate = 0;
let lfoCount = 0;  // Initialize lfoCount to 0
let lfos = [];     // Start with empty array
let deletedLfoIds = [];
let rotationDirection = 0;

// Add at the top with other global variables
let isPlaying1 = true;
let isPlaying2 = true;

// Add these variables at the top with other state variables
let chordMode1 = false;
let chordMode2 = false;
let chordType1 = 'major';
let chordType2 = 'major';

let isMouseControllingCamera = false;
let lastMouseY;

// Initialize envelopes array
window.envelopes = [{
    id: 1,
    color: '#9333ea'
}];

// Add near the top with other state variables
let probability1 = 100;
let probability2 = 100;

// Master transport variables for global timing
let masterLastStepTime = 0;
let masterStep = 0;

// Add this function to calculate chord notes
function getChordNotes(baseNote, chordType) {
    const intervals = {
        major: [0, 4, 7],
        minor: [0, 3, 7],
        diminished: [0, 3, 6],
        augmented: [0, 4, 8],
        major7: [0, 4, 7, 11],
        minor7: [0, 3, 7, 10],
        dominant7: [0, 4, 7, 10],
        diminished7: [0, 3, 6, 9],
        halfDiminished7: [0, 3, 6, 10]
    };

    return intervals[chordType].map(interval => baseNote + interval);
}

// ============================================================================
// REFACTORED SEQUENCER CLASS - IMPROVED ARCHITECTURE
// ============================================================================

// Audio Engine for handling sound generation
class AudioEngine {
    constructor(sequencer) {
        this.sequencer = sequencer;
        this.audioContext = null;
        this.gainNode = null;
    }

    initialize() {
        if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(pitch, velocity, duration = 0.1) {
        if (!this.audioContext || !internalAudioEnabled) return;

        const frequency = midiToFrequency(pitch);
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(velocity / 127, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    sendMIDI(pitch, velocity) {
        console.log(`[MIDI_DEBUG] AudioEngine.sendMIDI called for sequencer ${this.sequencer.id}`, {
            pitch: pitch,
            velocity: velocity,
            midiChannel: this.sequencer.midiChannel,
            midiChannelDisplay: this.sequencer.midiChannel + 1, // Show 1-indexed channel number
            midiOutputEnabled: midiOutputEnabled,
            midiOutput: !!midiOutput,
            midiOutputName: midiOutput ? midiOutput.name : 'none'
        });
        
        if (!midiOutputEnabled || !midiOutput) {
            console.log(`[MIDI_DEBUG] MIDI conditions not met for sequencer ${this.sequencer.id}`, {
                midiOutputEnabled: midiOutputEnabled,
                midiOutput: !!midiOutput,
                midiOutputName: midiOutput ? midiOutput.name : 'none'
            });
            return;
        }

        const noteOn = [0x90 + this.sequencer.midiChannel, pitch, velocity];
        const noteOff = [0x80 + this.sequencer.midiChannel, pitch, 0];
        
        console.log(`[MIDI_DEBUG] Sending MIDI for sequencer ${this.sequencer.id}`, {
            noteOn: noteOn,
            noteOff: noteOff,
            channel: this.sequencer.midiChannel + 1, // Show 1-indexed channel number
            midiOutputName: midiOutput.name
        });
        
        try {
            // Send MIDI directly instead of using queue
            midiOutput.send(noteOn);
            console.log(`[MIDI_DEBUG] Note On sent directly for sequencer ${this.sequencer.id}`);
            
            setTimeout(() => {
                midiOutput.send(noteOff);
                console.log(`[MIDI_DEBUG] Note Off sent directly for sequencer ${this.sequencer.id}`);
            }, 50);
            
            console.log(`[MIDI_DEBUG] MIDI messages sent successfully for sequencer ${this.sequencer.id}`);
        } catch (error) {
            console.error(`[MIDI_DEBUG] Error sending MIDI for sequencer ${this.sequencer.id}:`, error);
        }
    }
}

// Visual Engine for handling 3D rendering
class VisualEngine {
    constructor(sequencer) {
        this.sequencer = sequencer;
        this.spheres = [];
        this.animations = [];
        this.materialCache = new Map();
    }

    createSpheres() {
        this.disposeSpheres();
        
        // Calculate sphere size based on radius (larger radius = smaller spheres for better proportion)
        const sphereSize = Math.max(0.15, Math.min(0.3, 2.0 / this.sequencer.radius));
        
        console.log(`[PLAYHEAD_DEBUG] Creating spheres for sequencer ${this.sequencer.id}: steps=${this.sequencer.steps}, radius=${this.sequencer.radius}`);
        
        for (let i = 0; i < this.sequencer.steps; i++) {
            const angle = (i / this.sequencer.steps) * Math.PI * 2;
            
            const isActive = this.sequencer.sequence[i] === 1;
            // Create a fresh material for each sphere instead of using cache
            const material = createGlossyMaterial(isActive ? COLORS.active : COLORS.inactive);
            console.log(`[PLAYHEAD_DEBUG] Sphere ${i}: isActive=${isActive}, material=${material ? 'valid' : 'null/undefined'}`);
            
            const shape = createShapeByType(sphereSize, 1.0, material, currentShapeType);
            console.log(`[PLAYHEAD_DEBUG] Sphere ${i}: shape.children[0].material after createShapeByType: ${!!shape.children[0].material}`);
            
            shape.position.x = Math.cos(angle) * this.sequencer.radius + this.sequencer.centerX;
            shape.position.z = Math.sin(angle) * this.sequencer.radius + this.sequencer.centerZ;
            shape.position.y = 0.5; // Raise above platform
            
            // Store the group (which contains the mesh) in spheres array
            this.spheres.push(shape);
            if (scene) {
                scene.add(shape);
                console.log(`[PLAYHEAD_DEBUG] After scene.add: shape.children[0].material = ${!!shape.children[0].material}`);
                
                // Check if material is still there after scene.add
                if (shape.children[0].material) {
                    console.log(`[PLAYHEAD_DEBUG] Material type after scene.add: ${shape.children[0].material.type}, uuid: ${shape.children[0].material.uuid}`);
                }
            }
        }
        
        console.log(`[PLAYHEAD_DEBUG] Created ${this.spheres.length} spheres for sequencer ${this.sequencer.id}`);
        
        // Debug: Check material status immediately after creation
        this.spheres.forEach((group, index) => {
            if (group.children.length > 0) {
                const child = group.children[0];
                console.log(`[PLAYHEAD_DEBUG] Sphere ${index} material status after creation: ${!!child.material}`);
                if (child.material) {
                    console.log(`[PLAYHEAD_DEBUG] Sphere ${index} material type: ${child.material.type}, uuid: ${child.material.uuid}`);
                }
            }
        });
    }

    getMaterial(color) {
        const key = color.toString();
        console.log(`[PLAYHEAD_DEBUG] getMaterial called with color: ${color}, key: ${key}`);
        
        if (!this.materialCache.has(key)) {
            console.log(`[PLAYHEAD_DEBUG] Creating new material for color: ${color}`);
            const newMaterial = createGlossyMaterial(color);
            console.log(`[PLAYHEAD_DEBUG] createGlossyMaterial returned: ${!!newMaterial}`);
            this.materialCache.set(key, newMaterial);
        } else {
            console.log(`[PLAYHEAD_DEBUG] Using cached material for color: ${color}`);
        }
        
        const material = this.materialCache.get(key);
        console.log(`[PLAYHEAD_DEBUG] Material result: ${material ? 'valid' : 'null/undefined'}`);
        return material;
    }

    updateSphereColors() {
        // Ensure currentStep is within bounds
        const safeCurrentStep = Math.max(0, Math.min(this.sequencer.currentStep, this.spheres.length - 1));
        
        console.log(`[PLAYHEAD_DEBUG] Updating sphere colors for sequencer ${this.sequencer.id}: currentStep=${this.sequencer.currentStep}, safeStep=${safeCurrentStep}, spheres=${this.spheres.length}`);
        
        // Debug: Check material status at the start of updateSphereColors
        if (this.spheres.length > 0) {
            const firstSphere = this.spheres[0];
            if (firstSphere.children.length > 0) {
                console.log(`[PLAYHEAD_DEBUG] First sphere material status at start of updateSphereColors: ${!!firstSphere.children[0].material}`);
            }
        }
        
        // If no spheres exist, recreate them
        if (this.spheres.length === 0) {
            console.log(`[PLAYHEAD_DEBUG] No spheres found for sequencer ${this.sequencer.id}, recreating...`);
            this.createSpheres();
        }
        
        let playheadFound = false;
        this.spheres.forEach((group, index) => {
            console.log(`[PLAYHEAD_DEBUG] Checking sphere ${index} (type: ${typeof index}) against safeCurrentStep ${safeCurrentStep} (type: ${typeof safeCurrentStep}) for sequencer ${this.sequencer.id}`);
            const isMatch = index === safeCurrentStep;
            console.log(`[PLAYHEAD_DEBUG] Equality test: ${index} === ${safeCurrentStep} = ${isMatch}`);
            
            if (group.children.length > 0) {
                const mesh = group.children[0];
                console.log(`[PLAYHEAD_DEBUG] Mesh ${index} has material: ${!!mesh.material}`);
                
                if (mesh.material) {
                    let color;
                    console.log(`[PLAYHEAD_DEBUG] About to check if ${index} === ${safeCurrentStep} for sequencer ${this.sequencer.id}`);
                    if (index === safeCurrentStep) {
                        color = COLORS.playhead; // Use the same playhead color as original sequencers
                        group.scale.set(1.5, 1.5, 1.5);
                        playheadFound = true;
                        console.log(`[PLAYHEAD_DEBUG] Set playhead for sequencer ${this.sequencer.id} at sphere ${index} with color: ${color}`);
                    } else if (this.sequencer.sequence[index] === 1) {
                        color = COLORS.active;
                        group.scale.set(1, 1, 1);
                        console.log(`[PLAYHEAD_DEBUG] Set active color for sequencer ${this.sequencer.id} at sphere ${index}: ${color}`);
                    } else {
                        color = COLORS.inactive;
                        group.scale.set(1, 1, 1);
                        console.log(`[PLAYHEAD_DEBUG] Set inactive color for sequencer ${this.sequencer.id} at sphere ${index}: ${color}`);
                    }
                    
                    console.log(`[PLAYHEAD_DEBUG] Before disposal: mesh.material = ${!!mesh.material}`);
                    mesh.material.dispose();
                    console.log(`[PLAYHEAD_DEBUG] After disposal: mesh.material = ${!!mesh.material}`);
                    const newMaterial = this.getMaterial(color);
                    console.log(`[PLAYHEAD_DEBUG] New material created: ${!!newMaterial}`);
                    mesh.material = newMaterial;
                    console.log(`[PLAYHEAD_DEBUG] After assignment: mesh.material = ${!!mesh.material}`);
                }
            }
        });
        
        if (!playheadFound) {
            console.log(`[PLAYHEAD_DEBUG] WARNING: No playhead set for sequencer ${this.sequencer.id} at step ${safeCurrentStep}`);
        }
        
        // Force a render update to ensure the visual changes are visible
        if (typeof renderer !== 'undefined' && renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    animateStep() {
        if (!this.spheres[this.sequencer.currentStep]) {
            return;
        }

        // Clear existing animations for this sphere
        this.animations = this.animations.filter(anim => anim.group !== this.spheres[this.sequencer.currentStep]);
        
        // Add new animation
        this.animations.push(createStepAnimation(this.spheres[this.sequencer.currentStep], performance.now()));

        // Scale animation for visibility
        this.spheres[this.sequencer.currentStep].scale.set(1.2, 1.2, 1.2);
            setTimeout(() => {
            if (this.spheres[this.sequencer.currentStep]) {
                this.spheres[this.sequencer.currentStep].scale.set(1.0, 1.0, 1.0);
                }
            }, 100);
        }

    updateAnimations(now) {
        this.animations = this.animations.filter(anim => updateAnimation(anim, now));
    }

    disposeSpheres() {
        this.spheres.forEach(group => {
            if (scene) scene.remove(group);
        });
        this.spheres = [];
        this.animations = [];
    }

    dispose() {
        this.disposeSpheres();
        this.materialCache.forEach(material => material.dispose());
        this.materialCache.clear();
    }
}

// Sequence Engine for handling rhythm generation and playback logic
class SequenceEngine {
    constructor(sequencer) {
        this.sequencer = sequencer;
    }

    generateSequence() {
        this.sequencer.sequence = generateEuclideanRhythm(this.sequencer.beats, this.sequencer.steps);
        this.sequencer.pitches = generatePitches(
            this.sequencer.steps, 
            this.sequencer.rootNote || 60, 
            this.sequencer.scaleType || 'minor', 
            this.sequencer.octaveRange || 2
        );
    }
    
    getNextStep() {
        switch (this.sequencer.mode) {
            case 'forward':
                return (this.sequencer.currentStep + 1) % this.sequencer.steps;
            case 'backward':
                return this.sequencer.currentStep === 0 ? this.sequencer.steps - 1 : this.sequencer.currentStep - 1;
            case 'pingpong':
                if (this.sequencer.currentStep === this.sequencer.steps - 1) {
                    this.sequencer.direction = -1;
                } else if (this.sequencer.currentStep === 0) {
                    this.sequencer.direction = 1;
                }
                return this.sequencer.currentStep + this.sequencer.direction;
            case 'random':
                return Math.floor(Math.random() * this.sequencer.steps);
            case 'brownian':
                const range = Math.min(this.sequencer.brownianRange, this.sequencer.steps - 1);
                const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
                return (this.sequencer.currentStep + offset + this.sequencer.steps) % this.sequencer.steps;
            default:
                return (this.sequencer.currentStep + 1) % this.sequencer.steps;
        }
    }

    shouldPlaySound() {
        const sequenceValue = this.sequencer.sequence[this.sequencer.currentStep];
        const probabilityCheck = Math.random() * 100 < this.sequencer.probability;
        const shouldPlay = sequenceValue === 1 && probabilityCheck;
        
        console.log(`[MIDI_DEBUG] shouldPlaySound() for sequencer ${this.sequencer.id}`, {
            currentStep: this.sequencer.currentStep,
            sequenceValue: sequenceValue,
            probability: this.sequencer.probability,
            probabilityCheck: probabilityCheck,
            shouldPlay: shouldPlay
        });
        
        return shouldPlay;
    }

    reset() {
        this.sequencer.currentStep = 0;
        this.sequencer.lastStepTime = 0;
        this.sequencer.direction = 1;
    }
}

// Main Sequencer class with improved architecture
class Sequencer {
    constructor(id, radius, options = {}) {
        this.id = id;
        this.radius = radius;
        this.centerX = options.centerX || 0;
        this.centerZ = options.centerZ || 0;
        
        // Initialize engines
        this.audioEngine = new AudioEngine(this);
        this.visualEngine = new VisualEngine(this);
        this.sequenceEngine = new SequenceEngine(this);
        
        // Timing and transport
        this.isPlaying = options.isPlaying !== undefined ? options.isPlaying : true;
        this.currentStep = 0;
        this.lastStepTime = 0;
        this.stepDuration = 60.0 / (options.bpm || 120);
        
        // Sequence parameters
        this.beats = options.beats || 16;
        this.steps = options.steps || 16;
        this.rootNote = options.rootNote || 60;
        this.scaleType = options.scaleType || 'minor';
        this.octaveRange = options.octaveRange || 2;
        
        // Playback parameters
        this.velocity = options.velocity || 100;
        this.probability = options.probability || 100;
        this.mode = options.mode || 'forward';
        this.direction = 1;
        this.brownianRange = options.brownianRange || 1;
        this.lastBrownianStep = 0;
        
        // Audio/MIDI
        this.midiChannel = (options.midiChannel !== undefined) ? options.midiChannel : (id % 16);
        console.log(`[MIDI_CHANNEL_DEBUG] Sequencer ${id} constructor:`, {
            optionsMidiChannel: options.midiChannel,
            finalMidiChannel: this.midiChannel,
            finalMidiChannelDisplay: this.midiChannel + 1
        });
        this.chordMode = options.chordMode || false;
        this.chordType = options.chordType || 'major';
        
        // Initialize sequence and visuals
        this.sequenceEngine.generateSequence();
        this.visualEngine.createSpheres();
        this.visualEngine.updateSphereColors();
        
        // Initialize audio
        this.audioEngine.initialize();
    }
    
    update(now, bpm) {
        if (!this.isPlaying) return;
        
        // Only advance step when master timing allows it
        // The master timing is handled in the main animation loop
        // This method is called every frame, but we only want to advance on step boundaries
        
        // Update visual animations
        this.visualEngine.updateAnimations(now);
    }
    
    step() {
        if (!this.isPlaying) return;
        
        this.advanceStep();
    }
    
    advanceStep() {
        const nextStep = this.sequenceEngine.getNextStep();
        this.currentStep = nextStep;

        console.log(`[PLAYHEAD_DEBUG] Sequencer ${this.id} advanced to step ${this.currentStep}`);

        // Play sound if conditions are met
        if (this.sequenceEngine.shouldPlaySound()) {
            this.playSound();
        }

        // Update visuals
        this.visualEngine.animateStep();
        this.visualEngine.updateSphereColors();
        
        // Force immediate render to ensure visual changes are visible
        if (typeof renderer !== 'undefined' && renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    
    playSound() {
        const pitch = this.pitches[this.currentStep];
        const velocity = this.velocity;
        
        console.log(`[MIDI_DEBUG] Sequencer ${this.id}.playSound() called`, {
            pitch: pitch,
            velocity: velocity,
            currentStep: this.currentStep,
            sequenceValue: this.sequence[this.currentStep]
        });
        
        this.audioEngine.playNote(pitch, velocity);
        this.audioEngine.sendMIDI(pitch, velocity);
    }
    
    // Parameter setters with automatic updates
    setBeats(beats) {
        this.beats = beats;
        this.sequenceEngine.generateSequence();
        this.visualEngine.createSpheres();
        this.visualEngine.updateSphereColors();
    }
    
    setSteps(steps) {
        this.steps = steps;
        this.sequenceEngine.generateSequence();
        this.visualEngine.createSpheres();
        this.visualEngine.updateSphereColors();
    }
    
    setMode(mode) {
        this.mode = mode;
        this.direction = 1; // Reset direction for ping-pong
    }
    
    setVelocity(velocity) {
        this.velocity = velocity;
    }
    
    setProbability(probability) {
        this.probability = probability;
    }
    
    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        return this.isPlaying;
    }
    
    reset() {
        this.sequenceEngine.reset();
        this.visualEngine.updateSphereColors();
    }
    
    dispose() {
        this.visualEngine.dispose();
    }
}

// ... existing code ...

function createGlossyMaterial(color, glowIntensity = 0.3) {
    console.log(`[PLAYHEAD_DEBUG] createGlossyMaterial called with color: ${color}, glowIntensity: ${glowIntensity}`);
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.3,
        roughness: 0.2,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: color,
        emissiveIntensity: glowIntensity,
        envMapIntensity: 1.0,
        transmission: 0.0
    });
    console.log(`[PLAYHEAD_DEBUG] Created material: ${material ? 'valid' : 'null/undefined'}`);
    return material;
}

// Add shape variations
const SHAPE_TYPES = {
    RANDOM: 'random',
    POLYHEDRON: 'polyhedron',
    CRYSTAL: 'crystal',
    OCTAHEDRON: 'octahedron',
    BULBOUS_SPHERE: 'bulbous_sphere',
    SPIKY_BALL: 'spiky_ball',
    ORGANIC_CUBE: 'organic_cube',
    CORAL_FORM: 'coral_form',
    TORUS: 'torus'
};

let currentShapeType = SHAPE_TYPES.POLYHEDRON;

// Add noise generator at the top with other globals
let noiseGen = new SimplexNoise();

function createShapeByType(radius, height, material, type = currentShapeType) {
    const group = new THREE.Group();
    let baseGeometry;
    let topCap, bottomCap;
    
    // Helper function to safely apply noise deformation
    const safeDeform = (value, noiseFactor, maxDeform = 2.0) => {
        if (isNaN(value) || isNaN(noiseFactor)) return value;
        const deformation = Math.max(-maxDeform, Math.min(maxDeform, noiseFactor));
        const result = value * (1 + deformation);
        return isNaN(result) ? value : result;
    };

    // Helper function to compute noise
    const computeNoise = (x, y, z, frequency, amplitude) => {
        if (isNaN(x) || isNaN(y) || isNaN(z)) return 0;
        const noise = noiseGen.noise3D(
            x * frequency + noiseOffsetX,
            y * frequency + noiseOffsetY,
            z * frequency + noiseOffsetZ
        );
        return isNaN(noise) ? 0 : noise * amplitude;
    };
    
    // If type is random, select a random shape type (excluding 'random' itself)
    if (type === SHAPE_TYPES.RANDOM) {
        const shapeTypes = Object.values(SHAPE_TYPES).filter(t => t !== SHAPE_TYPES.RANDOM && t !== SHAPE_TYPES.TORUS);
        type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    }
    
    // Ensure valid parameters
    radius = Math.max(0.01, Math.abs(radius));
    height = Math.max(0.01, Math.abs(height));
    
    // Create unique noise offsets for more variation
    const noiseOffsetX = Math.random() * 100;
    const noiseOffsetY = Math.random() * 100;
    const noiseOffsetZ = Math.random() * 100;

    switch(type) {
        case SHAPE_TYPES.BULBOUS_SPHERE:
            baseGeometry = new THREE.SphereGeometry(radius * 1.2, 256, 256);
            const sphereVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < sphereVertices.length; i += 3) {
                const x = sphereVertices[i];
                const y = sphereVertices[i + 1];
                const z = sphereVertices[i + 2];
                
                const bulgeNoise = computeNoise(x, y, z, 2.0, 0.8);
                const detailNoise = computeNoise(x, y, z, 5.0, 0.3);
                const microDetail = computeNoise(x, y, z, 10.0, 0.15);
                
                const normalizedY = (y + radius) / (radius * 2);
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const totalNoise = (bulgeNoise + detailNoise + microDetail) * 1.8;
                
                const smoothFactor = Math.pow(Math.abs(heightFactor), 0.5);
                sphereVertices[i] = safeDeform(x, totalNoise * smoothFactor);
                sphereVertices[i + 1] = safeDeform(y, totalNoise * 0.4);
                sphereVertices[i + 2] = safeDeform(z, totalNoise * smoothFactor);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, radius * 1.2, 0);
            break;
            
        case SHAPE_TYPES.SPIKY_BALL:
            baseGeometry = new THREE.IcosahedronGeometry(radius * 1.2, 6);
            const spikyVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < spikyVertices.length; i += 3) {
                const x = spikyVertices[i];
                const y = spikyVertices[i + 1];
                const z = spikyVertices[i + 2];
                
                const spikeNoise = Math.abs(computeNoise(x, y, z, 4.0, 0.9));
                const sharpness = Math.abs(computeNoise(x, y, z, 8.0, 0.5));
                const smoothing = computeNoise(x, y, z, 12.0, 0.3);
                
                const normalizedY = (y + radius) / (radius * 2);
                spikyVertices[i + 1] = safeDeform(y, height / (radius * 2) - 1);
                
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const spikeFactor = Math.pow(Math.min(spikeNoise + sharpness + smoothing, 1.5), 1.3);
                const smoothTransition = Math.pow(Math.abs(heightFactor), 0.6);
                
                spikyVertices[i] = safeDeform(x, spikeFactor * smoothTransition);
                spikyVertices[i + 2] = safeDeform(z, spikeFactor * smoothTransition);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, radius * 1.2, 0);
            break;
            
        case SHAPE_TYPES.ORGANIC_CUBE:
            baseGeometry = new THREE.BoxGeometry(radius * 2, height, radius * 2, 96, 96, 96);
            const cubeVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < cubeVertices.length; i += 3) {
                const x = cubeVertices[i];
                const y = cubeVertices[i + 1];
                const z = cubeVertices[i + 2];
                
                const bulgeNoise = computeNoise(x, y, z, 2.5, 0.5);
                const edgeNoise = computeNoise(x, y, z, 5.0, 0.3);
                const warpNoise = computeNoise(x, y, z, 1.2, 0.7);
                const smoothingNoise = computeNoise(x, y, z, 10.0, 0.2);
                
                const normalizedY = (y + height/2) / height;
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const totalNoise = (bulgeNoise + edgeNoise + smoothingNoise) * 1.6;
                
                const smoothFactor = Math.pow(Math.abs(heightFactor), 0.4);
                cubeVertices[i] = safeDeform(x, totalNoise * smoothFactor + warpNoise);
                cubeVertices[i + 1] = safeDeform(y, totalNoise * 0.3);
                cubeVertices[i + 2] = safeDeform(z, totalNoise * smoothFactor + warpNoise);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, height/2, 0);
            break;
            
        case SHAPE_TYPES.CORAL_FORM:
            baseGeometry = new THREE.DodecahedronGeometry(radius * 1.2, 6);
            const coralVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < coralVertices.length; i += 3) {
                const x = coralVertices[i];
                const y = coralVertices[i + 1];
                const z = coralVertices[i + 2];
                
                const baseNoise = computeNoise(x, y, z, 2.0, 0.6);
                const branchNoise = Math.abs(computeNoise(x, y, z, 5.0, 0.7));
                const detailNoise = computeNoise(x, y, z, 10.0, 0.25);
                const smoothingNoise = computeNoise(x, y, z, 15.0, 0.15);
                
                const normalizedY = (y + radius) / (radius * 2);
                coralVertices[i + 1] = safeDeform(y, height / (radius * 2) - 1);
                
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const totalNoise = (baseNoise + branchNoise + detailNoise + smoothingNoise) * 2.0;
                
                const branchFactor = Math.pow(Math.min(branchNoise, 1.0), 1.3);
                const smoothTransition = Math.pow(Math.abs(heightFactor), 0.5);
                coralVertices[i] = safeDeform(x, totalNoise * smoothTransition + branchFactor);
                coralVertices[i + 2] = safeDeform(z, totalNoise * smoothTransition + branchFactor);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, radius * 1.2, 0);
            break;
            
        case SHAPE_TYPES.CRYSTAL:
            baseGeometry = new THREE.CylinderGeometry(radius * 1.2, radius * 0.6, height, 32, 24);
            const crystalVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < crystalVertices.length; i += 3) {
                const x = crystalVertices[i];
                const y = crystalVertices[i + 1];
                const z = crystalVertices[i + 2];
                
                const facetNoise = computeNoise(x, y, z, 3.0, 0.4);
                const edgeNoise = Math.abs(computeNoise(x, y, z, 6.0, 0.3));
                const fractureNoise = computeNoise(x, y, z, 10.0, 0.2);
                const smoothingNoise = computeNoise(x, y, z, 15.0, 0.15);
                
                const normalizedY = (y + height/2) / height;
                const heightFactor = Math.pow(normalizedY, 1.3);
                
                const totalNoise = (facetNoise + edgeNoise + fractureNoise + smoothingNoise) * 1.2;
                const crystalFactor = Math.pow(Math.abs(totalNoise), 0.5);
                const smoothTransition = Math.pow(Math.abs(heightFactor), 0.6);
                
                crystalVertices[i] = safeDeform(x, crystalFactor * smoothTransition);
                crystalVertices[i + 2] = safeDeform(z, crystalFactor * smoothTransition);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, height/2, 0);
            break;
            
        case SHAPE_TYPES.TORUS:
            baseGeometry = new THREE.TorusGeometry(radius * 1.2, radius * 0.3, 32, 24);
            const torusVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < torusVertices.length; i += 3) {
                const x = torusVertices[i];
                const y = torusVertices[i + 1];
                const z = torusVertices[i + 2];
                
                // Create organic bulges and indentations
                const noise = computeNoise(x, y, z, 4, 0.15);
                
                torusVertices[i] *= (1 + noise);
                torusVertices[i + 1] *= (1 + noise);
                torusVertices[i + 2] *= (1 + noise);
                torusVertices[i + 1] *= (height / (radius * 2));
            }
            break;
            
        case SHAPE_TYPES.OCTAHEDRON:
            baseGeometry = new THREE.OctahedronGeometry(radius * 1.2, 5);
            const octaVertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < octaVertices.length; i += 3) {
                const x = octaVertices[i];
                const y = octaVertices[i + 1];
                const z = octaVertices[i + 2];
                
                const baseNoise = computeNoise(x, y, z, 2.5, 0.45);
                const edgeNoise = Math.abs(computeNoise(x, y, z, 5.0, 0.35));
                const angleNoise = computeNoise(x, y, z, 8.0, 0.25);
                const smoothingNoise = computeNoise(x, y, z, 12.0, 0.15);
                
                const normalizedY = (y + radius) / (radius * 2);
                octaVertices[i + 1] = safeDeform(y, height / (radius * 2) - 1);
                
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const totalNoise = (baseNoise + edgeNoise + angleNoise + smoothingNoise) * 1.6;
                
                const angleFactor = Math.pow(Math.abs(angleNoise), 0.3);
                const smoothTransition = Math.pow(Math.abs(heightFactor), 0.5);
                octaVertices[i] = safeDeform(x, totalNoise * smoothTransition + angleFactor);
                octaVertices[i + 2] = safeDeform(z, totalNoise * smoothTransition + angleFactor);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, radius * 1.2, 0);
            break;
            
        case SHAPE_TYPES.POLYHEDRON:
        default:
            baseGeometry = new THREE.IcosahedronGeometry(radius * 1.2, 5);
            const vertices = baseGeometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                const z = vertices[i + 2];
                
                const baseNoise = computeNoise(x, y, z, 2.0, 0.45);
                const polyNoise = Math.abs(computeNoise(x, y, z, 4.0, 0.35));
                const detailNoise = computeNoise(x, y, z, 8.0, 0.25);
                const smoothingNoise = computeNoise(x, y, z, 12.0, 0.15);
                
                const normalizedY = (y + radius) / (radius * 2);
                vertices[i + 1] = safeDeform(y, height / (radius * 2) - 1);
                
                const heightFactor = Math.sin(normalizedY * Math.PI);
                const totalNoise = (baseNoise + polyNoise + detailNoise + smoothingNoise) * 1.6;
                
                const polyFactor = Math.pow(Math.abs(polyNoise), 0.4);
                const smoothTransition = Math.pow(Math.abs(heightFactor), 0.5);
                vertices[i] = safeDeform(x, totalNoise * smoothTransition + polyFactor);
                vertices[i + 2] = safeDeform(z, totalNoise * smoothTransition + polyFactor);
            }
            // Move geometry up so it rests on platform
            baseGeometry.translate(0, radius * 1.2, 0);
            break;
    }
    
    baseGeometry.computeVertexNormals();
    console.log(`[PLAYHEAD_DEBUG] createShapeByType: material before mesh creation: ${!!material}`);
    const shape = new THREE.Mesh(baseGeometry, material);
    console.log(`[PLAYHEAD_DEBUG] createShapeByType: shape.material after creation: ${!!shape.material}`);
    
    group.add(shape);
    console.log(`[PLAYHEAD_DEBUG] createShapeByType: group.children[0].material after adding: ${!!group.children[0].material}`);
    return group;
}

const COLORS = {
    background: 0x1a1a2e,
    active: 0x00ff95,    // Bright cyan
    inactive: 0xff0000,  // bright red for testing
    playhead: 0xffffff,  // White
    highlight: 0x9333ea, // Purple highlight
    hover: 0x9333ea,     // Purple hover
    glow: 0x9333ea      // Purple glow
};

const THEMES = {
    default: {
        background: 0x1a1a2e,
        active: 0x00ff95,
        inactive: 0x2a2a3e,
        playhead: 0xffffff,
        highlight: 0x9333ea,
        hover: 0x9333ea,
        glow: 0x9333ea,
        cssVars: {
            '--primary-color': '#00ff95',
            '--secondary-color': '#9333ea',
            '--background-color': '#1a1a2e',
            '--text-color': '#ffffff'
        }
    },
    luminous: {
        background: 0x1a1a2e,
        active: 0x00ff95,
        inactive: 0x2a2a3e,
        playhead: 0xffffff,
        highlight: 0x9333ea,
        hover: 0x9333ea,
        glow: 0x9333ea,
        cssVars: {
            '--primary-color': '#00ff95',
            '--secondary-color': '#9333ea',
            '--background-color': '#1a1a2e',
            '--text-color': '#ffffff'
        }
    },
    cyberpunk: {
        background: 0x000000,
        active: 0xff00ff,
        inactive: 0x1a1a2e,
        playhead: 0x00ffff,
        highlight: 0xff0000,
        hover: 0xff0000,
        glow: 0xff00ff,
        cssVars: {
            '--primary-color': '#ff00ff',
            '--secondary-color': '#ff0000',
            '--background-color': '#000000',
            '--text-color': '#00ffff'
        }
    },
    sunset: {
        background: 0x1a0f1f,
        active: 0xff6b6b,
        inactive: 0x2d1b2d,
        playhead: 0xffd700,
        highlight: 0xff8c00,
        hover: 0xff8c00,
        glow: 0xff6b6b,
        cssVars: {
            '--primary-color': '#ff6b6b',
            '--secondary-color': '#ff8c00',
            '--background-color': '#1a0f1f',
            '--text-color': '#ffd700'
        }
    },
    forest: {
        background: 0x0a1f0a,
        active: 0x00ff00,
        inactive: 0x1a2e1a,
        playhead: 0xffff00,
        highlight: 0x32cd32,
        hover: 0x32cd32,
        glow: 0x00ff00,
        cssVars: {
            '--primary-color': '#00ff00',
            '--secondary-color': '#32cd32',
            '--background-color': '#0a1f0a',
            '--text-color': '#ffff00'
        }
    },
    ocean: {
        background: 0x0a192f,
        active: 0x00ffff,
        inactive: 0x1a2a3f,
        playhead: 0xffffff,
        highlight: 0x0088ff,
        hover: 0x0088ff,
        glow: 0x00ffff,
        cssVars: {
            '--primary-color': '#00ffff',
            '--secondary-color': '#0088ff',
            '--background-color': '#0a192f',
            '--text-color': '#ffffff'
        }
    },
    desert: {
        background: 0x2b1810,
        active: 0xff8c00,
        inactive: 0x3b2820,
        playhead: 0xffd700,
        highlight: 0xff4500,
        hover: 0xff4500,
        glow: 0xff8c00,
        cssVars: {
            '--primary-color': '#ff8c00',
            '--secondary-color': '#ff4500',
            '--background-color': '#2b1810',
            '--text-color': '#ffd700'
        }
    },
    neon: {
        background: 0x000000,
        active: 0xff1493,
        inactive: 0x1a1a1a,
        playhead: 0x00ff00,
        highlight: 0xff00ff,
        hover: 0xff00ff,
        glow: 0xff1493,
        cssVars: {
            '--primary-color': '#ff1493',
            '--secondary-color': '#ff00ff',
            '--background-color': '#000000',
            '--text-color': '#00ff00'
        }
    },
    monochrome: {
        background: 0x000000,
        active: 0xffffff,
        inactive: 0x333333,
        playhead: 0xcccccc,
        highlight: 0x999999,
        hover: 0x999999,
        glow: 0xffffff,
        cssVars: {
            '--primary-color': '#ffffff',
            '--secondary-color': '#999999',
            '--background-color': '#000000',
            '--text-color': '#cccccc'
        }
    },
    pastel: {
        background: 0x2d2d3d,
        active: 0xff9ecd,
        inactive: 0x3d3d4d,
        playhead: 0xffffff,
        highlight: 0x9ecdff,
        hover: 0x9ecdff,
        glow: 0xff9ecd,
        cssVars: {
            '--primary-color': '#ff9ecd',
            '--secondary-color': '#9ecdff',
            '--background-color': '#2d2d3d',
            '--text-color': '#ffffff'
        }
    },
    volcanic: {
        background: 0x1a0f0f,
        active: 0xff4400,
        inactive: 0x2a1f1f,
        playhead: 0xffaa00,
        highlight: 0xff0000,
        hover: 0xff0000,
        glow: 0xff4400,
        cssVars: {
            '--primary-color': '#ff4400',
            '--secondary-color': '#ff0000',
            '--background-color': '#1a0f0f',
            '--text-color': '#ffaa00'
        }
    },
    arctic: {
        background: 0x1a1a2e,
        active: 0x00ffff,
        inactive: 0x2a2a3e,
        playhead: 0xffffff,
        highlight: 0x00ccff,
        hover: 0x00ccff,
        glow: 0x00ffff,
        cssVars: {
            '--primary-color': '#00ffff',
            '--secondary-color': '#00ccff',
            '--background-color': '#1a1a2e',
            '--text-color': '#ffffff'
        }
    }
};

function applyTheme(themeName) {
    if (!THEMES[themeName]) {
        console.warn(`Theme ${themeName} not found, using default`);
        themeName = 'luminous';
    }
    
    currentThemeName = themeName;
    const theme = THEMES[themeName];
    
    // Update THREE.js scene colors
    COLORS.background = theme.background;
    COLORS.active = theme.active;
    COLORS.inactive = theme.inactive;
    COLORS.playhead = theme.playhead;
    COLORS.highlight = theme.highlight;
    COLORS.hover = theme.hover;
    COLORS.glow = theme.glow;
    
    // Update renderer background
    if (renderer) {
        renderer.setClearColor(theme.background);
    }
    
    // Update CSS variables
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    
    // Update all sphere materials if they exist
    if (spheres && spheres.length > 0) {
        updateAllSphereMaterials();
    }
    
    // Update particle colors if they exist and are initialized
    if (particles && particles.length > 0) {
        particles.forEach(particle => {
            if (particle && particle.mesh && particle.mesh.material) {
                if (particle.mesh.material.color && particle.mesh.material.emissive) {
                    particle.mesh.material.color.setHex(theme.active);
                    particle.mesh.material.emissive.setHex(theme.active);
                }
            }
        });
    }
    
    // Update line colors if they exist
    if (lineSegments && lineSegments.length > 0) {
        lineSegments.forEach(line => {
            if (line && line.material && line.material.color) {
                line.material.color.setHex(theme.active);
            }
        });
    }
}

function updateAllSphereMaterials() {
    // Update Sequencer 1 spheres
    spheres.forEach((group, i) => {
        const isActive = sequence[i] === 1;
        const isPlayhead = i === currentStep;
        const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
        
        group.children.forEach(child => {
            if (child.material) {
                const newMaterial = createGlossyMaterial(color);
                child.material.dispose();
                child.material = newMaterial;
            }
        });
    });
    
    // Update Sequencer 2 spheres
    spheres2.forEach((group, i) => {
        const isActive = sequence2[i] === 1;
        const isPlayhead = i === currentStep2;
        const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
        
        group.children.forEach(child => {
            if (child.material) {
                const newMaterial = createGlossyMaterial(color);
                child.material.dispose();
                child.material = newMaterial;
            }
        });
    });
}

const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    wholeTone: [0, 2, 4, 6, 8, 10],
    diminished: [0, 1, 3, 4, 6, 7, 9, 10]
};

class Particle {
    constructor(scene) {
        const radius = 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        this.layer = Math.floor(Math.random() * parallaxLayers);
        const layerScale = 1 + (this.layer * 1.5);
        
        this.position = new THREE.Vector3(
            radius * layerScale * Math.sin(theta) * Math.cos(phi),
            radius * layerScale * Math.sin(theta) * Math.sin(phi),  // Removed -5 offset
            radius * layerScale * Math.cos(theta)
        );
        
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(BASE_PARTICLE_SPEED * particleSpeed);
        
        const geometry = new THREE.SphereGeometry(0.08, 4, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }

    update(particles) {
        if (isNaN(this.velocity.length())) {
            this.velocity.set(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
        }

        this.velocity.multiplyScalar(0.98);
        
        const randomFactor = 0.005 * (2 - swarmCohesion);
        const randomForce = new THREE.Vector3(
            (Math.random() - 0.5) * randomFactor,
            (Math.random() - 0.5) * randomFactor,
            (Math.random() - 0.5) * randomFactor
        );
        this.velocity.add(randomForce);

        const boundingForce = this.boundingSphere();
        if (!isNaN(boundingForce.length())) {
            this.velocity.add(boundingForce);
        }

        const speedLimit = BASE_PARTICLE_SPEED * particleSpeed * 2;
        const currentSpeed = this.velocity.length();
        if (currentSpeed > speedLimit || isNaN(currentSpeed)) {
            this.velocity.normalize().multiplyScalar(speedLimit);
        }

        const newPosition = this.position.clone().add(this.velocity);
        if (!isNaN(newPosition.length())) {
            this.position.copy(newPosition);
            this.mesh.position.copy(this.position);
        } else {
            const radius = 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            this.position.set(
                radius * Math.sin(theta) * Math.cos(phi),
                radius * Math.sin(theta) * Math.sin(phi) - 5,
                radius * Math.cos(theta)
            );
            this.mesh.position.copy(this.position);
            this.velocity.set(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
        }
    }

    boundingSphere() {
        const center = new THREE.Vector3(0, 0, 0);  // Changed from (0, -5, 0)
        const radius = 15 * (1 + this.layer * 1.5);
        const distance = this.position.distanceTo(center);
        
        if (distance > radius && !isNaN(distance)) {
            return center.sub(this.position).normalize().multiplyScalar(distance / radius);
        }
        return new THREE.Vector3();
    }
}

function initParticles() {
    if (particles.length > 0) {
        particles.forEach(particle => {
            if (particle.mesh && particle.mesh.parent) {
                particle.mesh.parent.remove(particle.mesh);
            }
        });
    }
    particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
        const particle = new Particle(scene);
        particles.push(particle);
    }
}

// Add this function at the top of the file
function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl !== null;
    } catch (e) {
        return false;
    }
}

// Add near the top with other initialization code
async function loadRandomLogo() {
    try {
        const logoImg = document.querySelector('.controls-logo');
        if (!logoImg) return;

        // Try Electron API first
        if (window.electronAPI) {
            logoImg.src = window.electronAPI.getRandomLogo();
            return;
        }

        // Web version: Use fetch to get directory listing
        const response = await fetch('logos/');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const logoFiles = Array.from(doc.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => /\.(png|jpg|jpeg|ico|svg|gif)$/i.test(href))
            .map(href => href.split('/').pop())
            .filter(name => name); // Filter out empty names

        if (logoFiles.length > 0) {
            const randomLogo = logoFiles[Math.floor(Math.random() * logoFiles.length)];
            logoImg.src = `logos/${randomLogo}`;
        } else {
            logoImg.src = 'logo.ico';
        }
    } catch (error) {
        console.error('Error loading random logo:', error);
        const logoImg = document.querySelector('.controls-logo');
        if (logoImg) {
            logoImg.src = 'logo.ico';
        }
    }
}

// Add these with other global variables at the top of the file
let visualizationCanvas = null;
let visualizationContext = null;



// Enhanced debug logging function that captures logs for CSV export
function debugLog(section, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp: timestamp,
        section: section,
        message: message,
        data: data
    };
    
    // Store log entry
    logStorage.push(logEntry);
    
    // Keep log storage under control
    if (logStorage.length > MAX_LOG_ENTRIES) {
        logStorage = logStorage.slice(-MAX_LOG_ENTRIES / 2);
    }
    
    // Console output
    // const logMessage = `[${section}] ${message}`;
    // if (data) {
    //     originalConsoleLog(logMessage, data);
    // } else {
    //     originalConsoleLog(logMessage);
    // }
    
    // Update button count periodically
    if (logStorage.length % 10 === 0) { // Update every 10 logs
        setTimeout(updateExportButtonCount, 100);
    }
}

// Function to export logs to CSV
async function exportLogsToCSV() {
    try {
        console.log('Export function called. Log storage length:', logStorage.length);
        console.log('Log storage contents:', logStorage);
        
        if (logStorage.length === 0) {
            console.log('Log storage is empty, adding test logs...');
            addTestLogs();
            console.log('After adding test logs, storage length:', logStorage.length);
        }
        
        // Check if electronAPI is available
        if (!window.electronAPI) {
            // Fallback: Create downloadable CSV file
            console.log('Electron API not available, using browser download fallback');
            downloadLogsAsCSV();
            return;
        }
        
        if (!window.electronAPI.saveLogsToCSVWithDialog) {
            // Fallback: Create downloadable CSV file
            console.log('CSV export function not available, using browser download fallback');
            downloadLogsAsCSV();
            return;
        }
        
        console.log('Attempting to export', logStorage.length, 'logs...');
        console.log('Electron API available:', !!window.electronAPI);
        console.log('Save dialog function available:', !!window.electronAPI.saveLogsToCSVWithDialog);
        
        try {
            console.log('Calling saveLogsToCSVWithDialog...');
            const result = await window.electronAPI.saveLogsToCSVWithDialog(logStorage);
            console.log('Dialog result received:', result);
        } catch (dialogError) {
            console.error('Dialog call failed:', dialogError);
            throw dialogError;
        }
        
        if (result && result.success) {
            alert(`Logs exported successfully!\n${result.message}\n\nTotal logs exported: ${logStorage.length}`);
            console.log('Logs exported to:', result.filepath);
            
            // Update button text to show log count
            const exportButton = document.getElementById('export-logs-button');
            if (exportButton) {
                exportButton.textContent = `Save Logs As... (${logStorage.length})`;
            }
        } else {
            const errorMsg = result ? result.error : 'Unknown error occurred';
            console.error('Dialog save failed:', errorMsg);
            
            // Try fallback to automatic save
            console.log('Trying fallback to automatic save...');
            const fallbackResult = window.electronAPI.saveLogsToCSV(logStorage);
            
            if (fallbackResult && fallbackResult.success) {
                alert(`Logs saved automatically!\n${fallbackResult.message}\n\nTotal logs exported: ${logStorage.length}`);
                console.log('Logs saved via fallback to:', fallbackResult.filepath);
                
                // Update button text to show log count
                const exportButton = document.getElementById('export-logs-button');
                if (exportButton) {
                    exportButton.textContent = `Save Logs As... (${logStorage.length})`;
                }
            } else {
                const fallbackError = fallbackResult ? fallbackResult.error : 'Unknown error occurred';
                console.error('Fallback save also failed:', fallbackError);
                
                // Try browser download as last resort
                console.log('Trying browser download as last resort...');
                downloadLogsAsCSV();
            }
        }
    } catch (error) {
        console.error('Error in exportLogsToCSV:', error);
        alert(`Error exporting logs: ${error.message}\n\nPlease restart the application and try again.`);
    }
}

// Function to update the export button with current log count
function updateExportButtonCount() {
    const exportButton = document.getElementById('export-logs-button');
    if (exportButton) {
        exportButton.textContent = `Save Logs As... (${logStorage.length})`;
    }
}

// Fallback function to download logs as CSV file in browser
function downloadLogsAsCSV() {
    try {
        // Create CSV content
        const csvHeader = 'Timestamp,Section,Message,Data\n';
        const csvContent = logStorage.map(log => {
            const timestamp = log.timestamp || new Date().toISOString();
            const section = log.section || '';
            const message = log.message || '';
            const data = log.data ? JSON.stringify(log.data).replace(/"/g, '""') : '';
            
            return `"${timestamp}","${section}","${message}","${data}"`;
        }).join('\n');
        
        const fullCsv = csvHeader + csvContent;
        
        // Create blob and download with custom filename
        const blob = new Blob([fullCsv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set a custom filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `sequencer-logs-${timestamp}.csv`;
        
        // Trigger the download - this should show a file picker in most browsers
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Logs downloaded successfully!\n\nTotal logs exported: ${logStorage.length}\n\nFile saved as: ${a.download}\n\nCheck your Downloads folder or browser download location.`);
        console.log('Logs downloaded via browser method');
        
    } catch (error) {
        console.error('Error in downloadLogsAsCSV:', error);
        alert(`Error downloading logs: ${error.message}`);
    }
}

// Update the initialization sequence
document.addEventListener('DOMContentLoaded', async () => {
    try {
        debugLog('Init', 'Starting initialization sequence');
        
        // Initialize Three.js scene and core components
        scene = new THREE.Scene();
        debugLog('Init', 'Scene created');
        
        // Set up renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(COLORS.background, 1);
        document.getElementById('canvas-container').appendChild(renderer.domElement);
        debugLog('Init', 'Renderer initialized');
        
        // Set up camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 15, 15);
        camera.lookAt(0, 0, 0);
        debugLog('Init', 'Camera initialized');
        
        // Set up controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.target.set(0, 0, 0);
        debugLog('Init', 'Controls initialized');
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);
        debugLog('Init', 'Lights added');
        
        // Initialize sequences
        sequence = generateEuclideanRhythm(beats, totalSteps);
        sequence2 = generateEuclideanRhythm(beats2, totalSteps2);
        debugLog('Init', 'Sequences generated');
        
        // Initialize pitches
        pitches = generatePitches(totalSteps, rootNote, scaleType, octaveRange);
        pitches2 = generatePitches(totalSteps2, rootNote, scaleType, octaveRange);
        debugLog('Init', 'Pitches generated');
        
        // Create visual elements
        createSpheres();
        debugLog('Init', 'Spheres created');
        
        // Initialize audio context
        await initAudioContext();
        debugLog('Init', 'Audio initialized');
        
        // Set up UI controls
        setupControls();
        setupLFOControls();
        setupEnvelopeControls();
        setupShapeControls();
        setupAddSequencerButton();
        debugLog('Init', 'Controls set up');
        
        // Initialize MIDI
        await initMIDI();
        debugLog('Init', 'MIDI initialized');
        
        // Start animation loop
        startAnimation();
        debugLog('Init', 'Animation started');
        
        debugLog('Init', 'Initialization complete');
        
        // Update export button count
        updateExportButtonCount();
        
        // Add some test logs to verify logging is working
        debugLog('Test', 'Initialization complete - logging system is working');
        console.log('Test console.log message');
        console.error('Test console.error message');
        console.warn('Test console.warn message');
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

function handleContextLost(event) {
    event.preventDefault();
    console.log('WebGL context lost. Attempting to restore...');
    stopAnimation();
    
    // Clear all references to WebGL objects
    spheres = [];
    spheres2 = [];
    particles = [];
    lineSegments = [];
    windows = [];
    
    // Clear the scene
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
}

function handleContextRestored() {
    console.log('WebGL context restored. Reinitializing...');
    
    // Reinitialize renderer settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Reset the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.background);
    
    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x9333ea, 0.4);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x00ff95, 0.3);
    fillLight.position.set(0, -5, 5);
    scene.add(fillLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight1.position.set(5, 10, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9333ea, 0.3, 15);
    pointLight2.position.set(-5, 8, -5);
    scene.add(pointLight2);
    
    // Reinitialize components
    try {
        initParticles();
        createSpheres();
        startAnimation();
    } catch (error) {
        console.error('Error during context restoration:', error);
    }
}

// Add performance monitoring and cleanup
let lastPerformanceCheck = performance.now();
let animationFrameId = null;
let isAnimating = false;

// Main animation function to handle all updates
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const currentTime = now / 1000;
    const stepDuration = 60.0 / bpm;

    // Debug timing every 60 frames (about once per second)
    if (Math.floor(now / 1000) % 1 === 0) {
        debugLog('Animation', 'Timing check', { 
            currentTime, 
            masterLastStepTime,
            stepDuration, 
            bpm,
            isPlaying1,
            isPlaying2,
            isAnimating
        });
    }

    // Master transport: advance all sequencers in sync
    const timeSinceLastStep = currentTime - masterLastStepTime;
    if (timeSinceLastStep >= stepDuration) {
        masterLastStepTime = currentTime;
        masterStep++;
        
        // Update all sequencers using the unified Sequencer class
        const allSequencers = [sequencer1, sequencer2, ...additionalSequencers].filter(s => s);
        
        allSequencers.forEach(sequencer => {
            if (sequencer && sequencer instanceof Sequencer && sequencer.isPlaying) {
                console.log(`[PLAYHEAD_DEBUG] Calling step() for sequencer ${sequencer.id}`);
                sequencer.step(); // Call step() for timing
            }
        });
        
        // Update visual animations for all sequencers
        allSequencers.forEach(sequencer => {
                if (sequencer && sequencer instanceof Sequencer) {
                sequencer.update(now, bpm); // This only updates visual animations, not timing
                }
            });
    }

    // Update particle system
    if (particleSystemEnabled) {
        updateParticles(1.0 / 60.0);
        if (lineConnectionsEnabled) {
            updateLineConnections();
        }
    }
    // Update LFOs
    updateLFO(now);
    // Update envelope modulations
    Object.keys(window.envelopeStates || {}).forEach(id => {
        updateEnvelopeModulation(now, parseInt(id));
    });
    // Update animations
    if (animations.length > 0) {
        animations = animations.filter(anim => updateAnimation(anim, now));
    }
    if (animations2.length > 0) {
        animations2 = animations2.filter(anim => updateAnimation(anim, now));
    }
    // Custom camera rotation for consistent speed (optimized)
    if (rotationSpeed !== 0 && controls) {
        const rotationAmount = rotationSpeed * 0.01; // Small increment for smooth rotation
        const target = controls.target;
        const dx = camera.position.x - target.x;
        const dz = camera.position.z - target.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const currentAngle = Math.atan2(dx, dz);
        const newAngle = currentAngle + rotationAmount;
        camera.position.x = target.x + Math.sin(newAngle) * distance;
        camera.position.z = target.z + Math.cos(newAngle) * distance;
        camera.lookAt(target);
    }
    // Update controls and render
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
        // Render pop-out window if open
        if (popOutWindow && !popOutWindow.closed && popOutRenderer && popOutCamera) {
            popOutCamera.position.copy(camera.position);
            popOutCamera.quaternion.copy(camera.quaternion);
            popOutCamera.updateMatrixWorld();
            popOutRenderer.render(scene, popOutCamera);
        }
    }
}

// Update the startAnimation function to ensure proper initialization
function startAnimation() {
    if (!isAnimating) {
        debugLog('Animation', 'Starting animation');
        isAnimating = true;
        masterLastStepTime = performance.now() / 1000;
        masterStep = 0;
        currentStep = 0;
        currentStep2 = 0;
        // Reset all sequencers
        const allSequencers = [sequencer1, sequencer2, ...additionalSequencers].filter(s => s);
        allSequencers.forEach(sequencer => {
            if (sequencer instanceof Sequencer) {
                sequencer.reset();
            }
        });
        animate();
    }
}

// Add stopAnimation function
function stopAnimation() {
    if (isAnimating) {
    isAnimating = false;
        if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        }
    }
}

function cleanupOrphanedTargets() {
    // Clean up LFO targets
    lfos.forEach(lfo => {
        if (!lfo || !lfo.targets) return;
        
        lfo.targets = lfo.targets.filter(target => {
            if (!target || !target.element || !document.contains(target.element)) {
                console.log('[Cleanup] Removing orphaned LFO target');
                if (target && target.waveformCanvas) {
                    target.waveformCanvas.remove();
                }
                return false;
            }
            return true;
        });
    });
    
    // Clean up envelope targets
    if (window.envelopeTargets) {
        window.envelopeTargets = window.envelopeTargets.filter(target => {
            if (!target || !target.element || !document.contains(target.element)) {
                console.log('[Cleanup] Removing orphaned envelope target');
                return false;
            }
            return true;
        });
    }
}

// Optimize MIDI message handling
let midiMessageQueue = [];
let lastMidiFlush = performance.now();
const MIDI_FLUSH_INTERVAL = 5; // ms - increased to reduce message loss

// Get current MIDI output
function getCurrentMIDIOutput() {
    if (!window.midiAccess || !window.midiAccess.outputs) {
        debugLog('MIDI', 'No MIDI access or outputs available');
        return null;
    }
    
    const outputs = Array.from(window.midiAccess.outputs.values());
    if (outputs.length === 0) {
        debugLog('MIDI', 'No MIDI outputs found');
        return null;
    }
    
    // Return the first available output
    const output = outputs[0];
    debugLog('MIDI', 'Using MIDI output', {
        name: output.name,
        manufacturer: output.manufacturer,
        id: output.id
    });
    return output;
}

function sendMIDIMessage(message) {
    const messageType = message[0] & 0xF0;
    const channel = message[0] & 0x0F;
    const note = message[1];
    const velocity = message[2];
    
    debugLog('MIDI', 'Sending message', {
        type: messageType === 0x90 ? 'Note On' : messageType === 0x80 ? 'Note Off' : 'Other',
        channel: channel + 1,
        note: note,
        velocity: velocity,
        rawMessage: message
    });
    
    midiMessageQueue.push(message);
    
    const now = performance.now();
    if (now - lastMidiFlush >= MIDI_FLUSH_INTERVAL) {
        flushMIDIMessages();
        lastMidiFlush = now;
    }
}

function flushMIDIMessages() {
    if (midiMessageQueue.length === 0) return;
    
    const midiOutput = getCurrentMIDIOutput();
    if (!midiOutput) {
        debugLog('MIDI', 'No MIDI output available, queueing messages', {
            queueLength: midiMessageQueue.length
        });
        return;
    }
    
    debugLog('MIDI', 'Flushing messages', {
        queueLength: midiMessageQueue.length,
        outputName: midiOutput.name || 'Unknown'
    });
    
    let sentCount = 0;
    let errorCount = 0;
    
    while (midiMessageQueue.length > 0) {
        const message = midiMessageQueue.shift();
        try {
            midiOutput.send(message);
            sentCount++;
        } catch (error) {
            console.error('[MIDI] Error sending message:', error);
            errorCount++;
            // Clear queue if there's an error
            midiMessageQueue = [];
            break;
        }
    }
    
    debugLog('MIDI', 'Flush complete', {
        sentCount: sentCount,
        errorCount: errorCount,
        remainingInQueue: midiMessageQueue.length
    });
}

// Update the playSound function to use the new MIDI handling
function playSound(pitch, velocity, channel = 0) {
    debugLog('Audio', 'Playing sound', {
        pitch: pitch,
        velocity: velocity,
        channel: channel,
        midiAccess: !!window.midiAccess
    });
    
    if (!window.midiAccess) {
        debugLog('Audio', 'No MIDI access available');
        return;
    }
    
    const noteOnMessage = [0x90 + channel, pitch, velocity];
    const noteOffMessage = [0x80 + channel, pitch, 0];
    
    sendMIDIMessage(noteOnMessage);
    
    // Schedule note off
    setTimeout(() => {
        debugLog('Audio', 'Sending note off', { pitch: pitch, channel: channel });
        sendMIDIMessage(noteOffMessage);
    }, 100); // Adjust note duration as needed
}

// Add cleanup on window unload
window.addEventListener('unload', () => {
    stopAnimation();
    cleanupOrphanedTargets();
    // Clear all MIDI notes
    if (window.midiAccess) {
        const output = getCurrentMIDIOutput();
        if (output) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    output.send([0x80 + channel, note, 0]);
                }
            }
        }
    }
});



function createSpheres() {
    if (!scene) {
        throw new Error('Cannot create spheres: scene is not initialized');
    }
    
    debugLog('Spheres', 'Starting sequencer creation');
    
    try {
        // Clear existing sequencers
        if (sequencer1) {
            sequencer1.dispose();
            sequencer1 = null;
        }
        if (sequencer2) {
            sequencer2.dispose();
            sequencer2 = null;
        }
        
        // Clear legacy sphere arrays
        spheres = [];
        spheres2 = [];
        
        // Create platform
        const platformGeometry = new THREE.CylinderGeometry(8, 8.5, 0.2, 64);
        const platformMaterial = createGlossyMaterial(0x2a2a3e, 0.8); // Use a lighter color with high glow for visibility
        console.log(`[PLATFORM_DEBUG] Creating initial platform`, {
            materialCreated: !!platformMaterial,
            materialType: platformMaterial ? platformMaterial.type : 'none',
            color: 0x2a2a3e
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.1;
        scene.add(platform);
        console.log(`[PLATFORM_DEBUG] Platform added to scene`, {
            materialAssigned: !!platform.material,
            materialType: platform.material ? platform.material.type : 'none'
        });
        
        // Read current MIDI channel values from HTML selects
        const midiChannel1Select = document.getElementById('midi-channel-1');
        const midiChannel2Select = document.getElementById('midi-channel-2');
        
        console.log('[MIDI_CHANNEL_DEBUG] HTML select elements found:', {
            midiChannel1Select: !!midiChannel1Select,
            midiChannel2Select: !!midiChannel2Select
        });
        
        if (midiChannel1Select) {
            const originalValue = midiChannel1;
            midiChannel1 = parseInt(midiChannel1Select.value);
            console.log('[MIDI_CHANNEL_DEBUG] Updated midiChannel1 from HTML:', {
                originalValue: originalValue,
                newValue: midiChannel1,
                htmlValue: midiChannel1Select.value,
                selectedOption: midiChannel1Select.options[midiChannel1Select.selectedIndex]?.text
            });
        } else {
            console.log('[MIDI_CHANNEL_DEBUG] midi-channel-1 select not found!');
        }
        
        if (midiChannel2Select) {
            const originalValue = midiChannel2;
            midiChannel2 = parseInt(midiChannel2Select.value);
            console.log('[MIDI_CHANNEL_DEBUG] Updated midiChannel2 from HTML:', {
                originalValue: originalValue,
                newValue: midiChannel2,
                htmlValue: midiChannel2Select.value,
                selectedOption: midiChannel2Select.options[midiChannel2Select.selectedIndex]?.text
            });
        } else {
            console.log('[MIDI_CHANNEL_DEBUG] midi-channel-2 select not found!');
        }
        
        // Create Sequencer instances instead of manual spheres
        console.log('[MIDI_CHANNEL_DEBUG] Creating sequencers with channels:', {
            midiChannel1: midiChannel1,
            midiChannel1Display: midiChannel1 + 1, // Show 1-indexed channel number
            midiChannel2: midiChannel2,
            midiChannel2Display: midiChannel2 + 1  // Show 1-indexed channel number
        });
        
        console.log('[MIDI_CHANNEL_DEBUG] Creating sequencer1 with midiChannel:', midiChannel1);
        sequencer1 = new Sequencer(1, 4, {
            beats: beats,
            steps: totalSteps,
            velocity: 100,
            probability: probability1,
            mode: sequenceMode1,
            bpm: bpm,
            rootNote: rootNote,
            scaleType: scaleType,
            octaveRange: octaveRange,
            centerX: 0,
            centerZ: 0,
            midiChannel: midiChannel1
        });
        console.log('[MIDI_CHANNEL_DEBUG] sequencer1 created with midiChannel:', sequencer1.midiChannel);
        
        console.log('[MIDI_CHANNEL_DEBUG] Creating sequencer2 with midiChannel:', midiChannel2);
        sequencer2 = new Sequencer(2, 6, {
            beats: beats2,
            steps: totalSteps2,
            velocity: 100,
            probability: probability2,
            mode: sequenceMode2,
            bpm: bpm,
            rootNote: rootNote,
            scaleType: scaleType,
            octaveRange: octaveRange,
            centerX: 0,
            centerZ: 0,
            midiChannel: midiChannel2
        });
        console.log('[MIDI_CHANNEL_DEBUG] sequencer2 created with midiChannel:', sequencer2.midiChannel);
        
        console.log('[MIDI_CHANNEL_DEBUG] Sequencers created with channels:', {
            sequencer1Channel: sequencer1.midiChannel,
            sequencer1ChannelDisplay: sequencer1.midiChannel + 1, // Show 1-indexed channel number
            sequencer2Channel: sequencer2.midiChannel,
            sequencer2ChannelDisplay: sequencer2.midiChannel + 1  // Show 1-indexed channel number
        });
        
        // Start both sequencers
        sequencer1.isPlaying = true;
        sequencer2.isPlaying = true;
        
        debugLog('Spheres', 'Sequencer creation complete', {
            sequencer1Id: sequencer1.id,
            sequencer2Id: sequencer2.id
        });
    } catch (error) {
        console.error('Error creating sequencers:', error);
        throw error;
    }
}

function setupAudioContext() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        if (!audioStarted) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            gainNode.gain.value = 0;
            oscillator.start();
            
            oscillator2 = audioContext.createOscillator();
            gainNode2 = audioContext.createGain();
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            oscillator2.type = 'sine';
            gainNode2.gain.value = 0;
            oscillator2.start();
            
            audioStarted = true;
            startButton.style.display = 'none';
        }
    });
}

function playSound() {
    debugLog('Audio', 'playSound() called', {
        isPlaying1: isPlaying1,
        currentStep: currentStep,
        sequenceValue: sequence[currentStep],
        probability1: probability1
    });
    
    if (!isPlaying1) return;
    
    // Check probability
    if (Math.random() * 100 > probability1) {
        debugLog('Audio', 'Note skipped due to probability', { probability1: probability1 });
        return; // Skip note based on probability
    }

    const pitch = pitches[currentStep];
    const velocitySlider = document.getElementById('velocity-slider-1');
    const velocity = velocitySlider ? parseInt(velocitySlider.value) : 100;
    
    if (audioStarted && internalAudioEnabled && sequence[currentStep] === 1) {
        if (chordMode1) {
            const chordNotes = getChordNotes(pitch, chordType1);
            chordNotes.forEach(note => {
                const frequency = midiToFreq(note);
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
            });
        } else {
            const frequency = midiToFreq(pitch);
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        }
    }

    if (midiEnabled && midiOutput && midiOutputEnabled && sequence[currentStep] === 1) {
        debugLog('MIDI', 'Sending MIDI for sequencer 1', {
            midiEnabled: midiEnabled,
            midiOutput: !!midiOutput,
            midiOutputEnabled: midiOutputEnabled,
            pitch: pitch,
            velocity: velocity,
            channel: midiChannel1
        });
        
        if (arpeggiatorState.seq1.enabled) {
            // Update arpeggiator notes when a new step is triggered
            if (chordMode1) {
                arpeggiatorState.seq1.currentNotes = getChordNotes(pitch, chordType1);
            } else {
                arpeggiatorState.seq1.currentNotes = [pitch];
            }
            arpeggiatorState.seq1.currentStep = 0;
            arpeggiatorState.seq1.lastTriggerTime = performance.now();
            arpeggiatorState.seq1.velocity = velocity;
        } else if (chordMode1) {
            try {
                const noteOnChannel = 0x90 | midiChannel1;
                const noteOffChannel = 0x80 | midiChannel1;
                const chordNotes = getChordNotes(pitch, chordType1);
                chordNotes.forEach(note => {
                    debugLog('MIDI', 'Sending chord note', { note: note, velocity: velocity });
                    midiOutput.send([noteOnChannel, note, velocity]);
                    setTimeout(() => {
                        debugLog('MIDI', 'Sending chord note off', { note: note });
                        midiOutput.send([noteOffChannel, note, 0]);
                    }, 100);
                });
            } catch (err) {
                console.error('Error sending MIDI chord:', err);
                debugLog('MIDI', 'Error sending MIDI chord', { error: err.message });
            }
        } else {
            try {
                const noteOnChannel = 0x90 | midiChannel1;
                const noteOffChannel = 0x80 | midiChannel1;
                debugLog('MIDI', 'Sending single note', { pitch: pitch, velocity: velocity });
                midiOutput.send([noteOnChannel, pitch, velocity]);
                setTimeout(() => {
                    debugLog('MIDI', 'Sending note off', { pitch: pitch });
                    midiOutput.send([noteOffChannel, pitch, 0]);
                }, 100);
            } catch (err) {
                console.error('Error sending MIDI:', err);
                debugLog('MIDI', 'Error sending MIDI', { error: err.message });
            }
        }
    } else {
        debugLog('MIDI', 'MIDI conditions not met for sequencer 1', {
            midiEnabled: midiEnabled,
            midiOutput: !!midiOutput,
            midiOutputEnabled: midiOutputEnabled,
            sequenceValue: sequence[currentStep]
        });
    }
}

function playSound2() {
    if (!isPlaying2) return;
    
    // Check probability
    if (Math.random() * 100 > probability2) {
        return; // Skip note based on probability
    }

    const pitch = pitches2[currentStep2];
    const velocitySlider = document.getElementById('velocity-slider-2');
    const velocity = velocitySlider ? parseInt(velocitySlider.value) : 100;
    
    if (audioStarted && internalAudioEnabled && sequence2[currentStep2] === 1) {
        if (chordMode2) {
            const chordNotes = getChordNotes(pitch, chordType2);
            chordNotes.forEach(note => {
                const frequency = midiToFreq(note);
                oscillator2.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode2.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
                gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
            });
        } else {
            const frequency = midiToFreq(pitch);
            oscillator2.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
            gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        }
    }

    if (midiEnabled && midiOutput && midiOutputEnabled && sequence2[currentStep2] === 1) {
        if (arpeggiatorState.seq2.enabled) {
            // Update arpeggiator notes when a new step is triggered
            if (chordMode2) {
                arpeggiatorState.seq2.currentNotes = getChordNotes(pitch, chordType2);
            } else {
                arpeggiatorState.seq2.currentNotes = [pitch];
            }
            arpeggiatorState.seq2.currentStep = 0;
            arpeggiatorState.seq2.lastTriggerTime = performance.now();
            arpeggiatorState.seq2.velocity = velocity;
        } else if (chordMode2) {
            try {
                const noteOnChannel = 0x90 | midiChannel2;
                const noteOffChannel = 0x80 | midiChannel2;
                const chordNotes = getChordNotes(pitch, chordType2);
                chordNotes.forEach(note => {
                    midiOutput.send([noteOnChannel, note, velocity]);
                    setTimeout(() => {
                        midiOutput.send([noteOffChannel, note, 0]);
                    }, 100);
                });
            } catch (err) {
                console.error('Error sending MIDI chord:', err);
            }
        } else {
            try {
                const noteOnChannel = 0x90 | midiChannel2;
                const noteOffChannel = 0x80 | midiChannel2;
                midiOutput.send([noteOnChannel, pitch, velocity]);
                setTimeout(() => {
                    midiOutput.send([noteOffChannel, pitch, 0]);
                }, 100);
            } catch (err) {
                console.error('Error sending MIDI:', err);
            }
        }
    }
}

// Add this before setupControls function
function updateSliderValue(slider, value, unit = '') {
    const valueDisplay = slider.parentElement.querySelector('span') || slider.nextElementSibling;
    if (valueDisplay) {
        valueDisplay.className = 'slider-value';  // Add class for consistent styling
        valueDisplay.style.fontSize = '12px';
        valueDisplay.style.fontFamily = 'Arial, sans-serif';
        valueDisplay.style.marginLeft = '8px';
        valueDisplay.style.minWidth = '50px';     // Ensure consistent width
        valueDisplay.style.display = 'inline-block';
        valueDisplay.style.color = 'var(--text-color)';
        valueDisplay.textContent = `${value}${unit}`;
    }
}

function setupControls() {
    console.log('=== SETUP CONTROLS CALLED ===');
    console.log('Setting up controls...');
    
    const addListener = (id, event, handler) => {
        console.log(`Looking for element with id: ${id}`);
        const element = document.getElementById(id);
        if (element) {
            console.log(`Adding listener for ${id} - element found:`, element);
            element.addEventListener(event, handler);
            // Initialize the value display for sliders
            if (event === 'input' && element.type === 'range') {
                console.log(`Initializing slider ${id} with value:`, element.value);
                handler({ target: element });
            }
        } else {
            console.warn(`Element with id '${id}' not found`);
            console.log('Available elements with similar IDs:');
            document.querySelectorAll('[id*="' + id.split('-')[0] + '"]').forEach(el => {
                console.log('  -', el.id);
            });
        }
    };

    // Add play/pause button handlers for both sequencers
    const playPauseBtn1 = document.getElementById('play-pause-button-1');
    if (playPauseBtn1) {
        playPauseBtn1.addEventListener('click', (e) => {
            if (sequencer1) {
                const isPlaying = sequencer1.togglePlayback();
                e.target.textContent = isPlaying ? 'Stop' : 'Play';
                e.target.classList.toggle('playing', !isPlaying);
                
                if (isPlaying && !isAnimating) {
                startAnimation();
                } else if (!isPlaying && sequencer2 && !sequencer2.isPlaying && isAnimating) {
                    stopAnimation();
            }
        }
    });
    }

    const playPauseBtn2 = document.getElementById('play-pause-button-2');
    if (playPauseBtn2) {
        playPauseBtn2.addEventListener('click', (e) => {
            if (sequencer2) {
                const isPlaying = sequencer2.togglePlayback();
                e.target.textContent = isPlaying ? 'Stop' : 'Play';
                e.target.classList.toggle('playing', !isPlaying);
                
                if (isPlaying && !isAnimating) {
                startAnimation();
                } else if (!isPlaying && sequencer1 && !sequencer1.isPlaying && isAnimating) {
                    stopAnimation();
            }
        }
    });
    }

    // Initialize all slider values
    const initializeSlider = (id, unit = '') => {
        const slider = document.getElementById(id);
        if (slider) {
            console.log(`Initializing slider ${id} with value ${slider.value} ${unit}`);
            updateSliderValue(slider, slider.value, unit);
        } else {
            console.warn(`Slider ${id} not found during initialization`);
        }
    };

    // Initialize all sliders with their current values and units
    initializeSlider('bpm-slider', 'BPM');
    initializeSlider('beats-slider', 'beats');
    initializeSlider('steps-slider', 'steps');
    initializeSlider('beats-slider2', 'beats');
    initializeSlider('steps-slider2', 'steps');
    initializeSlider('octave-range', 'oct');
    initializeSlider('brownian-range-1', 'steps');
    initializeSlider('brownian-range-2', 'steps');
    initializeSlider('rotation-speed', '°/s');
    initializeSlider('rotation-direction', '%');
    initializeSlider('parallax-threshold-slider', 'layers');
    initializeSlider('particle-count-slider', 'particles');
    initializeSlider('particle-speed-slider', 'u/s');
    initializeSlider('swarm-cohesion-slider', '%');
    initializeSlider('glow-intensity', 'x');
    initializeSlider('camera-zoom', 'x');
    initializeSlider('arp-octave-1', 'oct');
    initializeSlider('arp-gate-1', '%');
    initializeSlider('arp-octave-2', 'oct');
    initializeSlider('arp-gate-2', '%');

    addListener('bpm-slider', 'input', (e) => {
        console.log('[DEBUG] BPM slider changed:', e.target.value);
        bpm = parseInt(e.target.value);
        updateSliderValue(e.target, bpm, 'BPM');
    });

    addListener('beats-slider', 'input', (e) => {
        console.log('[DEBUG] Beats slider changed:', e.target.value);
        beats = parseInt(e.target.value);
        updateSliderValue(e.target, beats, 'beats');
        if (sequencer1) {
            sequencer1.setBeats(beats);
        }
        drawSequenceVisualization();
    });

    addListener('steps-slider', 'input', (e) => {
        console.log('[DEBUG] Steps slider changed:', e.target.value);
        totalSteps = parseInt(e.target.value);
        updateSliderValue(e.target, totalSteps, ' steps');
        if (sequencer1) {
            sequencer1.setSteps(totalSteps);
        }
        drawSequenceVisualization();
    });

    addListener('beats-slider2', 'input', (e) => {
        console.log('[DEBUG] Beats slider 2 changed:', e.target.value);
        beats2 = parseInt(e.target.value);
        updateSliderValue(e.target, beats2, ' beats');
        if (sequencer2) {
            sequencer2.setBeats(beats2);
        }
        drawSequenceVisualization();
    });

    addListener('steps-slider2', 'input', (e) => {
        console.log('[DEBUG] Steps slider 2 changed:', e.target.value);
        totalSteps2 = parseInt(e.target.value);
        updateSliderValue(e.target, totalSteps2, ' steps');
        if (sequencer2) {
            sequencer2.setSteps(totalSteps2);
        }
        drawSequenceVisualization();
    });

    addListener('octave-range', 'input', (e) => {
        console.log('[DEBUG] Octave range changed:', e.target.value);
        octaveRange = parseInt(e.target.value);
        updateSliderValue(e.target, octaveRange, ' oct');
        generatePitches();
        generatePitches2();
        createSpheres();
    });

    addListener('brownian-range-1', 'input', (e) => {
        console.log('[DEBUG] Brownian range 1 changed:', e.target.value);
        brownianRange1 = parseInt(e.target.value);
        updateSliderValue(e.target, `±${brownianRange1}`, ' steps');
    });

    addListener('brownian-range-2', 'input', (e) => {
        console.log('[DEBUG] Brownian range 2 changed:', e.target.value);
        brownianRange2 = parseInt(e.target.value);
        updateSliderValue(e.target, `±${brownianRange2}`, ' steps');
    });

    addListener('rotation-speed', 'input', (e) => {
        console.log('[DEBUG] Rotation speed changed:', e.target.value);
        const value = parseFloat(e.target.value);
        rotationSpeed = value / 100;  // Scale from 0 to 0.5
        updateSliderValue(e.target, value.toFixed(1), '°/s');
        
        // Disable OrbitControls autoRotate and use our custom rotation
        if (controls) {
            controls.autoRotate = false;
        }
    });

    addListener('rotation-direction', 'input', (e) => {
        console.log('[DEBUG] Rotation direction changed:', e.target.value);
        const value = parseFloat(e.target.value);
        rotationDirection = (value - 50) / 50;  // Scale from -1 to 1
        updateSliderValue(e.target, value.toFixed(0), '%');
    });

    addListener('parallax-threshold-slider', 'input', (e) => {
        console.log('[DEBUG] Parallax threshold changed:', e.target.value);
        parallaxLayers = parseInt(e.target.value);
        updateSliderValue(e.target, parallaxLayers, ' layers');
        initParticles();
    });

    addListener('particle-count-slider', 'input', (e) => {
        console.log('[DEBUG] Particle count changed:', e.target.value);
        NUM_PARTICLES = parseInt(e.target.value);
        updateSliderValue(e.target, NUM_PARTICLES, ' particles');
        initParticles();
    });

    addListener('particle-speed-slider', 'input', (e) => {
        console.log('[DEBUG] Particle speed changed:', e.target.value);
        particleSpeed = parseFloat(e.target.value);
        updateSliderValue(e.target, particleSpeed.toFixed(1), ' u/s');
    });

    addListener('swarm-cohesion-slider', 'input', (e) => {
        console.log('[DEBUG] Swarm cohesion changed:', e.target.value);
        swarmCohesion = parseFloat(e.target.value);
        updateSliderValue(e.target, swarmCohesion.toFixed(1), '%');
    });

    // Add export logs button handler
    addListener('export-logs-button', 'click', (e) => {
        debugLog('Export', 'Export logs button clicked');
        
        // Try the file picker first, fallback to simple export
        if (window.electronAPI && window.electronAPI.saveLogsToCSVWithDialog) {
            console.log('Electron API available, trying file picker...');
            exportLogsToCSV();
        } else {
            console.log('Electron API not available, using simple export');
            exportLogsSimple();
        }
    });

    // Add download logs button handler (guaranteed to work)
    addListener('download-logs-button', 'click', (e) => {
        debugLog('Export', 'Download logs button clicked');
        console.log('Using file picker method');
        showFilePickerAndSave();
    });

    addListener('glow-intensity', 'input', (e) => {
        const value = parseFloat(e.target.value);
        updateSliderValue(e.target, value.toFixed(1), 'x');
        // Update all sphere materials with new glow intensity
        if (spheres && spheres.length > 0) {
            spheres.forEach((group, i) => {
                const isActive = sequence[i] === 1;
                const isPlayhead = i === currentStep;
                const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
                group.children.forEach(child => {
                    if (child.material) {
                        const newMaterial = createGlossyMaterial(color, value);
                        child.material.dispose();
                        child.material = newMaterial;
                    }
                });
            });
        }
        if (spheres2 && spheres2.length > 0) {
            spheres2.forEach((group, i) => {
                const isActive = sequence2[i] === 1;
                const isPlayhead = i === currentStep2;
                const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
                group.children.forEach(child => {
                    if (child.material) {
                        const newMaterial = createGlossyMaterial(color, value);
                        child.material.dispose();
                        child.material = newMaterial;
                    }
                });
            });
        }
    });

    addListener('arp-octave-1', 'input', (e) => {
        const value = parseInt(e.target.value);
        updateSliderValue(e.target, value, ' oct');
        arpeggiatorState.seq1.octaveRange = value;
    });

    addListener('arp-gate-1', 'input', (e) => {
        const value = parseInt(e.target.value);
        updateSliderValue(e.target, value, '%');
        arpeggiatorState.seq1.gateLength = value / 100;
    });

    addListener('arp-octave-2', 'input', (e) => {
        const value = parseInt(e.target.value);
        updateSliderValue(e.target, value, ' oct');
        arpeggiatorState.seq2.octaveRange = value;
    });

    addListener('arp-gate-2', 'input', (e) => {
        const value = parseInt(e.target.value);
        updateSliderValue(e.target, value, '%');
        arpeggiatorState.seq2.gateLength = value / 100;
    });

    addListener('sequence-mode-1', 'change', (e) => {
        sequenceMode1 = e.target.value;
        currentStep = 0;
        sequenceDirection1 = 1;
        lastBrownianStep1 = 0;
    });

    addListener('sequence-mode-2', 'change', (e) => {
        sequenceMode2 = e.target.value;
        currentStep2 = 0;
        sequenceDirection2 = 1;
        lastBrownianStep2 = 0;
    });

    addListener('internal-audio-toggle', 'change', (e) => {
        internalAudioEnabled = e.target.checked;
    });

    addListener('midi-output-toggle', 'change', (e) => {
        midiOutputEnabled = e.target.checked;
    });

    addListener('midi-channel-1', 'change', (e) => {
        midiChannel1 = parseInt(e.target.value);
        if (sequencer1) {
            sequencer1.midiChannel = midiChannel1;
            console.log('[MIDI_CHANNEL_DEBUG] Updated sequencer 1 MIDI channel to:', midiChannel1, '(MIDI Channel', midiChannel1 + 1, ')');
        }
    });

    addListener('midi-channel-2', 'change', (e) => {
        midiChannel2 = parseInt(e.target.value);
        if (sequencer2) {
            sequencer2.midiChannel = midiChannel2;
            console.log('[MIDI_CHANNEL_DEBUG] Updated sequencer 2 MIDI channel to:', midiChannel2, '(MIDI Channel', midiChannel2 + 1, ')');
        }
    });

    addListener('clear-all', 'click', () => {
        sequence = new Array(totalSteps).fill(0);
        sequence2 = new Array(totalSteps2).fill(0);
        updateSphereColors();
        drawSequenceVisualization(); // Also update the 2D visualization
    });



    addListener('parallax-threshold-slider', 'input', (e) => {
        parallaxLayers = parseInt(e.target.value);
        initParticles();
    });

    addListener('particle-count-slider', 'input', (e) => {
        NUM_PARTICLES = parseInt(e.target.value);
        initParticles();
    });

    addListener('particle-speed-slider', 'input', (e) => {
        particleSpeed = parseFloat(e.target.value);
    });

    addListener('swarm-cohesion-slider', 'input', (e) => {
        swarmCohesion = parseFloat(e.target.value);
    });

    addListener('particle-system-toggle', 'change', (e) => {
        particleSystemEnabled = e.target.checked;
        if (particleSystemEnabled) {
            initParticles();
        } else {
            // Clean up particles
            particles.forEach(particle => {
                if (particle.mesh && particle.mesh.parent) {
                    particle.mesh.parent.remove(particle.mesh);
                    particle.mesh.geometry.dispose();
                    particle.mesh.material.dispose();
                }
            });
            particles = [];
            
            // Clean up lines
            lineSegments.forEach(line => {
                scene.remove(line);
                line.geometry.dispose();
                line.material.dispose();
            });
            lineSegments = [];
            
            // Clean up windows
            windows.forEach(window => window.dispose());
            windows = [];
        }
    });

    addListener('line-connections-toggle', 'change', (e) => {
        lineConnectionsEnabled = e.target.checked;
        if (!lineConnectionsEnabled) {
            // Clean up lines
            lineSegments.forEach(line => {
                scene.remove(line);
                line.geometry.dispose();
                line.material.dispose();
            });
            lineSegments = [];
            
            // Clean up windows
            windows.forEach(window => window.dispose());
            windows = [];
        }
    });

    // Add arpeggiator control event listeners
    addListener('arp-pattern-1', 'change', (e) => {
        arpeggiatorState.seq1.pattern = e.target.value;
    });

    addListener('arp-pattern-2', 'change', (e) => {
        arpeggiatorState.seq2.pattern = e.target.value;
    });

    addListener('arp-division-1', 'change', (e) => {
        arpeggiatorState.seq1.division = parseInt(e.target.value);
    });

    addListener('arp-division-2', 'change', (e) => {
        arpeggiatorState.seq2.division = parseInt(e.target.value);
    });

    addListener('arp-octave-1', 'input', (e) => {
        arpeggiatorState.seq1.octaveRange = parseInt(e.target.value);
    });

    addListener('arp-octave-2', 'input', (e) => {
        arpeggiatorState.seq2.octaveRange = parseInt(e.target.value);
    });

    addListener('arp-gate-1', 'input', (e) => {
        arpeggiatorState.seq1.gateLength = parseInt(e.target.value) / 100;
    });

    addListener('arp-gate-2', 'input', (e) => {
        arpeggiatorState.seq2.gateLength = parseInt(e.target.value) / 100;
    });

    addListener('theme-selector', 'change', (e) => {
        applyTheme(e.target.value);
    });

    addListener('glow-intensity', 'input', (e) => {
        const value = parseFloat(e.target.value);
        updateSliderValue(e.target, value.toFixed(1), 'x');
        // Update all sphere materials with new glow intensity
        if (spheres && spheres.length > 0) {
            spheres.forEach((group, i) => {
                const isActive = sequence[i] === 1;
                const isPlayhead = i === currentStep;
                const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
                group.children.forEach(child => {
                    if (child.material) {
                        const newMaterial = createGlossyMaterial(color, value);
                        child.material.dispose();
                        child.material = newMaterial;
                    }
                });
            });
        }
        if (spheres2 && spheres2.length > 0) {
            spheres2.forEach((group, i) => {
                const isActive = sequence2[i] === 1;
                const isPlayhead = i === currentStep2;
                const color = isPlayhead ? COLORS.playhead : (isActive ? COLORS.active : COLORS.inactive);
                group.children.forEach(child => {
                    if (child.material) {
                        const newMaterial = createGlossyMaterial(color, value);
                        child.material.dispose();
                        child.material = newMaterial;
                    }
                });
            });
        }
    });

    addListener('camera-zoom', 'input', (e) => {
        const zoomValue = parseFloat(e.target.value);
        const targetDistance = 20 / zoomValue;  // Increased range for smoother zoom
        const currentPosition = camera.position.clone();
        const direction = currentPosition.clone().normalize();
        
        // Smoothly interpolate to new position
        const newPosition = direction.multiplyScalar(targetDistance);
        camera.position.lerp(newPosition, 0.1);  // Smooth transition
        
        updateSliderValue(e.target, zoomValue.toFixed(1), 'x');
    });

    addListener('camera-angle', 'input', (e) => {
        const angleValue = parseFloat(e.target.value);
        const radians = (angleValue * Math.PI) / 180;
        const radius = camera.position.length();
        const currentAzimuth = Math.atan2(camera.position.z, camera.position.x);
        
        // Calculate new camera position
        camera.position.x = radius * Math.cos(currentAzimuth) * Math.cos(radians);
        camera.position.y = radius * Math.sin(radians);
        camera.position.z = radius * Math.sin(currentAzimuth) * Math.cos(radians);
        
        // Update camera and controls
        camera.lookAt(0, 0, 0);
        controls.update();
        
        updateSliderValue(e.target, angleValue.toFixed(0), '°');
    });

    // Initialize with default theme
    applyTheme('luminous');

    // Add root note listener
    addListener('root-note', 'change', (e) => {
        rootNote = parseInt(e.target.value);
        generatePitches();
        generatePitches2();
    });

    // Add scale type listener
    addListener('scale-type', 'change', (e) => {
        scaleType = e.target.value;
        generatePitches();
        generatePitches2();
    });

    // Update octave range listener
    addListener('octave-range', 'input', (e) => {
        octaveRange = parseInt(e.target.value);
        updateSliderValue(e.target, octaveRange, ' oct');
        generatePitches();
        generatePitches2();
    });
    
    // Initialize velocity sliders
    const velocitySlider1 = document.getElementById('velocity-slider-1');
    const velocityValue1 = document.getElementById('velocity-value-1');
    if (velocitySlider1 && velocityValue1) {
        velocityValue1.textContent = velocitySlider1.value;
        velocitySlider1.addEventListener('input', (e) => {
            velocityValue1.textContent = e.target.value;
        });
    }
    
    const velocitySlider2 = document.getElementById('velocity-slider-2');
    const velocityValue2 = document.getElementById('velocity-value-2');
    if (velocitySlider2 && velocityValue2) {
        velocityValue2.textContent = velocitySlider2.value;
        velocitySlider2.addEventListener('input', (e) => {
            velocityValue2.textContent = e.target.value;
        });
    }

    // Add chord mode toggle handlers
    addListener('chord-toggle-1', 'change', (e) => {
        chordMode1 = e.target.checked;
        const chordControls = document.querySelector('.chord-controls-1');
        chordControls.style.display = chordMode1 ? 'block' : 'none';
    });

    addListener('chord-toggle-2', 'change', (e) => {
        chordMode2 = e.target.checked;
        const chordControls = document.querySelector('.chord-controls-2');
        chordControls.style.display = chordMode2 ? 'block' : 'none';
    });

    // Add chord type selection handlers
    addListener('chord-type-1', 'change', (e) => {
        chordType1 = e.target.value;
    });

    addListener('chord-type-2', 'change', (e) => {
        chordType2 = e.target.value;
    });

    addListener('probability-slider-1', 'input', (e) => {
        probability1 = parseInt(e.target.value);
        updateSliderValue(e.target, probability1, '%');
    });

    addListener('probability-slider-2', 'input', (e) => {
        probability2 = parseInt(e.target.value);
        updateSliderValue(e.target, probability2, '%');
    });

    // Initialize probability slider values
    initializeSlider('probability-slider-1', '%');
    initializeSlider('probability-slider-2', '%');
}

// Legacy updateSphereColors function removed - now using unified Sequencer class
// Each sequencer handles its own visual updates through VisualEngine

function onWindowResize() {
    console.log('[DEBUG] Window resized');
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (controls) {
        controls.update();
        console.log('[DEBUG] Controls updated after resize');
    }
}

function getNextStep1() {
    switch (sequenceMode1) {
        case 'forward':
            return (currentStep + 1) % totalSteps;
            
        case 'backward':
            return (currentStep - 1 + totalSteps) % totalSteps;
            
        case 'pingpong':
            let nextStep = currentStep + sequenceDirection1;
            if (nextStep >= totalSteps) {
                sequenceDirection1 = -1;
                nextStep = totalSteps - 2;
            } else if (nextStep < 0) {
                sequenceDirection1 = 1;
                nextStep = 1;
            }
            return nextStep;
            
        case 'random':
            return Math.floor(Math.random() * totalSteps);
            
        case 'brownian':
            let range = Math.floor(Math.random() * (brownianRange1 * 2 + 1)) - brownianRange1;
            let brownianStep = (lastBrownianStep1 + range + totalSteps) % totalSteps;
            lastBrownianStep1 = brownianStep;
            return brownianStep;

        case 'spiral':
            // Move in an expanding spiral pattern
            const spiralBase = Math.floor(currentStep / 4);
            const spiralPhase = currentStep % 4;
            return (spiralBase * 4 + ((spiralPhase + 1) % 4)) % totalSteps;

        case 'pendulum':
            // Swing between three points like a pendulum
            const third = Math.floor(totalSteps / 3);
            const pendulumPhase = Math.floor(currentStep / 3) % 3;
            if (pendulumPhase === 0) return 0;
            if (pendulumPhase === 1) return third;
            return third * 2;

        case 'skipTwo':
            // Skip two steps each time
            return (currentStep + 3) % totalSteps;

        case 'fibonacci':
            // Use Fibonacci numbers to determine next step
            const fibStep = (currentStep + 1) % 8;  // Use first 8 Fibonacci numbers
            const fibNumbers = [0, 1, 1, 2, 3, 5, 8, 13];
            return (currentStep + fibNumbers[fibStep]) % totalSteps;

        case 'randomWalk':
            // Random walk with momentum
            const momentum = Math.random() < 0.7 ? sequenceDirection1 : -sequenceDirection1;
            sequenceDirection1 = momentum;
            let walkStep = (currentStep + momentum + totalSteps) % totalSteps;
            return walkStep;
            
        default:
            return (currentStep + 1) % totalSteps;
    }
}

function getNextStep2() {
    switch (sequenceMode2) {
        case 'forward':
            return (currentStep2 + 1) % totalSteps2;
            
        case 'backward':
            return (currentStep2 - 1 + totalSteps2) % totalSteps2;
            
        case 'pingpong':
            let nextStep = currentStep2 + sequenceDirection2;
            if (nextStep >= totalSteps2) {
                sequenceDirection2 = -1;
                nextStep = totalSteps2 - 2;
            } else if (nextStep < 0) {
                sequenceDirection2 = 1;
                nextStep = 1;
            }
            return nextStep;
            
        case 'random':
            return Math.floor(Math.random() * totalSteps2);
            
        case 'brownian':
            let range = Math.floor(Math.random() * (brownianRange2 * 2 + 1)) - brownianRange2;
            let brownianStep = (lastBrownianStep2 + range + totalSteps2) % totalSteps2;
            lastBrownianStep2 = brownianStep;
            return brownianStep;

        case 'spiral':
            const spiralBase = Math.floor(currentStep2 / 4);
            const spiralPhase = currentStep2 % 4;
            return (spiralBase * 4 + ((spiralPhase + 1) % 4)) % totalSteps2;

        case 'pendulum':
            const third = Math.floor(totalSteps2 / 3);
            const pendulumPhase = Math.floor(currentStep2 / 3) % 3;
            if (pendulumPhase === 0) return 0;
            if (pendulumPhase === 1) return third;
            return third * 2;

        case 'skipTwo':
            return (currentStep2 + 3) % totalSteps2;

        case 'fibonacci':
            const fibStep = (currentStep2 + 1) % 8;
            const fibNumbers = [0, 1, 1, 2, 3, 5, 8, 13];
            return (currentStep2 + fibNumbers[fibStep]) % totalSteps2;

        case 'randomWalk':
            const momentum = Math.random() < 0.7 ? sequenceDirection2 : -sequenceDirection2;
            sequenceDirection2 = momentum;
            let walkStep = (currentStep2 + momentum + totalSteps2) % totalSteps2;
            return walkStep;
            
        default:
            return (currentStep2 + 1) % totalSteps2;
    }
}

function createStepAnimation(group, startTime) {
    return {
        group: group,
        startTime: startTime,
        duration: 200, // Reduced from 400ms to 200ms for faster, less aggressive animation
        initialScale: group.scale.clone(),
        initialY: group.position.y,
        phase: 'up'
    };
}

function updateAnimation(anim, now) {
    const elapsed = now - anim.startTime;
    if (elapsed >= anim.duration) {
        anim.group.scale.copy(anim.initialScale);
        anim.group.position.y = anim.initialY;
        return false;
    }

    const progress = elapsed / anim.duration;
    
    // Much more subtle animation
    if (progress < 0.4) {
        const upProgress = progress / 0.4;
        const stretch = Math.sin(upProgress * Math.PI) * 0.15; // Reduced from 0.6
        anim.group.scale.set(
            1 - stretch * 0.1, // Reduced from 0.3
            1 + stretch,
            1 - stretch * 0.1  // Reduced from 0.3
        );
        anim.group.position.y = anim.initialY + stretch * 0.2; // Reduced from 0.8
        // Update emissive for all children
        anim.group.children.forEach(child => {
            if (child.material && child.material.emissive) {
            child.material.emissive.setHex(COLORS.glow);
            }
            if (child.material && typeof child.material.emissiveIntensity !== 'undefined') {
                child.material.emissiveIntensity = 0.3 * (1 - upProgress);
            }
        });
    } else {
        const fallProgress = (progress - 0.4) / 0.6;
        const squash = Math.pow(fallProgress, 2);
        anim.group.scale.set(
            1 + squash * 0.1, // Reduced from 0.4
            1 - squash * 0.15, // Reduced from 0.6
            1 + squash * 0.1   // Reduced from 0.4
        );
        anim.group.position.y = anim.initialY + (1 - squash) * 0.2; // Reduced from 0.8
        // Update emissive for all children
        anim.group.children.forEach(child => {
            if (child.material && typeof child.material.emissiveIntensity !== 'undefined') {
                child.material.emissiveIntensity = 0.2 * (1 - fallProgress);
            }
        });
    }
    
    return true;
}

class Window {
    constructor(points, scene) {
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
        geometry.setIndex([0, 1, 2]);

        const material = new THREE.MeshBasicMaterial({
            color: COLORS.glow,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.targetOpacity = WINDOW_OPACITY;
        this.fadeSpeed = WINDOW_FADE_SPEED;
        scene.add(this.mesh);
    }

    update() {
        const currentOpacity = this.mesh.material.opacity;
        if (currentOpacity < this.targetOpacity) {
            this.mesh.material.opacity = Math.min(currentOpacity + this.fadeSpeed, this.targetOpacity);
        }
        return this.mesh.material.opacity > 0;
    }

    fadeOut() {
        this.targetOpacity = 0;
    }

    dispose() {
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

function updateLines() {
    lineSegments.forEach(line => {
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    lineSegments = [];

    windows = windows.filter(window => {
        const isActive = window.update();
        if (!isActive) {
            window.dispose();
            return false;
        }
        return true;
    });

    const gridSize = MAX_LINE_DISTANCE;
    const grid = new Map();
    
    particles.forEach((particle, i) => {
        if (isNaN(particle.position.length())) return;
        
        const gridX = Math.floor(particle.position.x / gridSize);
        const gridY = Math.floor(particle.position.y / gridSize);
        const gridZ = Math.floor(particle.position.z / gridSize);
        const key = `${gridX},${gridY},${gridZ}`;
        
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(i);
    });

    const processed = new Set();
    
    particles.forEach((particle, i) => {
        if (isNaN(particle.position.length())) return;
        
        const gridX = Math.floor(particle.position.x / gridSize);
        const gridY = Math.floor(particle.position.y / gridSize);
        const gridZ = Math.floor(particle.position.z / gridSize);
        
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const key = `${gridX + x},${gridY + y},${gridZ + z}`;
                    const neighbors = grid.get(key) || [];
                    
                    neighbors.forEach(j => {
                        if (i >= j || processed.has(`${i}-${j}`)) return;
                        if (isNaN(particles[j].position.length())) return;
                        
                        const distance = particle.position.distanceTo(particles[j].position);
                        if (!isNaN(distance) && distance < MAX_LINE_DISTANCE && distance > MIN_LINE_DISTANCE) {
                            processed.add(`${i}-${j}`);
                            
                            const opacity = 1 - (distance / MAX_LINE_DISTANCE);
                            const material = new THREE.LineBasicMaterial({
                                color: 0xffffff,
                                transparent: true,
                                opacity: opacity * 0.3
                            });

                            const points = [particle.position, particles[j].position];
                            const geometry = new THREE.BufferGeometry().setFromPoints(points);
                            
                            const line = new THREE.Line(geometry, material);
                            scene.add(line);
                            lineSegments.push(line);
                        }
                    });
                }
            }
        }
    });
}

function updateParticles() {
    console.log('[DEBUG] Updating particles');
    particles.forEach(particle => {
        particle.update(particles);
    });
}

function updateLineConnections() {
    // Clean up old lines
    lineSegments.forEach(line => {
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    lineSegments = [];
    
    // Create spatial grid for optimization
    const gridSize = MAX_LINE_DISTANCE;
    const grid = new Map();
    
    // Add particles to grid
    particles.forEach((particle, i) => {
        if (!particle || !particle.position || isNaN(particle.position.length())) return;
        
        const gridX = Math.floor(particle.position.x / gridSize);
        const gridY = Math.floor(particle.position.y / gridSize);
        const gridZ = Math.floor(particle.position.z / gridSize);
        const key = `${gridX},${gridY},${gridZ}`;
        
        if (!grid.has(key)) {
            grid.set(key, []);
        }
        grid.get(key).push(i);
    });
    
    // Check for connections
    particles.forEach((particle1, i) => {
        if (!particle1 || !particle1.position || isNaN(particle1.position.length())) return;
        
        const gridX = Math.floor(particle1.position.x / gridSize);
        const gridY = Math.floor(particle1.position.y / gridSize);
        const gridZ = Math.floor(particle1.position.z / gridSize);
        
        // Check neighboring cells
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const key = `${gridX + x},${gridY + y},${gridZ + z}`;
                    const cellParticles = grid.get(key) || [];
                    
                    cellParticles.forEach(j => {
                        if (i >= j) return; // Only process each pair once
                        
                        const particle2 = particles[j];
                        if (!particle2 || !particle2.position || isNaN(particle2.position.length())) return;
                        
                        const distance = particle1.position.distanceTo(particle2.position);
                        if (distance < MAX_LINE_DISTANCE && distance > MIN_LINE_DISTANCE) {
                            const opacity = 1 - (distance / MAX_LINE_DISTANCE);
                            const material = new THREE.LineBasicMaterial({
                                color: 0x00ff95,  // Match theme color
                                transparent: true,
                                opacity: opacity * 0.5,  // Increased base opacity
                                linewidth: 1
                            });
                            
                            const geometry = new THREE.BufferGeometry();
                            const positions = new Float32Array([
                                particle1.position.x, particle1.position.y, particle1.position.z,
                                particle2.position.x, particle2.position.y, particle2.position.z
                            ]);
                            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                            
                            const line = new THREE.Line(geometry, material);
                            scene.add(line);
                            lineSegments.push(line);
                        }
                    });
                }
            }
        }
    });
}

function drawWaveform(canvas, lfo, phase) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    const bgColor = `#${COLORS.background.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    const gridColor = `#${COLORS.inactive.toString(16).padStart(6, '0')}40`;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Grid lines
    for(let i = 0; i < 4; i++) {
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(0, i * canvas.height/3);
        ctx.lineTo(canvas.width, i * canvas.height/3);
        ctx.stroke();
        
        // Vertical
        ctx.beginPath();
        ctx.moveTo(i * canvas.width/3, 0);
        ctx.lineTo(i * canvas.width/3, canvas.height);
        ctx.stroke();
    }
    
    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = lfo.color || `#${COLORS.active.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = 2;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const amplitude = height / 3;
    
    for (let x = 0; x < width; x++) {
        const t = (x / width + phase) % 1;
        let y;
        
        switch (lfo.shape) {
            case 'sine':
                y = Math.sin(t * Math.PI * 2) * amplitude + centerY;
                break;
            case 'triangle':
                y = (Math.abs(((t * 4 + 3) % 4) - 2) - 1) * amplitude + centerY;
                break;
            case 'square':
                y = (t < 0.5 ? 1 : -1) * amplitude + centerY;
                break;
            case 'sawtooth':
                y = ((t * 2 + 1) % 2 - 1) * amplitude + centerY;
                break;
            case 'ramp':
                y = (1 - t * 2) * amplitude + centerY;
                break;
            case 'random':
                y = (lfo.currentRandomValue * 2 - 1) * amplitude + centerY;
                break;
        }
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

// Add a throttled version of updateWaveformVisualizations
const throttledUpdateWaveforms = (() => {
    let lastCall = 0;
    const throttleInterval = 1000 / 15; // Reduced to 15 fps for better performance
    let animationFrame = null;
    
    return () => {
        if (animationFrame) return; // Skip if we're already waiting for an update
        
        const now = performance.now();
        if (now - lastCall >= throttleInterval) {
            lastCall = now;
            
            // Use requestAnimationFrame for better performance
            animationFrame = requestAnimationFrame(() => {
                lfos.forEach((lfo, index) => {
                    if (!lfo || !lfo.active) return;
                    
                    // Only update main LFO waveform if visible
                    if (lfo.waveformCanvas && isElementVisible(lfo.waveformCanvas)) {
                        drawWaveform(lfo.waveformCanvas, lfo, lfo.phase);
                    }
                    
                    // Only update visible target waveforms
                    lfo.targets.forEach(target => {
                        if (target.waveformCanvas && isElementVisible(target.waveformCanvas)) {
                            drawWaveform(target.waveformCanvas, lfo, lfo.phase);
                        }
                    });
                });
                animationFrame = null;
            });
        }
    };
})();

// Helper function to check if element is visible
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add this function to handle arpeggiator updates
function updateArpeggiators(now) {
    const mainInterval = (60 / bpm) * 1000; // Convert BPM to milliseconds
    
    // Update Sequencer 1 Arpeggiator
    if (arpeggiatorState.seq1.enabled && arpeggiatorState.seq1.currentNotes.length > 0) {
        const arpInterval = mainInterval / arpeggiatorState.seq1.division;
        if (now - arpeggiatorState.seq1.lastTriggerTime >= arpInterval) {
            if (midiEnabled && midiOutput && midiOutputEnabled) {
                const noteOnChannel = 0x90 | midiChannel1;
                const noteOffChannel = 0x80 | midiChannel1;
                const currentNote = getArpNote(arpeggiatorState.seq1);
                
                // Send note on
                midiOutput.send([noteOnChannel, currentNote, arpeggiatorState.seq1.velocity]);
                
                // Schedule note off
                setTimeout(() => {
                    midiOutput.send([noteOffChannel, currentNote, 0]);
                }, arpInterval * arpeggiatorState.seq1.gateLength);
            }
            
            // Update step and timing
            arpeggiatorState.seq1.currentStep = (arpeggiatorState.seq1.currentStep + 1) % arpeggiatorState.seq1.currentNotes.length;
            arpeggiatorState.seq1.lastTriggerTime = now;
        }
    }
    
    // Update Sequencer 2 Arpeggiator
    if (arpeggiatorState.seq2.enabled && arpeggiatorState.seq2.currentNotes.length > 0) {
        const arpInterval = mainInterval / arpeggiatorState.seq2.division;
        if (now - arpeggiatorState.seq2.lastTriggerTime >= arpInterval) {
            if (midiEnabled && midiOutput && midiOutputEnabled) {
                const noteOnChannel = 0x90 | midiChannel2;
                const noteOffChannel = 0x80 | midiChannel2;
                const currentNote = getArpNote(arpeggiatorState.seq2);
                
                // Send note on
                midiOutput.send([noteOnChannel, currentNote, arpeggiatorState.seq2.velocity]);
                
                // Schedule note off
                setTimeout(() => {
                    midiOutput.send([noteOffChannel, currentNote, 0]);
                }, arpInterval * arpeggiatorState.seq2.gateLength);
            }
            
            // Update step and timing
            arpeggiatorState.seq2.currentStep = (arpeggiatorState.seq2.currentStep + 1) % arpeggiatorState.seq2.currentNotes.length;
            arpeggiatorState.seq2.lastTriggerTime = now;
        }
    }
}

function generatePitches() {
    const scale = scales[scaleType];
    pitches = [];
    
    // Calculate total number of notes needed based on steps
    for (let i = 0; i < totalSteps; i++) {
        // Calculate position in the scale sequence
        const scalePosition = i % scale.length;
        // Calculate which octave we're in (0 to octaveRange-1)
        const octaveOffset = Math.floor(i / scale.length) % octaveRange;
        // Calculate final pitch: root + scale interval + (octave * 12)
        const pitch = rootNote + scale[scalePosition] + (octaveOffset * 12);
        pitches.push(pitch);
    }
}

function generatePitches2() {
    const scale = scales[scaleType];
    pitches2 = [];
    
    // Calculate total number of notes needed based on steps
    for (let i = 0; i < totalSteps2; i++) {
        // Calculate position in the scale sequence
        const scalePosition = i % scale.length;
        // Calculate which octave we're in (0 to octaveRange-1)
        const octaveOffset = Math.floor(i / scale.length) % octaveRange;
        // Calculate final pitch: root + scale interval + (octave * 12)
        const pitch = rootNote + scale[scalePosition] + (octaveOffset * 12);
        pitches2.push(pitch);
    }
}

function onMouseMove(event) {
    // Only update mouse position for raycaster
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Rest of raycaster logic...
}

function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    
    // Collect all meshes from all sequencers
    const allSequencers = [sequencer1, sequencer2, ...additionalSequencers].filter(s => s);
    const allMeshes = allSequencers.flatMap(sequencer => 
        sequencer.spheres ? sequencer.spheres.flatMap(group => group.children) : []
    );
    
    const intersects = raycaster.intersectObjects(allMeshes);
    if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const group = mesh.parent;
        
        // Find which sequencer this mesh belongs to
        for (const sequencer of allSequencers) {
            if (sequencer.spheres && sequencer.spheres.includes(group)) {
                const index = sequencer.spheres.indexOf(group);
        if (index !== -1) {
                    // Toggle the step in the sequencer's sequence
                    sequencer.sequence[index] = sequencer.sequence[index] === 1 ? 0 : 1;
                    // Update the sequencer's visual representation
                    sequencer.visualEngine.updateSphereColors();
            return;
        }
    }
        }
    }
}

function initMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: false })
            .then(onMIDISuccess, onMIDIFailure);
    } else {
        console.warn("WebMIDI is not supported in this browser.");
        const midiStatus = document.createElement('div');
        midiStatus.className = 'control-group';
        midiStatus.innerHTML = '<label style="color: #ff6b6b;">MIDI not supported in this browser</label>';
        document.querySelector('.pitch-controls').appendChild(midiStatus);
    }
}

function onMIDISuccess(midiAccess) {
    debugLog('MIDI', 'MIDI Access Success', {
        outputsCount: midiAccess.outputs.size,
        inputsCount: midiAccess.inputs.size
    });
    
    console.log('MIDI Access Success', midiAccess);
    midiEnabled = true;
    midiOutputs = Array.from(midiAccess.outputs.values());
    
    console.log('Available MIDI Outputs:', midiOutputs);
    debugLog('MIDI', 'Available MIDI Outputs', {
        outputs: midiOutputs.map(output => ({
            name: output.name,
            manufacturer: output.manufacturer,
            id: output.id
        }))
    });
    
    // Try to find and auto-connect to IAC Driver
    const iacDriver = midiOutputs.find(output => 
        output.name === 'IAC Driver Bus 1' || 
        output.name === 'IAC Bus Driver 1 (Apple Inc.)'
    );
    
    if (iacDriver) {
        console.log('Found IAC Driver, auto-connecting...', iacDriver);
        midiOutput = iacDriver;
        midiOutputEnabled = true;
    } else if (midiOutputs.length > 0) {
        // If no IAC Driver found, use the first available MIDI output
        console.log('No IAC Driver found, using first available MIDI output:', midiOutputs[0]);
        midiOutput = midiOutputs[0];
        midiOutputEnabled = true;
    }
    
    const midiControls = document.createElement('div');
    midiControls.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'MIDI Output';
    midiControls.appendChild(label);
    
    const statusText = document.createElement('div');
    statusText.style.fontSize = '12px';
    statusText.style.marginBottom = '5px';
    statusText.textContent = `${midiOutputs.length} MIDI outputs found${iacDriver ? ' (IAC Driver auto-connected)' : ''}`;
    midiControls.appendChild(statusText);
    
    const midiSelect = document.createElement('select');
    midiSelect.id = 'midi-output';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select MIDI Output';
    midiSelect.appendChild(defaultOption);
    
    midiOutputs.forEach((output, index) => {
        console.log('Adding MIDI output:', output.name);
        const option = document.createElement('option');
        option.value = index;
        option.text = `${output.name} (${output.manufacturer || 'Unknown'})`;
        if (output === iacDriver) {
            option.selected = true;
        }
        midiSelect.appendChild(option);
    });
    
    midiControls.appendChild(midiSelect);
    
    const pitchControls = document.querySelector('.pitch-controls');
    pitchControls.appendChild(midiControls);
    
    midiSelect.addEventListener('change', (e) => {
        if (e.target.value === '') {
            midiOutput = null;
            midiOutputEnabled = false;
            console.log('MIDI output cleared');
        } else {
            midiOutput = midiOutputs[parseInt(e.target.value)];
            midiOutputEnabled = true;
            console.log('Selected MIDI output:', midiOutput.name);
            
            // Send test MIDI note
            try {
                midiOutput.send([0x90, 60, 100]);
                setTimeout(() => midiOutput.send([0x80, 60, 0]), 100);
                console.log('Test MIDI message sent successfully');
            } catch (err) {
                console.error('Error sending test MIDI message:', err);
            }
        }
    });
    
    midiAccess.onstatechange = function(e) {
        console.log('MIDI state change:', e.port.name, e.port.state);
    };
}

function onMIDIFailure(error) {
    console.warn("Could not access MIDI devices:", error);
    const midiStatus = document.createElement('div');
    midiStatus.className = 'control-group';
    midiStatus.innerHTML = `<label style="color: #ff6b6b;">MIDI Error: ${error}</label>`;
    document.querySelector('.pitch-controls').appendChild(midiStatus);
}

function showNoteInfo(infoElement, pitch, event) {
    if (!infoElement) return;  // Add null check
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(pitch / 12) - 1;
    const noteName = noteNames[pitch % 12];
    
    infoElement.textContent = `Note: ${noteName}${octave}`;
    infoElement.style.display = 'block';
    infoElement.style.left = `${event.clientX + 10}px`;
    infoElement.style.top = `${event.clientY + 10}px`;
}

function setupLFOControls() {
    debugLog('LFO', 'Setting up LFO controls');
    
    // Setup Add LFO button (only if not already set up)
    const addLFOButton = document.querySelector('.add-lfo-button');
    debugLog('LFO', 'Add LFO button found', { button: !!addLFOButton });
    
    if (addLFOButton && !addLFOButton.hasEventListener) {
        addLFOButton.addEventListener('click', () => {
            debugLog('LFO', 'Add LFO button clicked');
            createNewLFO();
        });
        addLFOButton.hasEventListener = true; // Mark as having event listener
        debugLog('LFO', 'Add LFO button event listener added');
    } else if (addLFOButton) {
        debugLog('LFO', 'Add LFO button already has event listener');
    } else {
        debugLog('LFO', 'Add LFO button not found');
    }

    // Make all sliders, select elements, and controls droppable targets
    const allTargets = document.querySelectorAll('input[type="range"], select, .lfo-control, .envelope-control');
    debugLog('LFO', 'Setting up drop targets', { count: allTargets.length });
    
    allTargets.forEach(element => {
        // Skip if already has drop handler
        if (element.hasDropHandler) {
            debugLog('LFO', 'Skipping element, already has handler', { id: element.id });
            return;
        }

        debugLog('LFO', 'Setting up drop target', { id: element.id });
        
        element.addEventListener('dragenter', (e) => {
            e.preventDefault();
            debugLog('LFO', 'Drag entered', { id: element.id });
            element.classList.add('lfo-target-hover');
        });

        element.addEventListener('dragleave', () => {
            debugLog('LFO', 'Drag left', { id: element.id });
            element.classList.remove('lfo-target-hover');
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        element.addEventListener('drop', (e) => {
            debugLog('LFO', 'Drop event on', { id: element.id });
            handleModulatorDrop(e);
        });
        
        element.hasDropHandler = true;
    });
    
    debugLog('LFO', 'LFO controls setup complete');
}

// Add a function to reinitialize drop targets
function reinitializeDropTargets() {
    console.log('[LFO] Reinitializing drop targets');
    setupLFOControls();
}

// Make LFO targets draggable
function setupLFOControlsForIndex(index) {
    const lfo = lfos[index];
    if (!lfo) return;

    const lfoTarget = document.querySelector(`.lfo-target[data-lfo-id="${lfo.id}"]`);
    if (lfoTarget) {
        lfoTarget.draggable = true;
        lfoTarget.addEventListener('dragstart', (e) => {
            console.log('[LFO] Starting drag:', { lfoId: lfo.id });
            e.dataTransfer.setData('application/modulator-type', 'lfo');
            e.dataTransfer.setData('text/plain', lfo.id.toString());
            e.dataTransfer.effectAllowed = 'move';
            lfoTarget.classList.add('dragging');
        });

        lfoTarget.addEventListener('dragend', () => {
            lfoTarget.classList.remove('dragging');
        });
    }
}

function handleModulatorDrop(e, slider) {
    e.preventDefault();
    const dropTarget = slider || e.currentTarget;
    dropTarget.classList.remove('slider-target');
    dropTarget.classList.remove('envelope-target-hover');
    
    // Disconnect any existing connections before making new ones
    disconnectLFOTarget(dropTarget);
    disconnectEnvelopeTarget(dropTarget);
    
    const id = e.dataTransfer.getData('text/plain');
    const modulatorType = e.dataTransfer.getData('application/modulator-type') || 'unknown';
    console.log('[Drop] Processing drop with ID:', id, 'Type:', modulatorType);
    
    if (!id) {
        console.log('[Drop] No data found in drop event');
        return;
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        console.log('[Drop] Invalid ID format:', id);
        return;
    }

    // Check modulator type explicitly
    if (modulatorType === 'lfo') {
        console.log('[LFO] Drop event:', { lfoId: parsedId, sliderId: dropTarget.id });
        handleLFODrop(dropTarget, parsedId);
    } else if (modulatorType === 'envelope') {
        console.log('[ADSR] Drop event:', { envelopeId: parsedId, sliderId: dropTarget.id });
        handleEnvelopeConnection(dropTarget, parsedId);
    } else {
        // Fallback to checking both types (for backward compatibility)
        const lfo = lfos.find(l => l && l.id === parsedId);
        if (lfo) {
            handleLFODrop(dropTarget, parsedId);
            return;
        }

        const envelope = window.envelopes.find(e => e && e.id === parsedId);
        if (envelope) {
            handleEnvelopeConnection(dropTarget, parsedId);
            return;
        }

        console.log('[Drop] No matching LFO or envelope found for ID:', parsedId);
    }
}

function handleLFODrop(element, sourceLfoId) {
    console.log('[LFO] Processing drop:', { sourceLfoId, elementId: element.id });
    
    // Ensure sourceLfoId is a number
    if (typeof sourceLfoId !== 'number') {
        console.log('[LFO] Invalid LFO ID:', sourceLfoId);
        return;
    }

    const lfo = lfos.find(l => l && l.id === sourceLfoId);
    if (!lfo) {
        console.log('[LFO] No matching LFO found for ID:', sourceLfoId);
        return;
    }

    // Disconnect any existing LFO from this target
    disconnectLFOTarget(element);

    // Create new target connection
    const target = {
        element: element,
        type: element.tagName.toLowerCase() === 'select' ? 'select' : 'slider',
        min: element.tagName.toLowerCase() === 'select' ? 0 : (parseFloat(element.min) || 0),
        max: element.tagName.toLowerCase() === 'select' ? (element.options.length - 1) : (parseFloat(element.max) || 100),
        originalValue: element.tagName.toLowerCase() === 'select' ? element.selectedIndex : (parseFloat(element.value) || 0)
    };

    if (!lfo.targets) lfo.targets = [];
    lfo.targets.push(target);

    // Add visual feedback
    const controlGroup = element.closest('.control-group');
    if (controlGroup) {
        // First, ensure any existing visual containers are removed
        const existingContainer = controlGroup.querySelector('.lfo-visual-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Reset all styles before applying new ones
        controlGroup.style.cssText = '';
        
        // Set up container layout
        controlGroup.style.position = 'relative';
        const isRightMenu = controlGroup.closest('.pitch-controls') !== null;
        
        // Create a container for the visualization elements
        const visualContainer = document.createElement('div');
        visualContainer.className = 'lfo-visual-container';
        visualContainer.style.position = 'absolute';
        visualContainer.style.top = '50%';
        visualContainer.style.transform = 'translateY(-50%)';
        
        // Store the original styles
        target.originalStyles = {
            marginRight: controlGroup.style.marginRight,
            marginLeft: controlGroup.style.marginLeft,
            paddingRight: controlGroup.style.paddingRight,
            paddingLeft: controlGroup.style.paddingLeft
        };
        
        if (isRightMenu) {
            visualContainer.style.right = '-95px';
            if (element.tagName.toLowerCase() === 'select') {
            controlGroup.style.marginRight = '95px';
            controlGroup.style.paddingRight = '10px';
            } else {
                controlGroup.style.marginRight = '95px';
                controlGroup.style.paddingRight = '10px';
            }
        } else {
            visualContainer.style.left = '-95px';
            if (element.tagName.toLowerCase() === 'select') {
                controlGroup.style.marginLeft = '95px';
                controlGroup.style.paddingLeft = '10px';
            } else {
            controlGroup.style.marginLeft = '95px';
            controlGroup.style.paddingLeft = '10px';
            }
        }

        // Create waveform visualization
        const waveformCanvas = document.createElement('canvas');
        waveformCanvas.width = 40;
        waveformCanvas.height = 20;
        waveformCanvas.className = 'waveform-canvas';
        target.waveformCanvas = waveformCanvas;
        visualContainer.appendChild(waveformCanvas);

        // Create disconnect button
        const disconnectButton = document.createElement('button');
        disconnectButton.innerHTML = '×';
        disconnectButton.className = 'lfo-disconnect-button';
        disconnectButton.onclick = () => disconnectLFOTarget(element);
        visualContainer.appendChild(disconnectButton);

        // Add the visual container to the control group
        controlGroup.appendChild(visualContainer);

        // Add glow effect to the target element
        if (element.tagName.toLowerCase() === 'select') {
        element.style.boxShadow = `0 0 10px ${lfo.color}80`;
        element.style.border = `1px solid ${lfo.color}`;
        } else {
            element.style.boxShadow = `0 0 10px ${lfo.color}80`;
            element.style.border = `1px solid ${lfo.color}`;
        }
        element.classList.add('lfo-connected');

        // Draw initial waveform
        drawWaveform(waveformCanvas, lfo, 0);

        // Update target display
        updateLFOTargetDisplay(lfo);
    }
}

// Add new function to handle LFO target disconnection
function disconnectLFOTarget(element) {
    lfos.forEach((lfo, index) => {
        if (!lfo) return;
        
        const targetIndex = lfo.targets.findIndex(t => t && t.element === element);
        if (targetIndex !== -1) {
            const target = lfo.targets[targetIndex];
            
            // Clean up visual elements
            const controlGroup = element.closest('.control-group');
            if (controlGroup) {
                // Check if this is the Shape control
                const isShapeControl = element.id && element.id.includes('lfo-shape');
                
                // First remove the visual container and all its contents
                const visualContainer = controlGroup.querySelector('.lfo-visual-container');
                if (visualContainer) {
                    visualContainer.remove();
                }
                
                // Only reset positioning styles if this is not the Shape control
                if (!isShapeControl) {
                    if (target.originalStyles) {
                        controlGroup.style.marginRight = target.originalStyles.marginRight;
                        controlGroup.style.marginLeft = target.originalStyles.marginLeft;
                        controlGroup.style.paddingRight = target.originalStyles.paddingRight;
                        controlGroup.style.paddingLeft = target.originalStyles.paddingLeft;
                    } else {
                controlGroup.style.marginRight = '';
                controlGroup.style.marginLeft = '';
                controlGroup.style.paddingRight = '';
                controlGroup.style.paddingLeft = '';
                        controlGroup.style.position = '';
                    }
                }
                
                // Always reset the element's visual styles
                element.style.boxShadow = '';
                element.style.border = '';
                element.classList.remove('lfo-connected', 'lfo-target-hover', 'slider-target');
            }
            
            // Remove event listener
            if (target.manualInputHandler) {
                element.removeEventListener('input', target.manualInputHandler);
            }
            
            // Remove target from LFO
            lfo.targets.splice(targetIndex, 1);
            
            // Update the target display with all remaining targets
            const targetDiv = document.querySelector(`.lfo-target[data-lfo-id="${lfo.id}"]`);
            if (targetDiv) {
                const validTargets = lfo.targets.filter(t => t && t.element);
                if (validTargets.length === 0) {
                    targetDiv.textContent = 'Drag this to a slider ⇄';
                } else {
                    const connections = validTargets.map(t => {
                        const el = t.element;
                        if (el.classList.contains('lfo-control')) {
                            const paramType = el.id.split('-')[1];
                            const targetLfoId = parseInt(el.dataset.lfoId);
                            return `LFO ${targetLfoId} ${paramType}`;
                        } else {
                            const group = el.closest('.control-group');
                            const label = group ? group.querySelector('label') : null;
                            return label ? label.textContent.trim() : (el.id || 'Unknown Parameter');
                        }
                    });
                    targetDiv.textContent = `Connected to: ${connections.join(', ')}`;
                }
            }
        }
    });
}

function removeLFO(lfoIndex) {
    const lfo = lfos[lfoIndex];
    if (!lfo) return;

    // Clean up all target connections
    lfo.targets.forEach(target => {
        if (target.waveformCanvas) {
            target.waveformCanvas.remove();
        }
        if (target.element) {
            target.element.removeEventListener('input', target.manualInputHandler);
            target.element.classList.remove('lfo-connected');
            
            // Reset container layout for each target
            const controlGroup = target.element.closest('.control-group');
            if (controlGroup) {
                const isRightMenu = controlGroup.closest('.pitch-controls');
                if (isRightMenu) {
                    controlGroup.style.marginRight = '0';
                    controlGroup.style.paddingRight = '0';
                } else {
                    controlGroup.style.marginLeft = '0';
                }
                
                // Remove the disconnect button if it exists
                const disconnectButton = controlGroup.querySelector('.lfo-disconnect-button');
                if (disconnectButton) {
                    disconnectButton.remove();
                }
            }
        }
    });

    // Clean up LFO's own waveform canvas
    if (lfo.waveformCanvas) {
        lfo.waveformCanvas.remove();
    }

    // Remove the LFO element from DOM
    const lfoElement = document.querySelector(`.modulator-section[data-lfo-index="${lfoIndex}"]`);
    if (lfoElement) {
        lfoElement.remove();
    }

    // Store the deleted LFO ID for reuse
    deletedLfoIds.push(lfo.id);
    
    // Clear the LFO from the array
    lfos[lfoIndex] = null;
}

// Update setupLFOControlsForIndex to include remove button functionality
function setupLFOControlsForIndex(lfoIndex) {
    const lfo = lfos[lfoIndex];
    const lfoElement = document.querySelector(`.modulator-section[data-lfo-index="${lfoIndex}"]`);
    if (!lfoElement || !lfo) return;
    
    // Apply LFO color to the section header
    const header = lfoElement.querySelector('.modulator-header');
    if (header) {
        header.style.borderBottom = `1px solid ${lfo.color}80`;
        header.style.boxShadow = `0 2px 4px ${lfo.color}20`;
    }
    
    // Style the LFO target element with the unique color
    const lfoTargetElement = lfoElement.querySelector('.lfo-target');
    if (lfoTargetElement) {
        lfoTargetElement.style.borderColor = lfo.color + '80';
        lfoTargetElement.style.boxShadow = `0 0 5px ${lfo.color}40`;
        lfoTargetElement.style.color = lfo.color;
    }
    
    // Setup remove button
    const removeButton = lfoElement.querySelector('.remove-lfo');
    if (removeButton) {
        removeButton.onclick = () => removeLFO(lfoIndex);
    }

    // Setup drag and drop for LFO target
    const lfoTarget = lfoElement.querySelector('.lfo-target');
    if (lfoTarget) {
        lfoTarget.setAttribute('draggable', 'true');
        lfoTarget.dataset.lfoId = lfo.id.toString();

        lfoTarget.addEventListener('dragstart', (e) => {
            console.log('[LFO] Starting drag:', { lfoId: lfo.id });
            e.dataTransfer.setData('application/modulator-type', 'lfo');
            e.dataTransfer.setData('text/plain', lfo.id.toString());
            e.dataTransfer.effectAllowed = 'move';
            lfoTarget.classList.add('dragging');
        });

        lfoTarget.addEventListener('dragend', () => {
            lfoTarget.classList.remove('dragging');
        });
    }

    // Setup LFO controls
    const rateSlider = lfoElement.querySelector(`#lfo-rate-${lfo.id}`);
    const depthSlider = lfoElement.querySelector(`#lfo-depth-${lfo.id}`);
    const shapeSelect = lfoElement.querySelector(`#lfo-shape-${lfo.id}`);
    const activeToggle = lfoElement.querySelector(`#lfo-active-${lfo.id}`);

    // Make LFO controls droppable
    [rateSlider, depthSlider].forEach(slider => {
        if (slider) {
            slider.addEventListener('dragenter', (e) => {
                e.preventDefault();
                slider.classList.add('slider-target');
            });

            slider.addEventListener('dragleave', () => {
                slider.classList.remove('slider-target');
            });

            slider.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            slider.addEventListener('drop', (e) => {
                e.preventDefault();
                slider.classList.remove('slider-target');
                const lfoId = e.dataTransfer.getData('text/plain');
                if (lfoId) {
                    handleLFODrop(slider, parseInt(lfoId));
                }
            });
        }
    });

    // Setup control event listeners
    if (rateSlider) {
        rateSlider.dataset.lfoId = lfo.id.toString();
        rateSlider.addEventListener('input', (e) => {
            lfo.rate = parseFloat(e.target.value);
            updateSliderValue(e.target, lfo.rate.toFixed(1), 'Hz');
        });
    }

    if (depthSlider) {
        depthSlider.dataset.lfoId = lfo.id.toString();
        depthSlider.addEventListener('input', (e) => {
            lfo.depth = parseInt(e.target.value);
            updateSliderValue(e.target, lfo.depth, '%');
        });
    }

    if (shapeSelect) {
        shapeSelect.dataset.lfoId = lfo.id.toString();
        shapeSelect.addEventListener('change', (e) => {
            lfo.shape = e.target.value;
            lfo.phase = 0;
        });
    }

    if (activeToggle) {
        activeToggle.dataset.lfoId = lfo.id.toString();
        activeToggle.addEventListener('change', (e) => {
            lfo.active = e.target.checked;
            if (lfo.active) {
                lfo.lastUpdate = performance.now();
                lfo.phase = 0;
            }
        });
    }
}

function updateLFOTargetDisplay(lfo) {
    if (!lfo || !lfo.targets) return;
    
    const lfoTargetElement = document.querySelector(`.lfo-target[data-lfo-id="${lfo.id}"]`);
    if (!lfoTargetElement) return;

    // Create or update the target list
    let targetList = lfoTargetElement.querySelector('.target-list');
    if (!targetList) {
        targetList = document.createElement('div');
        targetList.className = 'target-list';
        lfoTargetElement.appendChild(targetList);
    }

    // Update target list content
    targetList.innerHTML = lfo.targets.map(target => {
        const elementId = target.element.id || 'unnamed';
        return `<div class="target-item">${elementId}</div>`;
    }).join('');
}

function updateLFO(now) {
    console.log('[DEBUG] LFO update started', { 
        lfoCount: lfos.length,
        timestamp: now 
    });

    lfos.forEach((lfo, index) => {
        if (!lfo) {
            console.log('[DEBUG] Skipping null LFO at index', index);
            return;
        }
        
        if (!lfo.active) {
            console.log('[DEBUG] Skipping inactive LFO', { id: lfo.id, index });
            return;
        }

        console.log('[DEBUG] Processing LFO', { 
            id: lfo.id, 
            index,
            rate: lfo.rate,
            depth: lfo.depth,
            shape: lfo.shape,
            targetCount: lfo.targets.length
        });

        const deltaTime = (now - lfo.lastUpdate) / 1000;
        lfo.phase = (lfo.phase + deltaTime * lfo.rate) % 1;
        
        let value;
        switch (lfo.shape) {
            case 'sine':
                value = Math.sin(lfo.phase * Math.PI * 2) * 0.5 + 0.5;
                break;
            case 'triangle':
                value = Math.abs(((lfo.phase * 4 + 3) % 4) - 2) / 2;
                break;
            case 'square':
                value = lfo.phase < 0.5 ? 1 : 0;
                break;
            case 'sawtooth':
                value = lfo.phase;
                break;
            case 'ramp':
                value = 1 - lfo.phase;
                break;
            case 'random':
                if (lfo.phase < lfo.lastPhase) {
                    lfo.lastRandomValue = lfo.currentRandomValue;
                    lfo.currentRandomValue = Math.random();
                }
                value = lfo.currentRandomValue;
                break;
        }
        lfo.lastPhase = lfo.phase;
        
        // Update all targets with the new value
        lfo.targets.forEach(target => {
            if (target && target.element) {
                const depth = lfo.depth / 100; // Convert depth percentage to 0-1 range
                let normalizedValue;
                
                if (target.type === 'select') {
                    // For dropdowns, cycle through options
                    const numOptions = target.element.options.length;
                    const scaledValue = value * depth * numOptions;
                    const optionIndex = Math.floor(scaledValue) % numOptions;
                    if (target.element.selectedIndex !== optionIndex) {
                        target.element.selectedIndex = optionIndex;
                        // Create a change event with a flag to prevent recursion
                        const changeEvent = new Event('change', { bubbles: true });
                        changeEvent.fromLFO = true;
                        target.element.dispatchEvent(changeEvent);
                    }
                    normalizedValue = optionIndex;
                } else {
                    // For sliders and other controls
                    const range = target.max - target.min;
                    const centerValue = target.originalValue;
                    const modAmount = range * depth;
                    
                    // Calculate modulation around center value
                    normalizedValue = centerValue + ((value - 0.5) * modAmount);
                    
                    // Clamp the value to the control's range
                    normalizedValue = Math.max(target.min, Math.min(target.max, normalizedValue));
                    
                    // Update the control value
                    target.element.value = normalizedValue;
                    
                    // Create an input event with a flag to prevent recursion
                    const inputEvent = new Event('input', { bubbles: true });
                    inputEvent.fromLFO = true;
                    target.element.dispatchEvent(inputEvent);
                }
                
                // Skip manualInputHandler for events from LFO
                if (target.manualInputHandler) {
                    target.manualInputHandler({ fromLFO: true, value: normalizedValue });
                }
            }
        });
        
        // Update waveform visualization
        if (lfo.waveformCanvas) {
            drawWaveform(lfo.waveformCanvas, lfo, lfo.phase);
        }
        
        lfo.lastUpdate = now;
    });
}

// Arpeggiator functionality
const arpeggiatorState = {
    seq1: {
        enabled: false,
        currentNotes: [],
        currentStep: 0,
        lastTriggerTime: 0,
        pattern: 'up',
        division: 4, // 16th notes
        octaveRange: 1,
        gateLength: 0.5, // 50% of interval
        velocity: 100
    },
    seq2: {
        enabled: false,
        currentNotes: [],
        currentStep: 0,
        lastTriggerTime: 0,
        pattern: 'up',
        division: 4,
        octaveRange: 1,
        gateLength: 0.5,
        velocity: 100
    }
};

// Add arpeggiator event listeners
document.getElementById('arp-toggle-1').addEventListener('change', (e) => {
    arpeggiatorState.seq1.enabled = e.target.checked;
    if (!e.target.checked) {
        // Stop any playing arpeggio notes
        if (midiEnabled && midiOutput && midiOutputEnabled) {
            const noteOffChannel = 0x80 | midiChannel1;
            arpeggiatorState.seq1.currentNotes.forEach(note => {
                midiOutput.send([noteOffChannel, note, 0]);
            });
        }
        arpeggiatorState.seq1.currentNotes = [];
    }
});

document.getElementById('arp-toggle-2').addEventListener('change', (e) => {
    arpeggiatorState.seq2.enabled = e.target.checked;
    if (!e.target.checked) {
        // Stop any playing arpeggio notes
        if (midiEnabled && midiOutput && midiOutputEnabled) {
            const noteOffChannel = 0x80 | midiChannel2;
            arpeggiatorState.seq2.currentNotes.forEach(note => {
                midiOutput.send([noteOffChannel, note, 0]);
            });
        }
        arpeggiatorState.seq2.currentNotes = [];
    }
});

// Helper function to get the next arpeggio note based on pattern
function getArpNote(state) {
    const notes = state.currentNotes;
    let index = state.currentStep;
    
    switch (state.pattern) {
        case 'up':
            return notes[index];
        case 'down':
            return notes[notes.length - 1 - index];
        case 'updown':
            const totalSteps = (notes.length * 2) - 2;
            const adjustedStep = state.currentStep % totalSteps;
            return notes[adjustedStep < notes.length ? adjustedStep : totalSteps - adjustedStep];
        case 'random':
            return notes[Math.floor(Math.random() * notes.length)];
        case 'insideout':
            // Start from middle, alternate outward
            const middle = Math.floor(notes.length / 2);
            const offset = Math.floor(index / 2);
            return index % 2 === 0 ? notes[middle + offset] : notes[middle - 1 - offset];
        case 'outsidein':
            // Start from ends, alternate inward
            const half = Math.floor(notes.length / 2);
            const step = Math.floor(index / 2);
            return index % 2 === 0 ? notes[step] : notes[notes.length - 1 - step];
        case 'pendulum':
            // Move back and forth between first and last notes
            const pos = index % (notes.length - 1);
            return notes[index % 2 === 0 ? pos : notes.length - 1 - pos];
        case 'spiral':
            // Spiral pattern: 1,4,2,3
            return notes[(index * 3) % notes.length];
        case 'zigzag':
            // Zigzag pattern: 1,3,2,4,3,5,4,6...
            const zigPos = Math.floor(index / 2);
            return index % 2 === 0 ? notes[zigPos] : notes[Math.min(zigPos + 2, notes.length - 1)];
        default:
            return notes[index];
    }
}

// Update the HTML for both arpeggiator sections
document.getElementById('arp-pattern-1').innerHTML = `
    <option value="up">Up</option>
    <option value="down">Down</option>
    <option value="updown">Up/Down</option>
    <option value="random">Random</option>
    <option value="insideout">Inside Out</option>
    <option value="outsidein">Outside In</option>
    <option value="pendulum">Pendulum</option>
    <option value="spiral">Spiral</option>
    <option value="zigzag">Zigzag</option>
`;

document.getElementById('arp-pattern-2').innerHTML = `
    <option value="up">Up</option>
    <option value="down">Down</option>
    <option value="updown">Up/Down</option>
    <option value="random">Random</option>
    <option value="insideout">Inside Out</option>
    <option value="outsidein">Outside In</option>
    <option value="pendulum">Pendulum</option>
    <option value="spiral">Spiral</option>
    <option value="zigzag">Zigzag</option>
`;

document.getElementById('arp-division-1').innerHTML = `
    <option value="1">1/1 (Whole)</option>
    <option value="2">1/2 (Half)</option>
    <option value="4">1/4 (Quarter)</option>
    <option value="8">1/8 (Eighth)</option>
    <option value="16">1/16 (Sixteenth)</option>
`;

document.getElementById('arp-division-2').innerHTML = `
    <option value="1">1/1 (Whole)</option>
    <option value="2">1/2 (Half)</option>
    <option value="4">1/4 (Quarter)</option>
    <option value="8">1/8 (Eighth)</option>
    <option value="16">1/16 (Sixteenth)</option>
`;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            // Initialize visualization first
            visualizationCanvas = document.getElementById('sequence-visualization');
            if (visualizationCanvas) {
                visualizationCanvas.width = 350;
                visualizationCanvas.height = 350;
                visualizationContext = visualizationCanvas.getContext('2d');
            } else {
                console.error('Visualization canvas element not found');
            }

            // Setup audio context first
            setupAudioContext();
            
            // Initialize Three.js scene
            init();
            
            // Generate initial sequences
            sequence = generateEuclideanRhythm(beats, totalSteps);
            sequence2 = generateEuclideanRhythm(beats2, totalSteps2);
            
            // Generate initial pitches
            generatePitches();
            generatePitches2();
            
            // Create spheres before setting up controls
            createSpheres();
            
            // Now setup controls after spheres are created
            setupControls();
            
            // Setup LFO controls
            setupLFOControls();
            
            // Initialize lastStepTime
            lastStepTime = performance.now();
            
            // Apply initial theme after everything is set up
            applyTheme('luminous');
            
            // Start animation loop
            animate();
            
            // Setup collapsible sections
            document.querySelectorAll('.section-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const icon = header.querySelector('.toggle-icon');
                    content.classList.toggle('open');
                    icon.textContent = content.classList.contains('open') ? '▼' : '▶';
                });
            });

            // Setup minimize buttons and other UI elements
            setupMinimizeButtons();

            // Initialize the Add Envelope button
            const addEnvelopeButton = document.querySelector('.add-envelope-button');
            if (addEnvelopeButton) {
                console.log('[ADSR] Setting up Add Envelope button');
                addEnvelopeButton.addEventListener('click', () => {
                    console.log('[ADSR] Add Envelope button clicked');
                    createNewEnvelope();
                });
            } else {
                console.warn('[ADSR] Add Envelope button not found');
            }

            setupSequenceVisualization();
            setupShapeControls(); // Add this line

            setupPopOutButton();
            
            // Setup event listeners for mouse interactions
            setupEventListeners();
            
            // Initialize MIDI
            initMIDI();

    } catch (error) {
        console.error('Error during initialization:', error);
        }
    }, 100);
});

// Helper function to setup minimize buttons
function setupMinimizeButtons() {
    debugLog('Controls', 'Setting up minimize buttons');
    
    // Setup minimize button for right panel
    const minimizeButton = document.querySelector('.pitch-controls .minimize-button');
    const pitchControls = document.querySelector('.pitch-controls');
    debugLog('Controls', 'Pitch controls found', { 
        minimizeButton: !!minimizeButton, 
        pitchControls: !!pitchControls 
    });
    
    if (minimizeButton && pitchControls) {
        minimizeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            debugLog('Controls', 'Pitch controls minimize button clicked');
            pitchControls.classList.toggle('minimized');
            minimizeButton.textContent = pitchControls.classList.contains('minimized') ? '+' : '−';
        });
        
        // Make sure the pitch controls are initially expanded
        pitchControls.classList.remove('minimized');
        minimizeButton.textContent = '−';
        debugLog('Controls', 'Pitch controls expanded');
    } else {
        debugLog('Controls', 'Pitch controls or minimize button not found');
    }
    
    // Setup minimize button for modulator panel
    const modulatorMinimizeButton = document.querySelector('.modulator-controls .minimize-button');
    const modulatorControls = document.querySelector('.modulator-controls');
    debugLog('Controls', 'Modulator controls found', { 
        modulatorMinimizeButton: !!modulatorMinimizeButton, 
        modulatorControls: !!modulatorControls 
    });
    
    if (modulatorMinimizeButton && modulatorControls) {
        modulatorMinimizeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            debugLog('Controls', 'Modulator controls minimize button clicked');
            modulatorControls.classList.toggle('minimized');
            modulatorMinimizeButton.textContent = modulatorControls.classList.contains('minimized') ? '+' : '−';
        });
        
        // Make sure the modulator controls are initially expanded
        modulatorControls.classList.remove('minimized');
        modulatorMinimizeButton.textContent = '−';
        debugLog('Controls', 'Modulator controls expanded');
    } else {
        debugLog('Controls', 'Modulator controls or minimize button not found');
    }
    
    // Setup minimize button for bottom panel
    const controlsHeader = document.querySelector('.controls-header');
    const controls = document.querySelector('.controls');
    const controlsToggle = document.querySelector('.controls-toggle');
    debugLog('Controls', 'Bottom controls found', { 
        controlsHeader: !!controlsHeader, 
        controls: !!controls, 
        controlsToggle: !!controlsToggle 
    });
    
    if (controlsHeader && controls && controlsToggle) {
        controlsHeader.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            debugLog('Controls', 'Bottom controls header clicked');
            controls.classList.toggle('minimized');
            controlsToggle.textContent = controls.classList.contains('minimized') ? '▲' : '▼';
        });
        
        // Make sure the controls are initially expanded
        controls.classList.remove('minimized');
        controlsToggle.textContent = '▼';
        debugLog('Controls', 'Bottom controls expanded');
    } else {
        debugLog('Controls', 'Bottom controls or header not found');
    }
    
    debugLog('Controls', 'Minimize buttons setup complete');
}

// Add these functions near the top with other utility functions
function createWaveformCanvas(isRightMenu = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 20;
    canvas.className = 'waveform-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.transform = 'translateY(-50%)';
    
    // Position the canvas based on menu location
    if (isRightMenu) {
        canvas.style.right = '-85px'; // Adjust position for right menu
    } else {
        canvas.style.left = '-85px'; // Adjust position for left menu
    }
    
    return canvas;
}

function createNewLFO() {
    debugLog('LFO', 'Creating new LFO');
    
    const lfoContainer = document.getElementById('lfo-container');
    debugLog('LFO', 'LFO container found', { container: !!lfoContainer });
    
    if (!lfoContainer) {
        debugLog('LFO', 'LFO container not found');
        return;
    }
    
    // Find the next available LFO number
    let newLfoId;
    if (deletedLfoIds.length > 0) {
        newLfoId = deletedLfoIds.shift();
    } else {
        newLfoId = lfos.filter(lfo => lfo !== null).length + 1;
    }
    
    let lfoIndex = lfos.indexOf(null);
    if (lfoIndex === -1) {
        lfoIndex = lfos.length;
    }
    
    debugLog('LFO', 'LFO ID and index calculated', { newLfoId, lfoIndex });
    
    const lfoColor = generateLFOColor(newLfoId);
    
    lfos[lfoIndex] = {
        rate: 1,
        depth: 50,
        shape: 'sine',
        active: true,
        phase: 0,
        targets: [],
        lastUpdate: performance.now(),
        currentRandomValue: 0,
        lastRandomValue: 0,
        id: newLfoId,
        color: lfoColor
    };
    
    debugLog('LFO', 'LFO object created', { lfoIndex, newLfoId, color: lfoColor });
    
    const newLFO = document.createElement('div');
    newLFO.className = 'modulator-section';
    newLFO.dataset.lfoIndex = lfoIndex;
    
    // Add initial glow styling
    newLFO.style.border = `1px solid ${lfoColor}4D`; // 30% opacity
    newLFO.style.boxShadow = `0 0 5px ${lfoColor}33`; // 20% opacity
    newLFO.style.transition = 'box-shadow 0.1s ease-in-out, border-color 0.1s ease-in-out';
    newLFO.style.borderRadius = '8px';
    newLFO.style.padding = '10px';
    newLFO.style.marginBottom = '10px';
    newLFO.style.background = 'rgba(0, 0, 0, 0.2)';
    
    newLFO.innerHTML = `
        <div class="modulator-header">
            <label>LFO ${newLfoId}</label>
            <button class="remove-lfo">×</button>
        </div>
        <div class="control-group">
            <label>Rate</label>
            <input type="range" id="lfo-rate-${newLfoId}" class="lfo-control" data-lfo-id="${newLfoId}" min="0.01" max="5" step="0.1" value="0.5">
            <span class="slider-value">1.0 Hz</span>
        </div>
        <div class="control-group">
            <label>Depth</label>
            <input type="range" id="lfo-depth-${newLfoId}" class="lfo-control" data-lfo-id="${newLfoId}" min="0" max="100" value="50">
            <span class="slider-value">50%</span>
        </div>
        <div class="control-group">
            <label>Shape</label>
            <select id="lfo-shape-${newLfoId}" class="lfo-control" data-lfo-id="${newLfoId}">
                <option value="sine">Sine</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="ramp">Ramp</option>
                <option value="random">Random</option>
            </select>
        </div>
        <div class="control-group">
            <label>Phase</label>
            <input type="range" id="lfo-phase-${newLfoId}" class="lfo-control" data-lfo-id="${newLfoId}" min="0" max="360" value="0">
            <span class="slider-value">0°</span>
        </div>
        <div class="control-group">
            <div class="toggle-switch">
                <label>Active</label>
                <input type="checkbox" id="lfo-active-${newLfoId}" class="lfo-control" data-lfo-id="${newLfoId}" checked>
            </div>
        </div>
        <div class="lfo-target" data-lfo-id="${newLfoId}">
            <label>Target: <span class="lfo-value">None</span></label>
        </div>
        <canvas class="waveform-canvas" data-lfo-id="${newLfoId}"></canvas>
    `;
    
    lfoContainer.appendChild(newLFO);
    debugLog('LFO', 'LFO element added to container');
    
    // Setup controls for this LFO
    setupLFOControlsForIndex(lfoIndex);
    debugLog('LFO', 'LFO controls setup complete');
    
    // Create waveform canvas
    const canvas = newLFO.querySelector('.waveform-canvas');
    if (canvas) {
        lfos[lfoIndex].waveformCanvas = canvas; // Ensure animation
        drawWaveform(canvas, lfos[lfoIndex], 0);
        debugLog('LFO', 'Waveform canvas created');
    }
    
    debugLog('LFO', 'New LFO creation complete', { lfoIndex, newLfoId });
}

// ... rest of the code ... 

// Legacy sequencer functions removed - now using unified Sequencer class
// The sequencers are now managed through sequencer1 and sequencer2 instances

// ... rest of existing code ... 

function generateLFOColor(lfoId) {
    // Use golden ratio for even color distribution
    const goldenRatio = 0.618033988749895;
    
    // Generate a hue value based on the LFO ID and golden ratio
    const hue = (lfoId * goldenRatio) % 1;
    
    // Convert HSL to RGB
    const h = hue;
    const s = 0.85;  // High saturation for vibrant colors
    const l = 0.6;   // Medium-high lightness for visibility
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    // Convert to hex
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
}// ... rest of existing code ... 

function drawEnvelope(canvas, attack, decay, sustain, release, color = null) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Get the envelope's color - handle both main envelope canvas and indicator canvases
    let envelopeColor;
    if (color) {
        // Use the passed color for indicator canvases
        envelopeColor = color;
    } else {
        // For main envelope canvas, get color from the envelope object
        const envelopeElement = canvas.closest('.modulator-section');
        if (envelopeElement) {
            const envelopeId = parseInt(envelopeElement.dataset.envelopeIndex);
            const envelope = window.envelopes[envelopeId];
            envelopeColor = envelope ? envelope.color : COLORS.highlight;
        } else {
            envelopeColor = COLORS.highlight;
        }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = `${COLORS.inactive}66`; // 40% opacity
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Calculate envelope points
    const totalTime = attack + decay + release;
    const attackX = (attack / totalTime) * width;
    const decayX = ((attack + decay) / totalTime) * width;
    const releaseStartX = ((attack + decay) / totalTime) * width;
    const sustainY = height - (sustain / 100) * height;
    
    // Draw envelope shape
    ctx.beginPath();
    ctx.strokeStyle = envelopeColor;
    ctx.lineWidth = 2;
    
    // Start at 0
    ctx.moveTo(0, height);
    
    // Attack phase (linear ramp up)
    ctx.lineTo(attackX, 0);
    
    // Decay phase (exponential curve down to sustain level)
    ctx.lineTo(decayX, sustainY);
    
    // Sustain phase (horizontal line)
    ctx.lineTo(releaseStartX, sustainY);
    
    // Release phase (exponential curve down)
    ctx.lineTo(width, height);
    
    // Stroke the path
    ctx.stroke();
}

function drawEnvelopeWithProgress(canvas, attack, decay, sustain, release, normalizedTime, currentValue, color = null) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Get the envelope's color - handle both main envelope canvas and indicator canvases
    let envelopeColor;
    if (color) {
        // Use the passed color for indicator canvases
        envelopeColor = color;
    } else {
        // For main envelope canvas, get color from the envelope object
        const envelopeElement = canvas.closest('.modulator-section');
        if (envelopeElement) {
            const envelopeId = parseInt(envelopeElement.dataset.envelopeIndex);
            const envelope = window.envelopes[envelopeId];
            envelopeColor = envelope ? envelope.color : COLORS.highlight;
        } else {
            envelopeColor = COLORS.highlight;
        }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = `${COLORS.inactive}66`; // 40% opacity
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Calculate envelope points
    const totalTime = attack + decay + release;
    const attackX = (attack / totalTime) * width;
    const decayX = ((attack + decay) / totalTime) * width;
    const releaseStartX = ((attack + decay) / totalTime) * width;
    const sustainY = height - (sustain / 100) * height;
    
    // Draw background envelope shape with reduced opacity
    ctx.beginPath();
    ctx.strokeStyle = envelopeColor.replace('rgb', 'rgba').replace(')', ', 0.4)');
    ctx.lineWidth = 2;
    
    // Draw full envelope shape
    ctx.moveTo(0, height);
    ctx.lineTo(attackX, 0);
    ctx.lineTo(decayX, sustainY);
    ctx.lineTo(releaseStartX, sustainY);
    ctx.lineTo(width, height);
    ctx.stroke();
    
    // Draw progress line
    if (normalizedTime !== undefined && currentValue !== undefined) {
        const progressX = normalizedTime * width;
        const progressY = height - (currentValue * height);
        
        ctx.beginPath();
        ctx.strokeStyle = envelopeColor;
        ctx.lineWidth = 2;
        
        // Draw the envelope up to the current progress
        ctx.moveTo(0, height);
        
        if (progressX <= attackX) {
            // In attack phase
            const progress = progressX / attackX;
            ctx.lineTo(progressX, progressY);
        } else if (progressX <= decayX) {
            // In decay phase
            ctx.lineTo(attackX, 0);
            ctx.lineTo(progressX, progressY);
        } else if (progressX <= releaseStartX) {
            // In sustain phase
            ctx.lineTo(attackX, 0);
            ctx.lineTo(decayX, sustainY);
            ctx.lineTo(progressX, sustainY);
        } else {
            // In release phase
            ctx.lineTo(attackX, 0);
            ctx.lineTo(decayX, sustainY);
            ctx.lineTo(releaseStartX, sustainY);
            ctx.lineTo(progressX, progressY);
        }
        
        ctx.stroke();
        
        // Draw progress point
        ctx.beginPath();
        ctx.fillStyle = envelopeColor;
        ctx.arc(progressX, progressY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateEnvelopeDisplay(envelopeId) {
    const canvas = document.querySelector(`#envelope-${envelopeId} .envelope-canvas`);
    if (!canvas) return;
    
    const attack = parseFloat(document.getElementById(`env-attack-${envelopeId}`).value);
    const decay = parseFloat(document.getElementById(`env-decay-${envelopeId}`).value);
    const sustain = parseFloat(document.getElementById(`env-sustain-${envelopeId}`).value);
    const release = parseFloat(document.getElementById(`env-release-${envelopeId}`).value);
    
    drawEnvelope(canvas, attack, decay, sustain, release);
}

// Add event listeners for envelope controls
document.querySelectorAll('.envelope-control').forEach(control => {
    control.addEventListener('input', () => {
        const envelopeId = control.id.split('-').pop();
        updateEnvelopeDisplay(envelopeId);
    });
});

// Initial draw of envelopes
document.querySelectorAll('.envelope-canvas').forEach(canvas => {
    const envelopeId = canvas.closest('.modulator-section').id.split('-').pop();
    updateEnvelopeDisplay(envelopeId);
});

function setupEnvelopeControls() {
    console.log('[ADSR] Starting envelope controls setup');
    
    // Make all sliders droppable targets
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        // Skip if already setup
        if (slider.hasDropHandler) return;

        slider.addEventListener('dragenter', (e) => {
            e.preventDefault();
            slider.classList.add('envelope-target-hover');
        });

        slider.addEventListener('dragleave', () => {
            slider.classList.remove('envelope-target-hover');
        });

        slider.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        slider.addEventListener('drop', handleModulatorDrop);
        slider.hasDropHandler = true;
    });
}

// Update handleEnvelopeConnection to accept envelopeId parameter
function handleEnvelopeConnection(element, envelopeId) {
    console.log('[ADSR] Handling new connection:', {
        elementId: element.id,
        elementType: element.type,
        envelopeId: envelopeId,
        currentConnections: window.envelopeTargets ? window.envelopeTargets.length : 0
    });

    // Remove any existing envelope connections for this target
    disconnectEnvelopeTarget(element);
    
    // Get the envelope's color
    const envelope = window.envelopes.find(e => e.id === envelopeId);
    const envelopeColor = envelope ? envelope.color : COLORS.highlight;
    
    // Create new target connection
    const target = {
        element: element,
        type: element.tagName.toLowerCase() === 'select' ? 'select' : 'slider',
        min: element.tagName.toLowerCase() === 'select' ? 0 : parseFloat(element.min),
        max: element.tagName.toLowerCase() === 'select' ? (element.options.length - 1) : parseFloat(element.max),
        originalValue: element.tagName.toLowerCase() === 'select' ? element.selectedIndex : parseFloat(element.value),
        envelopeId: envelopeId,
        color: envelopeColor // Store the color in the target object
    };
    
    // Add target to envelope targets array
    if (!window.envelopeTargets) {
        window.envelopeTargets = [];
    }
    window.envelopeTargets.push(target);
    
    // Add visual feedback
    const controlGroup = element.closest('.control-group');
    if (!controlGroup) {
        console.log('[ADSR] No control group found for element:', element.id);
        return;
    }

    // Set up container layout
    controlGroup.style.position = 'relative';
    const isRightMenu = controlGroup.closest('.pitch-controls');
    
    // Adjust margins to prevent overlap
    if (isRightMenu) {
        controlGroup.style.marginRight = '95px';
        controlGroup.style.paddingRight = '10px';
    } else {
        controlGroup.style.marginLeft = '95px';
        controlGroup.style.paddingLeft = '10px';
    }
    
    // Create envelope visualization canvas
    const envCanvas = document.createElement('canvas');
    envCanvas.classList.add('envelope-indicator');
    envCanvas.width = 50;
    envCanvas.height = 20;
    envCanvas.style.position = 'absolute';
    envCanvas.style.top = '50%';
    envCanvas.style.transform = 'translateY(-50%)';
    
    if (isRightMenu) {
        envCanvas.style.right = '-65px';
    } else {
        envCanvas.style.left = '-65px';
    }
    
    // Store the canvas reference in the target
    target.envCanvas = envCanvas;
    
    // Draw the initial envelope shape
    const attack = parseFloat(document.getElementById(`env-attack-${envelopeId}`).value);
    const decay = parseFloat(document.getElementById(`env-decay-${envelopeId}`).value);
    const sustain = parseFloat(document.getElementById(`env-sustain-${envelopeId}`).value);
    const release = parseFloat(document.getElementById(`env-release-${envelopeId}`).value);
    
    // Create disconnect button
    const disconnectButton = document.createElement('button');
    disconnectButton.innerHTML = '×';
    disconnectButton.className = 'envelope-disconnect-button';
    disconnectButton.onclick = () => disconnectEnvelopeTarget(element);
    
    // Add visual elements to control group
    controlGroup.appendChild(envCanvas);
    controlGroup.appendChild(disconnectButton);
    
    // Add glow effect to the target element
    element.style.boxShadow = `0 0 10px ${envelopeColor}80`;
    element.style.border = `1px solid ${envelopeColor}`;
    element.classList.add('envelope-connected');
    
    // Start animation loop for this target
    function animate() {
        if (!window.envelopeTargets.includes(target)) return;
        
        const now = performance.now();
        const state = window.envelopeStates?.[envelopeId];
        
        if (state) {
            const elapsed = now - state.startTime;
            const totalTime = attack + decay + release;
            const normalizedTime = Math.min(elapsed / totalTime, 1);
            
            drawEnvelopeWithProgress(
                envCanvas,
                attack,
                decay,
                sustain,
                release,
                normalizedTime,
                state.currentValue || 0,
                target.color // Pass the color to the drawing function
            );
        } else {
            drawEnvelope(envCanvas, attack, decay, sustain, release, target.color); // Pass the color to the drawing function
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();
    
    // Update main envelope display
    updateEnvelopeDisplay(envelopeId);
}

function disconnectEnvelopeTarget(element) {
    console.log('[ADSR] Attempting to disconnect target:', {
        elementId: element.id,
        currentConnections: window.envelopeTargets ? window.envelopeTargets.length : 0
    });

    if (!window.envelopeTargets) {
        console.log('[ADSR] No envelope targets array exists');
        return;
    }
    
    const targetIndex = window.envelopeTargets.findIndex(t => t && t.element === element);
    console.log('[ADSR] Found target index:', targetIndex);
    
    if (targetIndex !== -1) {
        const target = window.envelopeTargets[targetIndex];
        console.log('[ADSR] Found target to disconnect:', {
            targetIndex,
            elementId: target.element.id
        });
        
        // Clean up visual elements
        if (target.envCanvas) {
            target.envCanvas.remove();
            console.log('[ADSR] Removed envelope canvas');
        }
        
        // Find and remove the disconnect button
        const controlGroup = element.closest('.control-group');
        if (controlGroup) {
            const disconnectButton = controlGroup.querySelector('.envelope-disconnect-button');
            if (disconnectButton) {
                disconnectButton.remove();
                console.log('[ADSR] Removed disconnect button');
            }
            
            // Reset container layout
            controlGroup.style.position = '';
            controlGroup.style.marginRight = '';
            controlGroup.style.marginLeft = '';
            controlGroup.style.paddingRight = '';
            controlGroup.style.paddingLeft = '';
            console.log('[ADSR] Reset control group styles');
        }
        
        // Reset element styles completely
        element.style.cssText = '';
        element.style.removeProperty('box-shadow');
        element.style.removeProperty('border');
        element.style.removeProperty('background-color');
        element.style.removeProperty('transition');
        element.classList.remove('envelope-connected', 'envelope-target-hover');
        console.log('[ADSR] Reset target element styles');
        
        // Remove target from array
        window.envelopeTargets.splice(targetIndex, 1);
        console.log('[ADSR] Remaining connections:', window.envelopeTargets.length);
    }
}

// ... existing code ...

function startEnvelopeModulation(envelopeId) {
    if (!window.envelopeTargets || window.envelopeTargets.length === 0) {
        console.log('[ADSR] No targets connected');
        return;
    }

    // Get targets for this specific envelope
    const envelopeTargets = window.envelopeTargets.filter(t => t.envelopeId === envelopeId);
    if (envelopeTargets.length === 0) {
        console.log('[ADSR] No targets connected for envelope:', envelopeId);
        return;
    }

    const attack = parseFloat(document.getElementById(`env-attack-${envelopeId}`).value);
    const decay = parseFloat(document.getElementById(`env-decay-${envelopeId}`).value);
    const sustain = parseFloat(document.getElementById(`env-sustain-${envelopeId}`).value) / 100; // Convert to 0-1 range
    const release = parseFloat(document.getElementById(`env-release-${envelopeId}`).value);

    console.log('[ADSR] Starting envelope with:', { envelopeId, attack, decay, sustain, release });

    // Store the start time and original values
    if (!window.envelopeStates) {
        window.envelopeStates = {};
    }

    window.envelopeStates[envelopeId] = {
        startTime: performance.now(),
        phase: 'attack',
        targets: envelopeTargets.map(target => ({
            element: target.element,
            originalValue: parseFloat(target.element.value),
            min: parseFloat(target.element.min),
            max: parseFloat(target.element.max),
            envCanvas: target.envCanvas
        }))
    };

    // Start the modulation loop
    if (!window.envelopeAnimationFrames) {
        window.envelopeAnimationFrames = {};
    }
    if (!window.envelopeAnimationFrames[envelopeId]) {
        window.envelopeAnimationFrames[envelopeId] = requestAnimationFrame(now => updateEnvelopeModulation(now, envelopeId));
    }
}

function releaseEnvelopeModulation(envelopeId) {
    if (window.envelopeStates?.[envelopeId]) {
        console.log('[ADSR] Starting release phase for envelope:', envelopeId);
        window.envelopeStates[envelopeId].phase = 'release';
        window.envelopeStates[envelopeId].releaseStartTime = performance.now();
        window.envelopeStates[envelopeId].releaseStartValue = window.envelopeStates[envelopeId].currentValue;
    }
}

function updateEnvelopeModulation(now, envelopeId) {
    const envelopeState = window.envelopeStates?.[envelopeId];
    if (!envelopeState) return;

    const attack = parseFloat(document.getElementById(`env-attack-${envelopeId}`).value);
    const decay = parseFloat(document.getElementById(`env-decay-${envelopeId}`).value);
    const sustain = parseFloat(document.getElementById(`env-sustain-${envelopeId}`).value) / 100;
    const release = parseFloat(document.getElementById(`env-release-${envelopeId}`).value);

    const elapsed = now - envelopeState.startTime;
    let envelopeValue = 0;
    let normalizedTime = 0;

    // Calculate envelope value based on current phase
    switch (envelopeState.phase) {
        case 'attack':
            if (elapsed < attack) {
                envelopeValue = elapsed / attack;
                normalizedTime = elapsed / attack * 0.25;
            } else {
                envelopeState.phase = 'decay';
                envelopeState.decayStartTime = now;
                normalizedTime = 0.25;
            }
            break;

        case 'decay':
            const decayElapsed = now - envelopeState.decayStartTime;
            if (decayElapsed < decay) {
                envelopeValue = 1 - ((1 - sustain) * (decayElapsed / decay));
                normalizedTime = 0.25 + (decayElapsed / decay * 0.25);
            } else {
                envelopeValue = sustain;
                normalizedTime = 0.5;
            }
            break;

        case 'release':
            const releaseElapsed = now - envelopeState.releaseStartTime;
            if (releaseElapsed < release) {
                envelopeValue = envelopeState.releaseStartValue * (1 - (releaseElapsed / release));
                normalizedTime = 0.75 + (releaseElapsed / release * 0.25);
            } else {
                // End envelope modulation
                envelopeState.targets.forEach(target => {
                    target.element.value = target.originalValue;
                    target.element.dispatchEvent(new Event('input'));
                    // Reset envelope indicator
                    if (target.envCanvas) {
                        drawEnvelope(target.envCanvas, attack, decay, sustain, release);
                    }
                });
                delete window.envelopeStates[envelopeId];
                cancelAnimationFrame(window.envelopeAnimationFrames[envelopeId]);
                delete window.envelopeAnimationFrames[envelopeId];
                console.log('[ADSR] Envelope complete for:', envelopeId);
                return;
            }
            break;
    }

    envelopeState.currentValue = envelopeValue;

    // Apply envelope value to all targets and update their visualizations
    envelopeState.targets.forEach(target => {
        const range = target.max - target.min;
        const modulatedValue = target.originalValue + (range * envelopeValue);
        target.element.value = Math.min(target.max, Math.max(target.min, modulatedValue));
        target.element.dispatchEvent(new Event('input'));

        // Update envelope indicator
        if (target.envCanvas) {
            drawEnvelopeWithProgress(target.envCanvas, attack, decay, sustain, release, normalizedTime, envelopeValue);
        }
    });

    // Continue the animation loop
    window.envelopeAnimationFrames[envelopeId] = requestAnimationFrame(now => updateEnvelopeModulation(now, envelopeId));
}

function drawEnvelopeWithProgress(canvas, attack, decay, sustain, release, normalizedTime, currentValue) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear and draw background
    ctx.fillStyle = `#${COLORS.background.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines using theme's inactive color
    ctx.strokeStyle = `#${COLORS.inactive.toString(16).padStart(6, '0')}40`;
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for(let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * height/3);
        ctx.lineTo(width, i * height/3);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for(let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * width/3, 0);
        ctx.lineTo(i * width/3, height);
        ctx.stroke();
    }
    
    // Draw background envelope shape in dimmed highlight color
    ctx.strokeStyle = `#${COLORS.highlight.toString(16).padStart(6, '0')}40`;
    ctx.lineWidth = 1;
    
    // Calculate points for ADSR curve
    const attackX = width * 0.25;
    const decayX = width * 0.5;
    const releaseX = width * 0.75;
    const sustainY = height - (height * (sustain / 100));
    
    ctx.moveTo(0, height);
    ctx.lineTo(attackX, 0);
    ctx.lineTo(decayX, sustainY);
    ctx.lineTo(releaseX, sustainY);
    ctx.lineTo(width, height);
    
    ctx.stroke();
    
    // Draw progress
    ctx.strokeStyle = `#${COLORS.highlight.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const progressX = width * normalizedTime;
    const progressY = height - (height * currentValue);
    
    ctx.moveTo(0, height);
    if (progressX <= attackX) {
        // In attack phase
        ctx.lineTo(progressX, progressY);
    } else if (progressX <= decayX) {
        // In decay phase
        ctx.lineTo(attackX, 0);
        ctx.lineTo(progressX, progressY);
    } else if (progressX <= releaseX) {
        // In sustain phase
        ctx.lineTo(attackX, 0);
        ctx.lineTo(decayX, sustainY);
        ctx.lineTo(progressX, progressY);
    } else {
        // In release phase
        ctx.lineTo(attackX, 0);
        ctx.lineTo(decayX, sustainY);
        ctx.lineTo(releaseX, sustainY);
        ctx.lineTo(progressX, progressY);
    }
    
    ctx.stroke();
    
    // Draw progress point
    ctx.fillStyle = 'rgba(147, 51, 234, 1)';
    ctx.beginPath();
    ctx.arc(progressX, progressY, 3, 0, Math.PI * 2);
    ctx.fill();
}

// ... rest of the code ...

function createNewEnvelope() {
    const envelopeContainer = document.querySelector('#envelope-container');
    if (!envelopeContainer) {
        console.error('[ADSR] Could not find envelope container');
        return;
    }
    
    // Initialize envelopes array if it doesn't exist
    if (!window.envelopes) {
        window.envelopes = [];
    }
    
    // Get the next available ID
    const newEnvelopeId = window.envelopes.length + 1;
    console.log('[ADSR] Creating new envelope with ID:', newEnvelopeId);
    
    // Generate a unique color for this envelope
    const envelopeColor = generateEnvelopeColor(newEnvelopeId);
    
    // Create new envelope object
    const envelope = {
        id: newEnvelopeId,
        color: envelopeColor
    };
    window.envelopes.push(envelope);
    
    // Rest of the existing createNewEnvelope code...
    const newEnvelope = document.createElement('div');
    newEnvelope.className = 'modulator-section envelope';
    newEnvelope.id = `envelope-${newEnvelopeId}`;
    newEnvelope.dataset.envelopeIndex = (window.envelopes.length - 1).toString();
    
    newEnvelope.innerHTML = `
        <div class="modulator-header">
            <h3>ADSR Envelope ${newEnvelopeId}</h3>
            <button class="remove-envelope">×</button>
        </div>
        <canvas class="envelope-canvas" width="200" height="60"></canvas>
        <div class="control-group">
            <label>Attack</label>
            <input type="range" id="env-attack-${newEnvelopeId}" class="envelope-control" min="1" max="1000" value="100">
            <div class="lfo-value">100ms</div>
        </div>
        <div class="control-group">
            <label>Decay</label>
            <input type="range" id="env-decay-${newEnvelopeId}" class="envelope-control" min="1" max="1000" value="100">
            <div class="lfo-value">100ms</div>
        </div>
        <div class="control-group">
            <label>Sustain</label>
            <input type="range" id="env-sustain-${newEnvelopeId}" class="envelope-control" min="0" max="100" value="50">
            <div class="lfo-value">50%</div>
        </div>
        <div class="control-group">
            <label>Release</label>
            <input type="range" id="env-release-${newEnvelopeId}" class="envelope-control" min="1" max="1000" value="100">
            <div class="lfo-value">100ms</div>
        </div>
        <div class="control-group">
            <button class="trigger-button">Trigger</button>
        </div>
        <div id="env-target-${newEnvelopeId}" class="envelope-target" draggable="true" data-envelope-id="${newEnvelopeId}">
            Drag to target
        </div>
    `;
    
    envelopeContainer.appendChild(newEnvelope);
    
    // Set up remove button event listener
    const removeButton = newEnvelope.querySelector('.remove-envelope');
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            const envelopeIndex = parseInt(newEnvelope.dataset.envelopeIndex);
            if (!isNaN(envelopeIndex)) {
                removeEnvelope(envelopeIndex);
            }
        });
    }
    
    // Initialize controls
    setupEnvelopeControlsForIndex(window.envelopes.length - 1);
    updateEnvelopeDisplay(newEnvelopeId);
    
    // Reinitialize drop targets to include new envelope controls
    reinitializeDropTargets();
    
    return newEnvelopeId;
}

function generateEnvelopeColor(envelopeId) {
    // Use golden ratio for even color distribution
    const goldenRatio = 0.618033988749895;
    const hue = (envelopeId * goldenRatio) % 1;
    
    // Convert HSL to RGB with high saturation and medium-high lightness
    const h = hue;
    const s = 0.85;
    const l = 0.6;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

// Update envelope target display to reflect color
function updateEnvelopeTargetDisplay(envelope) {
    const targetElement = document.querySelector(`#env-target-${envelope.id}`);
    if (targetElement) {
        targetElement.style.background = envelope.color;
    }
}

function removeEnvelope(envelopeIndex) {
    const envelope = window.envelopes[envelopeIndex];
    if (!envelope) return;
    
    // Remove any active connections for this envelope
    if (window.envelopeTargets) {
        const targetsToRemove = window.envelopeTargets.filter(t => t && t.envelopeId === envelope.id);
        targetsToRemove.forEach(target => {
            if (target.element) {
                disconnectEnvelopeTarget(target.element);
            }
        });
        window.envelopeTargets = window.envelopeTargets.filter(t => t && t.envelopeId !== envelope.id);
    }
    
    // Remove the envelope element
    const envelopeElement = document.querySelector(`#envelope-${envelope.id}`);
    if (envelopeElement) {
        envelopeElement.remove();
    }
    
    // Remove from envelopes array
    window.envelopes.splice(envelopeIndex, 1);
    
    // Update remaining envelope indices and IDs
    window.envelopes.forEach((env, idx) => {
        env.id = idx + 1;
        const el = document.querySelector(`.modulator-section.envelope[data-envelope-index="${idx}"]`);
        if (el) {
            el.id = `envelope-${env.id}`;
            el.dataset.envelopeIndex = idx.toString();
            
            // Update header text
            const header = el.querySelector('h3');
            if (header) header.textContent = `ADSR Envelope ${env.id}`;
            
            // Update control IDs
            el.querySelectorAll('[id*="env-"]').forEach(control => {
                control.id = control.id.replace(/env-.*-\d+/, `env-$1-${env.id}`);
            });
            
            // Update target IDs and data attributes
            const target = el.querySelector('.envelope-target');
            if (target) {
                target.id = `env-target-${env.id}`;
                target.dataset.envelopeId = env.id.toString();
            }
        }
    });
    
    // Update any existing targets to match new IDs
    if (window.envelopeTargets) {
        window.envelopeTargets.forEach(target => {
            const env = window.envelopes.find(e => e.id === target.envelopeId);
            if (env) {
                target.envelopeId = env.id;
            }
        });
    }
}

// ... rest of the code ...

// Add unified drop handler function
function handleModulatorDrop(e, slider) {
    e.preventDefault();
    const dropTarget = slider || e.currentTarget;
    dropTarget.classList.remove('slider-target');
    dropTarget.classList.remove('envelope-target-hover');
    
    // Disconnect any existing connections before making new ones
    disconnectLFOTarget(dropTarget);
    disconnectEnvelopeTarget(dropTarget);
    
    const id = e.dataTransfer.getData('text/plain');
    const modulatorType = e.dataTransfer.getData('application/modulator-type') || 'unknown';
    console.log('[Drop] Processing drop with ID:', id, 'Type:', modulatorType);
    
    if (!id) {
        console.log('[Drop] No data found in drop event');
        return;
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        console.log('[Drop] Invalid ID format:', id);
        return;
    }

    // Check modulator type explicitly
    if (modulatorType === 'lfo') {
        console.log('[LFO] Drop event:', { lfoId: parsedId, sliderId: dropTarget.id });
        handleLFODrop(dropTarget, parsedId);
    } else if (modulatorType === 'envelope') {
        console.log('[ADSR] Drop event:', { envelopeId: parsedId, sliderId: dropTarget.id });
        handleEnvelopeConnection(dropTarget, parsedId);
    } else {
        // Fallback to checking both types (for backward compatibility)
    const lfo = lfos.find(l => l && l.id === parsedId);
    if (lfo) {
        handleLFODrop(dropTarget, parsedId);
        return;
    }

    const envelope = window.envelopes.find(e => e && e.id === parsedId);
    if (envelope) {
        handleEnvelopeConnection(dropTarget, parsedId);
        return;
    }

    console.log('[Drop] No matching LFO or envelope found for ID:', parsedId);
    }
}

// Update all drop event listeners to use the unified handler directly
slider.addEventListener('drop', handleModulatorDrop);

function setupEnvelopeControlsForIndex(envelopeIndex) {
    const envelope = window.envelopes[envelopeIndex];
    const envelopeElement = document.querySelector(`.modulator-section[data-envelope-index="${envelopeIndex}"]`);
    if (!envelopeElement || !envelope) return;
    
    // Make all controls droppable
    envelopeElement.querySelectorAll('.envelope-control').forEach(control => {
        // Make sure it's a drop target
        if (!control.hasDropHandler) {
            debugLog('ADSR', 'Setting up drop target for envelope control:', control.id);
            
            control.addEventListener('dragenter', (e) => {
                e.preventDefault();
                control.classList.add('envelope-target-hover');
            });
            
            control.addEventListener('dragleave', () => {
                control.classList.remove('envelope-target-hover');
            });
            
            control.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            control.addEventListener('drop', (e) => {
                debugLog('ADSR', 'Drop event on envelope control:', control.id);
                handleModulatorDrop(e, control);
            });
            
            control.hasDropHandler = true;
        }
    });
}

function drawSequenceVisualization() {
    if (!visualizationContext) return;

    // Clear the canvas
    visualizationContext.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height);

    const centerX = visualizationCanvas.width / 2;
    const centerY = visualizationCanvas.height / 2;
    
    // Draw Sequencer 1 (outer circle)
    const outerRadius = 140;  // Adjusted for larger size
    const innerRadius = 90;   // Adjusted for larger size
    const stepWidth = 35;     // Adjusted for larger size
    
    // Convert hex colors to rgba
    const playheadColorHex = `#${COLORS.playhead.toString(16).padStart(6, '0')}`;
    const activeColorHex = `#${COLORS.active.toString(16).padStart(6, '0')}`;
    const inactiveColorHex = `#${COLORS.inactive.toString(16).padStart(6, '0')}`;
    const strokeColorHex = `#${COLORS.highlight.toString(16).padStart(6, '0')}`;
    
    // Draw steps for Sequencer 1
    const stepCount1 = sequence.length;
    for (let i = 0; i < stepCount1; i++) {
        const angle = (i / stepCount1) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((i + 1) / stepCount1) * Math.PI * 2 - Math.PI / 2;
        
        // Draw step arc
        visualizationContext.beginPath();
        visualizationContext.arc(centerX, centerY, outerRadius, angle, nextAngle);
        visualizationContext.arc(centerX, centerY, outerRadius - stepWidth, nextAngle, angle, true);
        visualizationContext.closePath();
        
        // Set fill color based on step state
        if (i === currentStep) {
            visualizationContext.fillStyle = playheadColorHex;
        } else if (sequence[i]) {
            visualizationContext.fillStyle = `${activeColorHex}4D`;  // 30% opacity
        } else {
            visualizationContext.fillStyle = `${inactiveColorHex}4D`;  // 30% opacity
        }
        
        // Add stroke
        visualizationContext.strokeStyle = strokeColorHex;
        visualizationContext.lineWidth = 1;
        
        visualizationContext.fill();
        visualizationContext.stroke();
    }
    
    // Draw steps for Sequencer 2 (inner circle)
    const stepCount2 = sequence2.length;
    for (let i = 0; i < stepCount2; i++) {
        const angle = (i / stepCount2) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((i + 1) / stepCount2) * Math.PI * 2 - Math.PI / 2;
        
        // Draw step arc
        visualizationContext.beginPath();
        visualizationContext.arc(centerX, centerY, innerRadius, angle, nextAngle);
        visualizationContext.arc(centerX, centerY, innerRadius - stepWidth, nextAngle, angle, true);
        visualizationContext.closePath();
        
        // Set fill color based on step state
        if (i === currentStep2) {
            visualizationContext.fillStyle = playheadColorHex;
        } else if (sequence2[i]) {
            visualizationContext.fillStyle = `${activeColorHex}4D`;  // 30% opacity
        } else {
            visualizationContext.fillStyle = `${inactiveColorHex}4D`;  // 30% opacity
        }
        
        // Add stroke
        visualizationContext.strokeStyle = strokeColorHex;
        visualizationContext.lineWidth = 1;
        
        visualizationContext.fill();
        visualizationContext.stroke();
    }
}

// ... rest of existing code ...

function handleSequenceVisualizationClick(event) {
    const rect = visualizationCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to canvas coordinates
    const centerX = visualizationCanvas.width / 2;
    const centerY = visualizationCanvas.height / 2;
    const clickX = x - centerX;
    const clickY = y - centerY;
    
    // Calculate distance from center and angle
    const distance = Math.sqrt(clickX * clickX + clickY * clickY);
    let angle = Math.atan2(clickY, clickX) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    
    const outerRadius = 140;
    const innerRadius = 90;
    const stepWidth = 35;
    
    let updated = false;
    
    // Check if click is in outer circle (Sequencer 1)
    if (distance >= outerRadius - stepWidth && distance <= outerRadius) {
        const stepCount = sequence.length;
        const stepIndex = Math.floor((angle / (Math.PI * 2)) * stepCount);
        sequence[stepIndex] = sequence[stepIndex] === 1 ? 0 : 1;
        console.log(`Toggled Sequencer 1 step ${stepIndex} to ${sequence[stepIndex]}`);
        updated = true;
    }
    // Check if click is in inner circle (Sequencer 2)
    else if (distance >= innerRadius - stepWidth && distance <= innerRadius) {
        const stepCount = sequence2.length;
        const stepIndex = Math.floor((angle / (Math.PI * 2)) * stepCount);
        sequence2[stepIndex] = sequence2[stepIndex] === 1 ? 0 : 1;
        console.log(`Toggled Sequencer 2 step ${stepIndex} to ${sequence2[stepIndex]}`);
        updated = true;
    }
    
    if (updated) {
        // Update both the visualization and 3D cylinders
    drawSequenceVisualization();
        updateSphereColors();
    }
}

function setupSequenceVisualization() {
    visualizationCanvas = document.getElementById('sequence-visualization');
    if (!visualizationCanvas) return;
    
    visualizationContext = visualizationCanvas.getContext('2d');
    
    // Add click event listener
    visualizationCanvas.addEventListener('click', handleSequenceVisualizationClick);
    
    // Initial draw
    drawSequenceVisualization();
}

function setupPopOutButton() {
    const popOutBtn = document.createElement('button');
    popOutBtn.textContent = 'Pop Out View';
    popOutBtn.className = 'pop-out-button';
    popOutBtn.style.position = 'fixed';
    popOutBtn.style.top = '10px';
    popOutBtn.style.left = '10px';
    popOutBtn.style.zIndex = '1000';
    
    popOutBtn.addEventListener('click', () => {
        if (popOutWindow && !popOutWindow.closed) {
            popOutWindow.close();
            popOutWindow = null;
            popOutRenderer = null;
            popOutCamera = null;
            return;
        }
        
        const width = 800;
        const height = 600;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        popOutWindow = window.open('', 'Sequencer View', 
            `width=${width},height=${height},left=${left},top=${top}`);
        
        if (popOutWindow) {
            // Set up the pop-out window
            popOutWindow.document.write(`
                <html>
                <head>
                    <title>Sequencer View</title>
                    <style>
                        body { margin: 0; overflow: hidden; background: #000; }
                        canvas { width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <div id="canvas-container"></div>
                </body>
                </html>
            `);
            
            // Set up everything immediately (Three.js is available from main window)
            // Create new renderer for pop-out window
            popOutRenderer = new THREE.WebGLRenderer({ antialias: true });
            popOutRenderer.setSize(width, height);
            popOutRenderer.setClearColor(COLORS.background);
            popOutWindow.document.getElementById('canvas-container').appendChild(popOutRenderer.domElement);
            
            // Create new camera for pop-out window
            popOutCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            popOutCamera.position.copy(camera.position);
            popOutCamera.lookAt(0, 0, 0);
            
            // Create OrbitControls for pop-out window (disabled for pure following)
            const popOutControls = new THREE.OrbitControls(popOutCamera, popOutRenderer.domElement);
            popOutControls.enableDamping = false; // Disable damping to prevent conflicts
            popOutControls.enableZoom = false; // Disable zoom in pop-out
            popOutControls.enablePan = false; // Disable pan in pop-out
            popOutControls.enableRotate = false; // Disable rotate in pop-out
            popOutControls.target.set(0, 0, 0);
            
            // Store controls reference for updates
            popOutRenderer.domElement.__controls = popOutControls;
            
            // Force an initial render
            popOutRenderer.render(scene, popOutCamera);
            
            // Handle window resize
            popOutWindow.addEventListener('resize', () => {
                const newWidth = popOutWindow.innerWidth;
                const newHeight = popOutWindow.innerHeight;
                popOutCamera.aspect = newWidth / newHeight;
                popOutCamera.updateProjectionMatrix();
                popOutRenderer.setSize(newWidth, newHeight);
            });
            
            // Handle window close
            popOutWindow.addEventListener('unload', () => {
                popOutWindow = null;
                popOutRenderer = null;
                popOutCamera = null;
            });
        }
    });
    
    document.body.appendChild(popOutBtn);
}

// ... rest of existing code ...

function setupShapeControls() {
    const shapeSelect = document.getElementById('shape-select');
    if (!shapeSelect) {
        console.error('Shape select element not found');
        return;
    }

    shapeSelect.addEventListener('change', (e) => {
        const newShapeType = e.target.value;
        
        // Only recreate shapes if the shape type actually changed
        if (newShapeType !== currentShapeType) {
            currentShapeType = newShapeType;
        
        // Clear existing shapes
        spheres.forEach(shape => scene.remove(shape));
        spheres2.forEach(shape => scene.remove(shape));
        spheres = [];
        spheres2 = [];
        
        // Recreate shapes with new type
        createSpheres();
        
        // Update additional sequencers if they exist
        additionalSequencers.forEach(sequencer => {
            if (sequencer instanceof Sequencer) {
                sequencer.visualEngine.createSpheres();
            }
        });
        }
    });
}


function createAdditionalSequencer() {
    debugLog('Sequencer', 'Creating additional sequencer');
    
    const sequencerId = additionalSequencers.length + 3; // Start numbering after sequencer 1 and 2
    const baseRadius = 8; // Starting radius for the first additional sequencer
    const radiusIncrement = 2; // How much to increase the radius for each new sequencer
    const radius = baseRadius + (additionalSequencers.length * radiusIncrement); // Increase radius for each new sequencer
    
    // Create platform if it doesn't exist or update its size
    const platformRadius = radius + 1; // Make platform slightly larger than the outermost sequencer
    const existingPlatform = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry);
    if (existingPlatform) {
        console.log(`[PLATFORM_DEBUG] Updating platform for sequencer ${sequencerId}`, {
            platformRadius: platformRadius,
            existingMaterial: !!existingPlatform.material,
            materialType: existingPlatform.material ? existingPlatform.material.type : 'none'
        });
        
        // Remove the old platform and create a new one with the updated material
        scene.remove(existingPlatform);
        existingPlatform.geometry.dispose();
        if (existingPlatform.material) {
            existingPlatform.material.dispose();
        }
        
        // Create new platform with updated material
        const newPlatformGeometry = new THREE.CylinderGeometry(platformRadius, platformRadius + 0.5, 0.2, 64);
        const newPlatformMaterial = createGlossyMaterial(0x2a2a3e, 0.8); // Use the new material
        const newPlatform = new THREE.Mesh(newPlatformGeometry, newPlatformMaterial);
        newPlatform.position.y = -0.1;
        scene.add(newPlatform);
        
        console.log(`[PLATFORM_DEBUG] Platform recreated with new material`, {
            newRadius: platformRadius,
            materialCreated: !!newPlatformMaterial,
            materialType: newPlatformMaterial ? newPlatformMaterial.type : 'none'
        });
    }
    
    debugLog('Sequencer', `Creating sequencer ${sequencerId} at radius ${radius}`);
    
    // Position additional sequencers in concentric circles (like the original sequencers)
    // Original sequencer 1 is at radius 4, sequencer 2 is at radius 6
    // Additional sequencers will be at radius 8, 10, 12, etc.
    const centerX = 0; // Keep at center like original sequencers
    const centerZ = 0; // Keep at center like original sequencers
    
    // Create new Sequencer instance
    const assignedChannel = (additionalSequencers.length + 2) % 16;
    console.log('[MIDI_CHANNEL_DEBUG] Creating additional sequencer:', {
        sequencerId: sequencerId,
        assignedChannel: assignedChannel,
        assignedChannelDisplay: assignedChannel + 1, // Show 1-indexed channel number
        additionalSequencersLength: additionalSequencers.length
    });
    
    const sequencer = new Sequencer(sequencerId, radius, {
        beats: 16,
        steps: 16,
        velocity: 100,
        probability: 100,
        mode: 'forward',
        bpm: bpm,
        rootNote: rootNote,
        scaleType: scaleType,
        octaveRange: octaveRange,
        centerX: centerX,
        centerZ: centerZ,
        midiChannel: assignedChannel // Start from channel 2 (0-based: 2, 3, 4, etc.) to avoid conflict with sequencer 1 (channel 0) and sequencer 2 (channel 1)
    });
    
    // Start the sequencer automatically
    sequencer.isPlaying = true;
    
    debugLog('Sequencer', `Created sequencer ${sequencerId} with MIDI channel ${sequencer.midiChannel}`, {
        sequencerId: sequencerId,
        midiChannel: sequencer.midiChannel,
        radius: radius,
        totalAdditionalSequencers: additionalSequencers.length + 1
    });
    
    // Create sequencer controls
    const controlsContainer = document.querySelector('.controls');
    if (!controlsContainer) {
        console.error('Controls container not found');
        return;
    }
    
    // Create a new sequencer group container
    const sequencerGroup = document.createElement('div');
    sequencerGroup.className = 'sequencer-group';
    
    // Add a header to separate sequencers
    const header = document.createElement('div');
    header.className = 'sequencer-header';
    header.innerHTML = `<h3>Sequencer ${sequencerId}</h3>`;
    sequencerGroup.appendChild(header);
    
    // Add the controls
    sequencerGroup.innerHTML += `
        <div class="control-group">
            <button id="play-pause-button-${sequencerId}" class="play-pause-button">Stop</button>
        </div>
        <div class="control-group">
            <label>Velocity</label>
            <input type="range" id="velocity-slider-${sequencerId}" min="0" max="127" value="100">
            <span id="velocity-value-${sequencerId}" class="slider-value">100</span>
        </div>
        <div class="control-group">
            <label>Probability</label>
            <input type="range" id="probability-slider-${sequencerId}" min="0" max="100" value="100">
            <span id="probability-value-${sequencerId}" class="slider-value">100</span>
        </div>
        <div class="control-group">
            <label>Mode</label>
            <select id="sequence-mode-${sequencerId}">
                <option value="forward">Forward</option>
                <option value="backward">Backward</option>
                <option value="pingpong">Ping Pong</option>
                <option value="random">Random</option>
                <option value="brownian">Brownian</option>
            </select>
        </div>
        <div class="control-group">
            <label>Beats</label>
            <input type="range" id="beats-slider-${sequencerId}" min="0" max="32" value="16">
            <span id="beats-value-${sequencerId}" class="slider-value">16</span>
        </div>
        <div class="control-group">
            <label>Steps</label>
            <input type="range" id="steps-slider-${sequencerId}" min="0" max="32" value="16">
            <span id="steps-value-${sequencerId}" class="slider-value">16</span>
        </div>
        <div class="control-group">
            <label>MIDI Channel</label>
            <select id="midi-channel-${sequencerId}">
                <option value="0">Ch 1</option>
                <option value="1">Ch 2</option>
                <option value="2">Ch 3</option>
                <option value="3">Ch 4</option>
                <option value="4">Ch 5</option>
                <option value="5">Ch 6</option>
                <option value="6">Ch 7</option>
                <option value="7">Ch 8</option>
                <option value="8">Ch 9</option>
                <option value="9">Ch 10</option>
                <option value="10">Ch 11</option>
                <option value="11">Ch 12</option>
                <option value="12">Ch 13</option>
                <option value="13">Ch 14</option>
                <option value="14">Ch 15</option>
                <option value="15">Ch 16</option>
            </select>
        </div>
    `;
    
    // Append the new sequencer group to the controls container
    controlsContainer.appendChild(sequencerGroup);
    debugLog('Sequencer', 'Added controls to DOM');
    
    // Add event listeners for controls
    const playPauseBtn = document.getElementById(`play-pause-button-${sequencerId}`);
    if (playPauseBtn) {
        debugLog('Controls', `Setting up play/pause button for sequencer ${sequencerId}`);
        playPauseBtn.addEventListener('click', () => {
            const isPlaying = sequencer.togglePlayback();
            playPauseBtn.textContent = isPlaying ? 'Stop' : 'Play';
            debugLog('Controls', `Toggled playback for sequencer ${sequencerId}`, { 
                isPlaying: isPlaying,
                currentStep: sequencer.currentStep
            });
        });
    } else {
        console.error(`Play/pause button not found for sequencer ${sequencerId}`);
    }
    
    // Add velocity control
    const velocitySlider = document.getElementById(`velocity-slider-${sequencerId}`);
    const velocityValue = document.getElementById(`velocity-value-${sequencerId}`);
    if (velocitySlider && velocityValue) {
        velocitySlider.addEventListener('input', (e) => {
            sequencer.setVelocity(parseInt(e.target.value));
            velocityValue.textContent = e.target.value;
            debugLog('Controls', `Updated velocity for sequencer ${sequencerId}`, { velocity: sequencer.velocity });
        });
    }
    
    // Add probability control
    const probabilitySlider = document.getElementById(`probability-slider-${sequencerId}`);
    const probabilityValue = document.getElementById(`probability-value-${sequencerId}`);
    if (probabilitySlider && probabilityValue) {
        probabilitySlider.addEventListener('input', (e) => {
            sequencer.setProbability(parseInt(e.target.value));
            probabilityValue.textContent = e.target.value;
            debugLog('Controls', `Updated probability for sequencer ${sequencerId}`, { probability: sequencer.probability });
        });
    }
    
    // Add mode control
    const modeSelect = document.getElementById(`sequence-mode-${sequencerId}`);
    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            sequencer.setMode(e.target.value);
            debugLog('Controls', `Updated mode for sequencer ${sequencerId}`, { mode: sequencer.mode });
        });
    }
    
    // Add beats control
    const beatsSlider = document.getElementById(`beats-slider-${sequencerId}`);
    const beatsValue = document.getElementById(`beats-value-${sequencerId}`);
    if (beatsSlider && beatsValue) {
        beatsSlider.addEventListener('input', (e) => {
            sequencer.setBeats(parseInt(e.target.value));
            beatsValue.textContent = e.target.value;
            debugLog('Controls', `Updated beats for sequencer ${sequencerId}`, { 
                beats: sequencer.beats,
                sequence: sequencer.sequence 
            });
        });
    }
    
    // Add steps control
    const stepsSlider = document.getElementById(`steps-slider-${sequencerId}`);
    const stepsValue = document.getElementById(`steps-value-${sequencerId}`);
    if (stepsSlider && stepsValue) {
        stepsSlider.addEventListener('input', (e) => {
            sequencer.setSteps(parseInt(e.target.value));
            stepsValue.textContent = e.target.value;
            debugLog('Controls', `Updated steps for sequencer ${sequencerId}`, {
                steps: sequencer.steps,
                sequence: sequencer.sequence
            });
        });
    }
    
    // Add MIDI channel control
    const midiChannelSelect = document.getElementById(`midi-channel-${sequencerId}`);
    if (midiChannelSelect) {
        // Set the default selected channel based on the sequencer's assigned channel
        midiChannelSelect.value = sequencer.midiChannel;
        midiChannelSelect.addEventListener('change', (e) => {
            sequencer.midiChannel = parseInt(e.target.value);
            debugLog('Controls', `Updated MIDI channel for sequencer ${sequencerId}`, { 
                midiChannel: sequencer.midiChannel 
            });
        });
    }
    
    additionalSequencers.push(sequencer);
    debugLog('Sequencer', `Added sequencer ${sequencerId} to additionalSequencers array`, { 
        totalSequencers: additionalSequencers.length 
    });
}

function generatePitches(numSteps, rootNote, scaleType, octaveRange) {
    const scales = {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
        pentatonic: [0, 2, 4, 7, 9],
        blues: [0, 3, 5, 6, 7, 10],
        chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    };
    
    const scale = scales[scaleType] || scales.minor;
    const pitches = [];
    
    for (let i = 0; i < numSteps; i++) {
        const octave = Math.floor(Math.random() * octaveRange);
        const scalePosition = Math.floor(Math.random() * scale.length);
        const pitch = rootNote + scale[scalePosition] + (octave * 12);
        pitches.push(pitch);
    }
    
    return pitches;
}

function generateEuclideanRhythm(beats, steps) {
    if (beats > steps) beats = steps;
    if (beats === 0) return new Array(steps).fill(0);
    if (beats === steps) return new Array(steps).fill(1);

    let pattern = [];
    let counts = [];
    let remainders = [];
    let divisor = steps - beats;
    remainders.push(beats);
    let level = 0;

    while (true) {
        counts.push(Math.floor(divisor / remainders[level]));
        let newRemainder = divisor % remainders[level];
        remainders.push(newRemainder);
        level++;
        if (remainders[level] <= 1) {
            break;
        }
        divisor = remainders[level - 1];
    }
    counts.push(divisor);

    function build(level) {
        if (level === -1) {
            pattern.push(0);
        } else if (level === -2) {
            pattern.push(1);
            } else {
            for (let i = 0; i < counts[level]; i++) {
                build(level - 1);
            }
            if (remainders[level] !== 0) {
                build(level - 2);
    }
        }
    }
    build(level);
    return pattern.reverse();
}

// ... rest of existing code ...

function setupAddSequencerButton() {
    const addBtn = document.querySelector('.add-sequencer-button');
    if (addBtn) {
        addBtn.addEventListener('click', createAdditionalSequencer);
    } else {
        console.error('Add sequencer button not found');
    }
}

// Update the init function to call setupAddSequencerButton
const originalInit = init;
init = function() {
    initAudioContext();
    originalInit();
    setupAddSequencerButton();
}

// ... rest of existing code ...

// Initialize audio context
function initAudioContext() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            debugLog('Audio', 'Audio context initialized:', {
                state: audioContext.state,
                sampleRate: audioContext.sampleRate
            });
        }

        // Create a button to start audio context
        const startAudioButton = document.createElement('button');
        startAudioButton.textContent = 'Start Audio';
        startAudioButton.className = 'start-audio-button';
        startAudioButton.style.position = 'fixed';
        startAudioButton.style.top = '10px';
        startAudioButton.style.right = '10px';
        startAudioButton.style.zIndex = '1000';
        
        startAudioButton.addEventListener('click', async () => {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
                debugLog('Audio', 'Audio context resumed');
                startAudioButton.style.display = 'none';
            }
        });
        
        document.body.appendChild(startAudioButton);
        
        // Setup audio nodes
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        oscillator.start();
        
        audioStarted = true;
        debugLog('Audio', 'Audio nodes initialized');
        
    } catch (error) {
        console.error('Error initializing audio context:', error);
    }
}

// Update init function to handle audio context properly
function init() {
    debugLog('Init', 'Starting initialization...');
    
    // Add test logs to ensure we have logs to export
    console.log('Test log from init function - should be captured');
    console.error('Test error from init function - should be captured');
    console.warn('Test warning from init function - should be captured');
    debugLog('Init', 'Test debug log from init function');
    
    // Initialize timing variables
    lastStepTime = performance.now() / 1000;
    currentStep = 0;
    currentStep2 = 0;
    debugLog('Init', 'Timing variables initialized', { lastStepTime, currentStep, currentStep2 });
    
    // Initialize play states
    isPlaying1 = true;
    isPlaying2 = true;
    debugLog('Init', 'Play states initialized', { isPlaying1, isPlaying2 });
    
    // Initialize raycaster and mouse for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    debugLog('Init', 'Raycaster and mouse initialized');
    
    // Initialize audio context but don't start it yet
    initAudioContext();
    
    // Add more test logs
    console.log('Init function completed - logging system should be working');
    debugLog('Init', 'Initialization completed successfully');
    
    // Rest of initialization...
    // ... existing code ...
}

// Helper function to convert MIDI note to frequency
function midiToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

// Update MIDI initialization
function initMIDI() {
    console.log('[DEBUG] Initializing MIDI');
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: false })
            .then(access => {
                console.log('[DEBUG] MIDI access granted');
                onMIDISuccess(access);
            }, error => {
                console.warn('[DEBUG] MIDI access failed:', error);
                onMIDIFailure(error);
            });
    } else {
        console.warn("[DEBUG] WebMIDI is not supported in this browser.");
        const midiStatus = document.createElement('div');
        midiStatus.className = 'control-group';
        midiStatus.innerHTML = '<label style="color: #ff6b6b;">MIDI not supported in this browser</label>';
        document.querySelector('.pitch-controls').appendChild(midiStatus);
    }
}

function onMIDISuccess(midiAccess) {
    console.log('[DEBUG] MIDI initialized', {
        inputs: midiAccess.inputs.size,
        outputs: midiAccess.outputs.size
    });
    
    // Get the first available MIDI output device
    const outputs = Array.from(midiAccess.outputs.values());
    if (outputs.length > 0) {
        midiOutput = outputs[0];
        midiEnabled = true;
        console.log('[DEBUG] MIDI output selected:', midiOutput.name);
    } else {
        console.warn('[DEBUG] No MIDI output devices available');
    }
}

function setupEventListeners() {
    debugLog('Events', 'Setting up event listeners');
    
    // Window resize handler
    window.addEventListener('resize', () => {
        debugLog('Events', 'Window resized', {
            width: window.innerWidth,
            height: window.innerHeight
        });
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Mouse event handlers
    renderer.domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Collect all meshes from all sequencers
        const allMeshes = [
            ...spheres.map(group => group.children[0]),
            ...spheres2.map(group => group.children[0]),
            ...additionalSequencers.flatMap(seq => seq.spheres.map(group => group.children[0]))
        ];
        
        const intersects = raycaster.intersectObjects(allMeshes);
        if (intersects.length > 0) {
            debugLog('Events', 'Mouse hover on object', {
                objectIndex: allMeshes.indexOf(intersects[0].object)
            });
        }
    }, false);

    renderer.domElement.addEventListener('click', (event) => {
        // Check if the click target is a UI element (button, input, etc.)
        const target = event.target;
        const isUIElement = target.tagName === 'BUTTON' || 
                           target.tagName === 'INPUT' || 
                           target.tagName === 'SELECT' || 
                           target.tagName === 'A' ||
                           target.closest('.pitch-controls') ||
                           target.closest('.modulator-controls') ||
                           target.closest('.controls');
        
        if (isUIElement) {
            debugLog('Events', 'Click on UI element, ignoring scene click', { target: target.tagName });
            return; // Don't process scene clicks for UI elements
        }
        
        debugLog('Events', 'Click detected on scene', {
            clientX: event.clientX,
            clientY: event.clientY,
            target: event.target.tagName,
            raycaster: !!raycaster,
            mouse: !!mouse
        });
        
        if (!raycaster || !mouse) {
            debugLog('Events', 'Raycaster or mouse not initialized');
            return;
        }
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        debugLog('Events', 'Mouse coordinates calculated', { x: mouse.x, y: mouse.y });
        
        raycaster.setFromCamera(mouse, camera);
        
        // Handle clicks for first sequencer - check all children of each group
        let clicked = false;
        debugLog('Events', 'Checking first sequencer spheres', { count: spheres.length });
        
        for (let i = 0; i < spheres.length; i++) {
            const group = spheres[i];
            if (group && group.children) {
                debugLog('Events', `Checking sphere ${i}`, { 
                    childrenCount: group.children.length,
                    groupPosition: group.position
                });
                
                const intersects = raycaster.intersectObjects(group.children);
                if (intersects.length > 0) {
                    debugLog('Events', `Intersection found for sphere ${i}`, {
                        distance: intersects[0].distance,
                        point: intersects[0].point
                    });
                    
                    sequence[i] = sequence[i] === 0 ? 1 : 0;
                    debugLog('Events', 'Toggled sequencer 1 step', {
                        stepIndex: i,
                        newValue: sequence[i]
                    });
                    // Update the material of the clicked object
                    intersects[0].object.material.dispose();
                    intersects[0].object.material = createGlossyMaterial(sequence[i] === 1 ? COLORS.active : COLORS.inactive);
                    clicked = true;
                    break;
                }
            }
        }
        
        // Handle clicks for second sequencer - check all children of each group
        if (!clicked) {
            debugLog('Events', 'Checking second sequencer spheres', { count: spheres2.length });
            
            for (let i = 0; i < spheres2.length; i++) {
                const group = spheres2[i];
                if (group && group.children) {
                    debugLog('Events', `Checking sphere2 ${i}`, { 
                        childrenCount: group.children.length,
                        groupPosition: group.position
                    });
                    
                    const intersects = raycaster.intersectObjects(group.children);
                    if (intersects.length > 0) {
                        debugLog('Events', `Intersection found for sphere2 ${i}`, {
                            distance: intersects[0].distance,
                            point: intersects[0].point
                        });
                        
                        sequence2[i] = sequence2[i] === 0 ? 1 : 0;
                        debugLog('Events', 'Toggled sequencer 2 step', {
                            stepIndex: i,
                            newValue: sequence2[i]
                        });
                        // Update the material of the clicked object
                        intersects[0].object.material.dispose();
                        intersects[0].object.material = createGlossyMaterial(sequence2[i] === 1 ? COLORS.active : COLORS.inactive);
                        clicked = true;
                        break;
                    }
                }
            }
        }
        
        if (!clicked) {
            debugLog('Events', 'No sphere clicked - no intersections found');
        }
    }, false);

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        debugLog('Events', 'Key pressed', { key: event.key });
        switch(event.key) {
            // Remove the spacebar handler
            // case ' ': // Spacebar
            //     isPlaying1 = !isPlaying1;
            //     isPlaying2 = !isPlaying2;
            //     additionalSequencers.forEach(seq => seq.isPlaying = !seq.isPlaying);
            //     debugLog('Events', 'Toggled playback', {
            //         isPlaying1,
            //         isPlaying2,
            //         additionalSequencersPlaying: additionalSequencers.map(seq => seq.isPlaying)
            //     });
            //     break;
            case 'r': // Reset camera
                debugLog('Events', 'Reset camera position');
                camera.position.set(0, 10, 10);
                camera.lookAt(0, 0, 0);
                break;
        }
    }, false);
    
    debugLog('Events', 'Event listeners setup complete');
}



// Function to show file picker and save logs
async function showFilePickerAndSave() {
    try {
        // Create CSV content
        const csvHeader = 'Timestamp,Section,Message,Data\n';
        const csvContent = logStorage.map(log => {
            const timestamp = log.timestamp || new Date().toISOString();
            const section = log.section || '';
            const message = log.message || '';
            const data = log.data ? JSON.stringify(log.data).replace(/"/g, '""') : '';
            
            return `"${timestamp}","${section}","${message}","${data}"`;
        }).join('\n');
        
        const fullCsv = csvHeader + csvContent;
        
        // Try to use the File System Access API (modern browsers)
        if ('showSaveFilePicker' in window) {
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: `sequencer-logs-${timestamp}.csv`,
                    types: [{
                        description: 'CSV Files',
                        accept: {
                            'text/csv': ['.csv']
                        }
                    }]
                });
                
                const writable = await fileHandle.createWritable();
                await writable.write(fullCsv);
                await writable.close();
                
                alert(`Logs saved successfully!\n\nTotal logs exported: ${logStorage.length}\n\nFile saved to your chosen location.`);
                console.log('Logs saved via File System Access API');
                return;
            } catch (fsError) {
                console.log('File System Access API failed, falling back to download:', fsError);
            }
        }
        
        // Fallback to regular download
        const blob = new Blob([fullCsv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `sequencer-logs-${timestamp}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Logs downloaded!\n\nTotal logs exported: ${logStorage.length}\n\nFile: sequencer-logs-${timestamp}.csv\n\nCheck your Downloads folder.\n\nNote: For a file picker dialog, try using Chrome or Edge browser.`);
        console.log('Logs downloaded via fallback method');
        
    } catch (error) {
        console.error('Error in showFilePickerAndSave:', error);
        alert(`Error saving logs: ${error.message}`);
    }
}



