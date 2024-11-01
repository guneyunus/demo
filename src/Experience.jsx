import { Bvh, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Placeholder from "./Placeholder.jsx";
import Fox from "./Fox.jsx";
import { Model } from "./Exp.jsx";
import { Rays } from "./Rays.jsx";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={4.5}
        shadow-normalBias={0.04}
      />
      <ambientLight intensity={1.5} />

      {/* <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}

      <Bvh firstHitOnly>
        <Rays>
          <Model />
        </Rays>
      </Bvh>
    </>
  );
}
