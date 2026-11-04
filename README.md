# Lumière Residence — Photorealistic 3D Interactive Apartment Tour

An interactive 3D architectural visualization web application built with **React**, **TypeScript**, **Vite**, **Three.js**, **React Three Fiber**, **@react-three/drei**, **Tailwind CSS**, and **Framer Motion**.

Explore a fully furnished three-bedroom modern minimalist luxury apartment (~234 m²) in real time — combining Google Street View room-to-room exploration, Blender-style free viewport & close-up object inspection, and Unreal Engine architectural PBR lighting and materials.

---

## Spatial Floor Plan Architecture

1. **Bedroom 1 – Studio (Upper-Left)**: Personal workstation studio and master bedroom featuring a king platform bed, 85-inch wall-mounted OLED television, illuminated wardrobe, and **two matching pure-white PC gaming/workstation setups** with clear tempered-glass cases, internal GPU/CPU AIO cooler/fans/RGB/combed cables, dual white monitors, white mechanical keyboards & mice, headphones, and ergonomic white chairs.
2. **Balcony (Upper-Middle)**: Positioned along the upper edge between Bedroom 1 and Bedroom 2, connected directly to the central Living Room via floor-to-ceiling sliding glass doors, with travertine decking, glass railing, outdoor sconces, lounge seating, and plants.
3. **Bedroom 2 (Upper-Right)**: Calm minimalist white bedroom with upholstered queen bed, indirect cove lighting, cylindrical oak-top bedside tables, sheer curtains, and handleless matte-white wardrobe (no PC or TV).
4. **Bedroom 3 (Lower-Left)**: Distinct Japandi minimalist bedroom with low rift-oak & white bouclé bed, honed travertine bedside tables, frosted fluted-glass wardrobe, and bouclé reading nook (no PC or TV).
5. **Living Room (Central Area)**: Connects naturally to the upper-middle balcony, bedrooms, and kitchen — featuring a modular bouclé sofa facing an 85-inch OLED TV & travertine/oak media wall, dual-tier coffee table, plush rug, plants, and minimalist artwork.
6. **Kitchen and Dining Area (Lower-Right)**: Spacious culinary hall with matte-white & light-oak cabinetry, French-door refrigerator, built-in wall oven, induction cooktop, range hood, undermount sink, Calacatta marble waterfall island with barstools, and 6-seater dining suite.

---

## Camera & Special Viewing Modes

### 4 Interactive Camera Modes
- **Free Fly Mode**: Blender-style 3D viewport (`Right / Left Drag` rotate, `Middle Drag` pan, `Wheel` zoom, `WASD` horizontal/forward flight, `Q/E` down/up, `Shift` speed boost, `F` toggle free mouse look).
- **First-Person Walk Mode**: Eye-height (`1.65 m`) walkthrough with wall & furniture collision detection (`WASD` walk through open doorways, `Shift` brisk walk, `Drag` or `L` mouse look).
- **Orbit / Object Inspection Mode**: Click any interactive furniture item to smoothly glide toward it and inspect its 3D geometry and PBR materials from `3/4 View`, `Front`, `Side`, or `Above` (zooming down to `26 cm` to inspect internal PC hardware through tempered glass).
- **Room Navigation**: Smooth damped camera transitions across `Full Apartment Overview`, `Studio Bedroom`, `Balcony`, `Bedroom 2`, `Bedroom 3`, `Living Room`, and `Kitchen and Dining Area` (keys `1`–`7`, bottom dock, or live SVG **Floor Plan** radar `M`).

### 3 Special Viewing Experiences
- **Interior View**: Full architectural interior walkthrough with ceiling, windows, doors, and lighting.
- **Dollhouse View**: Elevated 3D architectural perspective with clickable floating room pins that smoothly dive into any selected room.
- **Cutaway View**: Non-destructive toggles for **Ceiling**, **Exterior Walls**, and **Interior Walls** with 1-click **Restore Full Architecture**.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (http://localhost:3000)
npm run dev

# 3. Type-check and build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Deploying to Vercel

This project is a static client-side Vite SPA with zero backend or database dependencies and includes `vercel.json` out of the box:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Vercel automatically detects **Vite** (`npm run build` -> `dist`).
4. Click **Deploy**.
