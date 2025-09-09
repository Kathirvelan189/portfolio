import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

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

// Skill Icons Component
const SkillIcon = ({ skill }) => {
  const icons = {
    "HTML": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-orange-500">
        <path fill="currentColor" d="M12 18.1778L16.6192 16.9222L17.2434 10.1444H9.02648L8.82219 7.88889H17.4477L17.652 5.67778H6.34799L6.91609 12.3556H14.7809L14.5566 14.5L12 15.0556L9.44335 14.5L9.29533 12.9556H7.01924L7.38077 16.9222L12 18.1778Z" />
      </svg>
    ),
    "CSS": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-blue-500">
        <path fill="currentColor" d="M5 3L4.35 6.34H17.94L17.5 8.5H4.1L3.55 11.06H17.05L16.54 13.26H3.05L2.5 16H16.85L16.15 19.5L12 20.5L7.85 19.5L7.45 17H4.7L5.3 21L12 22.5L18.7 21L19.45 16H21.5L20.7 22L12 24L3.3 22L2.05 14.5L1.8 12L2.35 8.5L3 5L5 3Z" />
      </svg>
    ),
    "JavaScript": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-yellow-400">
        <path fill="currentColor" d="M3 3H21V21H3V3M7.73 18.04C8.13 18.89 8.92 19.59 10.27 19.59C11.77 19.59 12.8 18.79 12.8 17.04V11.26H11.1V17C11.1 17.86 10.75 18.08 10.2 18.08C9.62 18.08 9.26 17.68 9.06 17.21L7.73 18.04M13.71 17.86C14.21 18.84 15.22 19.59 16.66 19.59C18.3 19.59 19.59 18.44 19.59 16.21C19.59 14.08 18.44 13 16.93 12.5C17.42 12.13 17.85 11.73 17.85 11.08C17.85 10.47 17.4 10.05 16.67 10.05C15.96 10.05 15.49 10.52 15.3 11.11L13.99 10.48C14.4 9.49 15.33 8.89 16.67 8.89C18.35 8.89 19.33 9.93 19.33 11.1C19.33 12.35 18.47 13.05 17.5 13.56V13.61C18.94 14.05 19.75 15 19.75 16.26C19.75 18.2 18.26 19.5 16.5 19.5C14.93 19.5 13.93 18.7 13.5 17.86H13.71Z" />
      </svg>
    ),
    "React": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400">
        <path fill="currentColor" d="M14.2209 14.2209C13.8304 14.6114 13.1972 14.6114 12.8067 14.2209C12.4162 13.8304 12.4162 13.1972 12.8067 12.8067C13.1972 12.4162 13.8304 12.4162 14.2209 12.8067C14.6114 13.1972 14.6114 13.8304 14.2209 14.2209Z" />
        <path fill="currentColor" d="M12 18.7C7.5 18.7 4 15.9 4 12C4 8.1 7.5 5.3 12 5.3C16.5 5.3 20 8.1 20 12C20 15.9 16.5 18.7 12 18.7ZM12 7.3C8.7 7.3 6 9.3 6 12C6 14.7 8.7 16.7 12 16.7C15.3 16.7 18 14.7 18 12C18 9.3 15.3 7.3 12 7.3Z" />
        <path fill="currentColor" d="M12 22.5C10.3 22.5 8.8 22.3 7.5 22C6.2 21.7 5.2 21.2 4.4 20.6C3.6 20 3.1 19.3 2.8 18.5C2.5 17.7 2.4 16.9 2.4 16.1C2.4 15.3 2.5 14.5 2.8 13.7C3.1 12.9 3.6 12.2 4.4 11.6C5.2 11 6.2 10.5 7.5 10.2C8.8 9.9 10.3 9.7 12 9.7C13.7 9.7 15.2 9.9 16.5 10.2C17.8 10.5 18.8 11 19.6 11.6C20.4 12.2 20.9 12.9 21.2 13.7C21.5 14.5 21.6 15.3 21.6 16.1C21.6 16.9 21.5 17.7 21.2 18.5C20.9 19.3 20.4 20 19.6 20.6C18.8 21.2 17.8 21.7 16.5 22C15.2 22.3 13.7 22.5 12 22.5ZM12 11.7C10.5 11.7 9.1 11.9 8 12.2C6.9 12.5 6 12.8 5.4 13.2C4.8 13.6 4.4 14.1 4.2 14.6C4 15.1 3.9 15.6 3.9 16.1C3.9 16.6 4 17.1 4.2 17.6C4.4 18.1 4.8 18.6 5.4 19C6 19.4 6.9 19.7 8 20C9.1 20.3 10.5 20.5 12 20.5C13.5 20.5 14.9 20.3 16 20C17.1 19.7 18 19.4 18.6 19C19.2 18.6 19.6 18.1 19.8 17.6C20 17.1 20.1 16.6 20.1 16.1C20.1 15.6 20 15.1 19.8 14.6C19.6 14.1 19.2 13.6 18.6 13.2C18 12.8 17.1 12.5 16 12.2C14.9 11.9 13.5 11.7 12 11.7Z" />
      </svg>
    ),
    "Tailwind CSS": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-cyan-500">
        <path fill="currentColor" d="M12 6C9.33 6 7.67 7.33 7 10C8 8.67 9.17 8.17 10.5 8.5C11.26 8.69 11.81 9.24 12.41 9.85C13.39 10.85 14.5 12 17 12C19.67 12 21.33 10.67 22 8C21 9.33 19.83 9.83 18.5 9.5C17.74 9.31 17.2 8.76 16.59 8.15C15.61 7.15 14.5 6 12 6ZM7 12C4.33 12 2.67 13.33 2 16C3 14.67 4.17 14.17 5.5 14.5C6.26 14.69 6.8 15.24 7.41 15.85C8.39 16.85 9.5 18 12 18C14.67 18 16.33 16.67 17 14C16 15.33 14.83 15.83 13.5 15.5C12.74 15.31 12.2 14.76 11.59 14.15C10.61 13.15 9.5 12 7 12Z" />
      </svg>
    ),
    "Node.js": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-green-500">
        <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21.9 8.9C21.7 8.6 21.4 8.4 21 8.3L16.5 6.6L14.3 4.4C14 4.2 13.7 4 13.3 4H10.7C10.3 4 10 4.2 9.7 4.4L7.5 6.6L3 8.3C2.6 8.4 2.3 8.6 2.1 8.9C1.9 9.2 1.8 9.6 1.8 10V14C1.8 14.4 1.9 14.8 2.1 15.1C2.3 15.4 2.6 15.6 3 15.7L8.5 17.4L10.7 19.6C11 19.8 11.3 20 11.7 20H14.3C14.7 20 15 19.8 15.3 19.6L17.5 17.4L23 15.7C23.4 15.6 23.7 15.4 23.9 15.1C24.1 14.8 24.2 14.4 24.2 14V10C24.2 9.6 24.1 9.2 23.9 8.9ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16Z" />
      </svg>
    ),
    "Express": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-gray-400">
        <path fill="currentColor" d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.78-4.458zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.064 5.278z" />
      </svg>
    ),
    "Python": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-blue-400">
        <path fill="currentColor" d="M12 2C9.33 2 7 4.33 7 7V17C7 19.67 9.33 22 12 22C14.67 22 17 19.67 17 17V7C17 4.33 14.67 2 12 2ZM12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4ZM12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20Z" />
      </svg>
    ),
    "Pandas": (
      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">PD</span>
      </div>
    ),
    "NumPy": (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">NP</span>
      </div>
    ),
    "Scikit-learn": (
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">SK</span>
      </div>
    ),
    "Streamlit": (
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">ST</span>
      </div>
    ),
    "Git": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-orange-500">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    "GitHub": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-gray-800">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    "VS Code": (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-xs font-bold text-white">VS</span>
      </div>
    ),
    "Power BI": (
      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">PB</span>
      </div>
    ),
  };

  return icons[skill] || (
    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
      <span className="text-xs font-bold text-white">{skill.charAt(0)}</span>
    </div>
  );
};

