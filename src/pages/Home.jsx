import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import profilePic from '../assets/profile.png';

// --- 3D Animated Background Component ---
const AnimatedBackground = () => {
    const mountRef = useRef(null);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    useEffect(() => {
        if (window.THREE) {
            setScriptsLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        script.onload = () => setScriptsLoaded(true);
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (!scriptsLoaded || !mountRef.current) return;

        let scene, camera, renderer, points;
        let animationFrameId;

        // Scene setup
        scene = new window.THREE.Scene();
        camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 300;

        renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        const numPoints = 5000;
        const positions = new Float32Array(numPoints * 3);
        const geometry = new window.THREE.BufferGeometry();
        
        for (let i = 0; i < numPoints; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 800;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
        }

        geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));

        const material = new window.THREE.PointsMaterial({
            color: 0x9333ea,
            size: 1.5,
            transparent: true,
            opacity: 0.7,
            blending: window.THREE.AdditiveBlending,
        });

        points = new window.THREE.Points(geometry, material);
        scene.add(points);
        
        let mouseX = 0, mouseY = 0;
        const handleMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        };
        document.addEventListener('mousemove', handleMouseMove);

        const animate = (time) => {
            if (!mountRef.current) return;
            const t = time * 0.0001;
            
            points.rotation.x = t * 0.2;
            points.rotation.y = t * 0.4;

            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current) {
                while (mountRef.current.firstChild) {
                    mountRef.current.removeChild(mountRef.current.firstChild);
                }
            }
        };
    }, [scriptsLoaded]);

    return <div ref={mountRef} className="fixed inset-0 z-0 opacity-60"></div>;
};

// Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3, // delay each child
            delayChildren: 0.3,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Home = ({ setPage }) => {
    return (
        <section className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative bg-[#10002B] text-white">
            <AnimatedBackground />
            
            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="z-10 w-full max-w-7xl mx-auto px-4"
            >
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-16 md:gap-24">
                    
                    {/* Left Content */}
                    <motion.div variants={fadeUp} className="text-center md:text-left order-2 md:order-1">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
                            Hi, I'm <span className="text-purple-400">Kathirvelan M</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl mx-auto md:mx-0">
                            A passionate B.Tech student in Artificial Intelligence and Data Science with a solid foundation in web development, data analysis, and programming. My goal is to become a proficient and ethical AI professional contributing to society's advancement.
                        </p>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div variants={fadeUp} className="flex-shrink-0 order-1 md:order-2">
                        <img 
                            src={profilePic}
                            alt="Kathirvelan M Profile"
                            className="w-80 h-80 md:w-96 md:h-96 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                        />
                    </motion.div>
                </div>
            </motion.main>
        </section>
    );
};

export default Home;
