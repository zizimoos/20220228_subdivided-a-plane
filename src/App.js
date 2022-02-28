import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";

const Title = styled.h1`
  padding: 10px;
`;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspects: window.innerWidth / window.innerHeight,
};

const Plane = () => {
  const thisScene = useRef();
  const highlighter = useRef(null);
  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let intersects;

  window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / sizes.width) * 2 - 1;
    mousePosition.y = -(e.clientY / sizes.height) * 2 + 1;
    console.log(Math.floor(mousePosition.x * 1000));
    console.log(Math.floor(mousePosition.y * 1000));
    intersects = raycaster.intersectObjects(thisScene.current.children);
    console.log("intersects", intersects);
    intersects.forEach((intersect) => {
      if (intersect.object.name === "ground") {
        const highlightPos = new THREE.Vector3()
          .copy(intersect.point)
          .floor()
          .addScalar(0.5);
        console.log("highlightPos", highlightPos);
        highlighter.current.position.set(
          mousePosition.x * 10,
          mousePosition.y * 10,
          0
        );
        console.log("highlighter", highlighter.current.position);
      }
    });
  });

  return (
    <group ref={thisScene}>
      <mesh name="ground" position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[20, 20]} />
        <gridHelper args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          attach="material"
          color="white"
          side="doubleSide"
          visible={false}
        />
        <axesHelper args={[100]} />
      </mesh>
      <mesh ref={highlighter} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshBasicMaterial attach="material" color="red" />
        <axesHelper args={[2]} />
      </mesh>
    </group>
  );
};

function App() {
  return (
    <>
      <Title>Subdivide a plane</Title>
      <Canvas shadows>
        <Plane />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