// Proficiency indicator
const ProficiencyBar = ({ level }) => {
  return (
    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${level}%` }}
      ></div>
    </div>
  );
};

const Skill = () => {
    const [activeCategory, setActiveCategory] = useState("Frontend");
    const [hoveredSkill, setHoveredSkill] = useState(null);
    
    const skillGroups = {
        "Frontend": [
            { name: "HTML", level: 95 },
            { name: "CSS", level: 90 },
            { name: "JavaScript", level: 85 },
            { name: "React", level: 88 },
            { name: "Tailwind CSS", level: 92 }
        ],
        "Backend": [
            { name: "Node.js", level: 75 },
            { name: "Express", level: 80 }
        ],
        "AI & Data Science": [
            { name: "Python", level: 90 },
            { name: "Pandas", level: 85 },
            { name: "NumPy", level: 80 },
            { name: "Scikit-learn", level: 78 },
            { name: "Streamlit", level: 75 }
        ],
        "Tools & Platforms": [
            { name: "Git", level: 90 },
            { name: "GitHub", level: 88 },
            { name: "VS Code", level: 95 },
            { name: "Power BI", level: 80 }
        ]
    };

    return (
        <section className="min-h-screen py-20 px-4 flex justify-center items-center text-white relative bg-[#10002B] overflow-hidden">
            <AnimatedBackground />
            
            <div className="max-w-7xl mx-auto z-10 w-full">
                <div className="text-center mb-16 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">
                        Technical <span className="text-purple-400">Skills</span>
                    </h2>
                    <p className="text-purple-400 text-lg max-w-2xl mx-auto">
                        Technologies and tools I use to bring ideas to life
                    </p>
                </div>
                
                {/* Category selector */}
                <div className="flex justify-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-purple-500/20">
                        {Object.keys(skillGroups).map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    activeCategory === category
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                
              {/* Skills grid */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
  <AnimatePresence mode="wait">
    {skillGroups[activeCategory].map((skill, idx) => (
      <motion.div
        key={skill.name} // important for AnimatePresence
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        className="relative group bg-gradient-to-br from-slate-900 to-[#10002B] p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-center text-center"
        onMouseEnter={() => setHoveredSkill(skill.name)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        {/* Hover shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Skill icon */}
        <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <SkillIcon skill={skill.name} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>

        <ProficiencyBar level={skill.level} />

        {/* Skill level tooltip */}
        {hoveredSkill === skill.name && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 bg-slate-800 text-purple-300 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30"
          >
            {skill.level}% Proficiency
          </motion.div>
        )}
      </motion.div>
    ))}
  </AnimatePresence>
</div>

                
                {/* Skills cloud for visual effect */}
                <div className="mt-16 text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="inline-flex flex-wrap justify-center gap-3 p-6 bg-slate-800/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                        {Object.values(skillGroups).flat().map((skill, idx) => (
                            <span 
                                key={idx}
                                className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-purple-300 transition-all duration-300"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skill;