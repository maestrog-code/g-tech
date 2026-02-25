'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';

function NeuralSphere({ role }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Dynamic colors based on role
    const getThemeColor = () => {
        switch (role) {
            case 'HACKER': return '#00ff66';
            case 'ARCHITECT': return '#ff9d00';
            case 'VOYAGER': return '#bc13fe';
            default: return '#00f2ff';
        }
    };

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.005;

            // Gentle pulsing
            const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <sphereGeometry args={[1.5, 64, 64]} />
            <MeshDistortMaterial
                color={getThemeColor()}
                speed={hovered ? 5 : 1}
                distort={0.4}
                radius={1}
                emissive={getThemeColor()}
                emissiveIntensity={hovered ? 2 : 0.5}
                wireframe
            />
        </mesh>
    );
}

function DataRing({ radius, color, speed }) {
    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.z = state.clock.elapsedTime * speed;
        ref.current.rotation.x = state.clock.elapsedTime * (speed * 0.5);
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
    );
}

export default function Hero3D() {
    const [role, setRole] = useState('universal');
    const [webGLSupported, setWebGLSupported] = useState(true);

    useEffect(() => {
        // Check for WebGL support
        try {
            const canvas = document.createElement('canvas');
            setWebGLSupported(!!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))));
        } catch (e) {
            setWebGLSupported(false);
        }

        const updateRole = () => {
            const currentRole = document.documentElement.getAttribute('data-role');
            if (currentRole) setRole(currentRole);
        };

        const observer = new MutationObserver(updateRole);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-role'] });
        updateRole();

        return () => observer.disconnect();
    }, []);

    if (!webGLSupported) {
        return (
            <div className="hero-3d-container fallback" style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div className="neural-core-fallback">
                    <div className="core-ring"></div>
                    <div className="core-ring" style={{ width: '150px', height: '150px', animationDuration: '6s', animationDirection: 'reverse' }}></div>
                    <div className="core-center"></div>
                </div>
                <div className="canvas-overlay"></div>
                <style jsx>{`
                    .neural-core-fallback {
                        position: relative;
                        width: 250px;
                        height: 250px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 5;
                    }
                    .core-center {
                        width: 100px;
                        height: 100px;
                        background: var(--neon-blue);
                        border-radius: 50%;
                        filter: blur(40px);
                        opacity: 0.6;
                        animation: pulse 4s ease-in-out infinite;
                    }
                    .core-ring {
                        position: absolute;
                        width: 220px;
                        height: 220px;
                        border: 1px solid var(--neon-blue);
                        border-radius: 50%;
                        opacity: 0.2;
                        animation: spin 8s linear infinite;
                        box-shadow: 0 0 15px var(--neon-blue);
                    }
                    .canvas-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        background: radial-gradient(circle at center, transparent 0%, var(--background) 70%);
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.4; }
                        50% { transform: scale(1.3); opacity: 0.7; }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="hero-3d-container" style={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden' }}>
            <Canvas shadows gl={{ antialias: false, powerPreference: "high-performance" }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <NeuralSphere role={role} />
                    <DataRing radius={2.2} color="#ffffff" speed={0.2} />
                    <DataRing radius={2.5} color={role === 'HACKER' ? '#00ff66' : '#00f2ff'} speed={-0.15} />
                </Float>
            </Canvas>
            <div className="canvas-overlay"></div>
            <style jsx>{`
        .hero-3d-container {
          mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
        }
        .canvas-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 0%, var(--background) 70%);
        }
      `}</style>
        </div>
    );
}
