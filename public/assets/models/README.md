# External GLB / GLTF Asset Directory

Place optional custom `.glb` or `.gltf` architectural furniture models in this folder (`/public/assets/models/`).

By default, **Lumière Residence** synthesizes multi-part CAD-proportioned procedural 3D meshes and high-resolution PBR surface maps (Calacatta marble, rift-cut light oak, woven bouclé, brushed aluminum, and tempered glass) at runtime with zero external network dependencies so the experience loads reliably offline and on Vercel.

You can override any furniture piece with a custom `.glb` asset via the `<OptionalModelLoader />` component in `src/utils/OptionalModelLoader.tsx`.
