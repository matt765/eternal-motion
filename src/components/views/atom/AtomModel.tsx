"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "./AtomModel.module.scss";
import { useAtomModel } from "./useAtomModel";

// --- GŁÓWNA KONFIGURACJA MODELU ---
const CONFIG = {
  // Skala i rotacja
  modelScale: 1.35,
  initialRotation: new THREE.Euler(Math.PI / 4, Math.PI / 0.6, 0),

  // Kamera
  cameraPosition: new THREE.Vector3(0, 4, 12),
  cameraFov: 50,

  // Światło
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  directionalLightPosition: new THREE.Vector3(10, 10, 5),

  // Jądro
  protonColor: "#00d4ff",
  neutronColor: "#2563eb",
  nucleonBaseRadius: 0.2,
  nucleonDetail: 32,
  nucleusScaleFactor: 0.9,
  nucleonMaterial: { roughness: 0.4, metalness: 0.2 },

  // Elektron
  electronColor: "#7dd3fc",
  electronBaseRadius: 0.1,
  electronDetail: 16,
  electronMaterial: { emissive: "#7dd3fc", emissiveIntensity: 0.5 },

  // Orbity
  orbitRingColor: "#ffffff",
  orbitRingOpacity: 0.3,
  orbitRingThickness: 0.01,
  shellDistances: [2, 3.2, 4.4, 5.6, 6.8, 8.0, 9.2],

  // Animacja
  speedConstant: 1.5 * Math.PI,
  sliderMidpoint: 50,
};
// ------------------------------------

const Nucleus = ({
  protons,
  neutrons,
}: {
  protons: number;
  neutrons: number;
}) => {
  const { protonPositions, neutronPositions } = useMemo(() => {
    const total = protons + neutrons;
    if (total === 0) return { protonPositions: [], neutronPositions: [] };

    if (total === 1) {
      const position = [new THREE.Vector3(0, 0, 0)];
      return protons === 1
        ? { protonPositions: position, neutronPositions: [] }
        : { protonPositions: [], neutronPositions: position };
    }

    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const nucleonRadius = CONFIG.nucleonBaseRadius * CONFIG.modelScale;
      const clusterRadius =
        nucleonRadius * Math.cbrt(total) * CONFIG.nucleusScaleFactor;
      points.push(new THREE.Vector3(x, y, z).multiplyScalar(clusterRadius));
    }

    const pPos: THREE.Vector3[] = [];
    const nPos: THREE.Vector3[] = [];
    const particleTypes: ("P" | "N")[] = [];
    for (let i = 0; i < protons; i++) particleTypes.push("P");
    for (let i = 0; i < neutrons; i++) particleTypes.push("N");

    for (let i = particleTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [particleTypes[i], particleTypes[j]] = [
        particleTypes[j],
        particleTypes[i],
      ];
    }

    points.forEach((pos, i) => {
      if (particleTypes[i] === "P") {
        pPos.push(pos);
      } else {
        nPos.push(pos);
      }
    });

    return { protonPositions: pPos, neutronPositions: nPos };
  }, [protons, neutrons]);

  return (
    <group>
      {protonPositions.map((pos, i) => (
        <mesh key={`p${i}`} position={pos}>
          <sphereGeometry
            args={[
              CONFIG.nucleonBaseRadius * CONFIG.modelScale,
              CONFIG.nucleonDetail,
              CONFIG.nucleonDetail,
            ]}
          />
          <meshStandardMaterial
            color={CONFIG.protonColor}
            {...CONFIG.nucleonMaterial}
          />
        </mesh>
      ))}
      {neutronPositions.map((pos, i) => (
        <mesh key={`n${i}`} position={pos}>
          <sphereGeometry
            args={[
              CONFIG.nucleonBaseRadius * CONFIG.modelScale,
              CONFIG.nucleonDetail,
              CONFIG.nucleonDetail,
            ]}
          />
          <meshStandardMaterial
            color={CONFIG.neutronColor}
            {...CONFIG.nucleonMaterial}
          />
        </mesh>
      ))}
    </group>
  );
};

const Electron = ({ radius, speed }: { radius: number; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const angle = useRef(Math.random() * Math.PI * 2);

  // FIX: Poprawiona logika ruchu elektronu, aby poruszał się w płaszczyźnie XY
  useFrame((_, delta) => {
    angle.current += delta * speed;
    const x = Math.cos(angle.current) * radius;
    const y = Math.sin(angle.current) * radius; // Zmiana z 'z' na 'y'
    if (ref.current) {
      ref.current.position.set(x, y, 0); // Zmiana z (x, 0, z) na (x, y, 0)
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[
          CONFIG.electronBaseRadius * CONFIG.modelScale,
          CONFIG.electronDetail,
          CONFIG.electronDetail,
        ]}
      />
      <meshStandardMaterial
        color={CONFIG.electronColor}
        {...CONFIG.electronMaterial}
      />
    </mesh>
  );
};

const OrbitRing = ({ radius }: { radius: number }) => (
  <mesh>
    <ringGeometry
      args={[
        radius - CONFIG.orbitRingThickness * CONFIG.modelScale,
        radius + CONFIG.orbitRingThickness * CONFIG.modelScale,
        64,
      ]}
    />
    <meshBasicMaterial
      color={CONFIG.orbitRingColor}
      side={THREE.DoubleSide}
      transparent
      opacity={CONFIG.orbitRingOpacity}
    />
  </mesh>
);

export const AtomModel = () => {
  const { elements, element, sliderValue, setSliderValue, setSelectedElement } =
    useAtomModel();
  const speedMultiplier = (sliderValue / CONFIG.sliderMidpoint) ** 2;

  const shellDistances = useMemo(
    () => CONFIG.shellDistances.map((d) => d * CONFIG.modelScale),
    []
  );

  const orientations = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    return element.shells.map((_, idx) => {
      if (idx === 0) return new THREE.Euler(Math.PI / 2, 0, 0);
      if (idx === 1) return new THREE.Euler(0, 0, 0);
      if (idx === 2) return new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);

      const angle = (idx - 2) * goldenAngle;
      return new THREE.Euler(angle, angle * 0.5, angle * 0.25);
    });
  }, [element]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.animationContainer}>
        <Canvas
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
          camera={{ position: CONFIG.cameraPosition, fov: CONFIG.cameraFov }}
        >
          <ambientLight intensity={CONFIG.ambientLightIntensity} />
          <directionalLight
            position={CONFIG.directionalLightPosition.toArray()}
            intensity={CONFIG.directionalLightIntensity}
          />

          <group rotation={CONFIG.initialRotation}>
            <Nucleus protons={element.protons} neutrons={element.neutrons} />
            {element.shells.map((count, idx) => {
              const speed =
                CONFIG.speedConstant * speedMultiplier * (1 / (idx + 1));
              return (
                <group key={idx} rotation={orientations[idx]}>
                  <OrbitRing radius={shellDistances[idx]} />
                  {Array.from({ length: count }).map((_, i) => (
                    <Electron
                      key={i}
                      radius={shellDistances[idx]}
                      speed={speed}
                    />
                  ))}
                </group>
              );
            })}
          </group>

          <OrbitControls enableZoom enablePan />
        </Canvas>
      </div>
    </div>
  );
};
