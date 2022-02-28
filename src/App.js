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
  const highlighter = useRef();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  let intersects;

  const onMouseMove = (e) => {
    mouse.current.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.current.y = -(e.clientY / sizes.height) * 2 + 1;
    console.log(mouse.current);
    console.log(Math.floor(mouse.current.x * 1000));
    console.log(Math.floor(mouse.current.y * 1000));
    intersects = raycaster.current.intersectObjects(Canvas.children);
    intersects.forEach((intersect) => {
      if (intersect.object.name === "ground") {
        const lightlightPos = highlighter.current.position
          .copy(intersect.point)
          .floor()
          .addScalar(0.5);
        highlighter.current.position.set(lightlightPos.x, lightlightPos.z, 0);
      }
    });
  };

  useFrame(() => {
    highlighter.current.position.x = mouse.current.x;
  });

  return (
    <group>
      <mesh name="ground" rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[20, 20]} />
        <gridHelper args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          attach="material"
          color="white"
          side="doubleSide"
          visible={false}
        />

        <axesHelper args={[100]} />
      </mesh>
      <mesh
        ref={highlighter}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[2, 0, 0.5]}
      >
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    </group>
  );
};

const Box = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { scale } = useSpring({
    scale: isClicked ? 1.5 : 1,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <animated.mesh
      scale={scale}
      onClick={() => setIsClicked(!isClicked)}
      position={[0, 1, 0]}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="blue" visible={false} />
    </animated.mesh>
  );
};

function App() {
  return (
    <>
      <Title>Subdivide a plane</Title>
      <Canvas shadows>
        <group position={[0, -2, 0]}>
          <perspectiveCamera
            position={[0, -2, -5]}
            rotation={[Math.PI / 6, 0, 0]}
            fov={75}
            aspect={sizes.aspects}
            near={0.1}
            far={1000}
          >
            <Box />
            <Plane />
          </perspectiveCamera>
        </group>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
