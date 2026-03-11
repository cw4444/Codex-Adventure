# Neon Swarm Playground v2

A small browser toy for interactive particle art.

## What's new in v2

- **Mode presets**: `Calm`, `Storm`, `Galaxy`
- **Theme picker**: `neon`, `sunset`, `cyber`, `mono`
- **Trail control** to tune glow persistence
- Better **pointer/touch support** via Pointer Events

## Controls

- Click/drag on the canvas: spawn particles
- `Space`: toggle gravity on/off
- `Mode`: quick preset for movement profile + slider defaults
- `Theme`: color palette selector
- `Spawn`, `Drift`, `Trail` sliders: fine-grained behavior tuning
- `Reset`: clear all particles

## Run

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.
