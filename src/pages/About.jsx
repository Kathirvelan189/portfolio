import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // ✅ Import motion

// --- 3D Animated Background Component (same as Home.jsx) ---
const AnimatedBackground = () => {
  const mountRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    if (window.THREE) {
      setScriptsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => setScriptsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !mountRef.current) return;

    let scene, camera, renderer, points;
    let animationFrameId;

    scene = new window.THREE.Scene();
    camera = new window.THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
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

    geometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3));

    const material = new window.THREE.PointsMaterial({
      color: 0x9333ea,
      size: 1.5,
      transparent: true,
      opacity: 0.7,
      blending: window.THREE.AdditiveBlending,
    });

    points = new window.THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    };
    document.addEventListener("mousemove", handleMouseMove);

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
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

// SVG Icons
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const About = () => {
  const timelineEvents = [
    { icon: <AcademicCapIcon />, date: "Ongoing", title: "B.Tech in AI & Data Science", description: "Studying at Solamalai College of Engineering, building a strong foundation in machine learning and data analysis." },
    { icon: <BriefcaseIcon />, date: "Completed", title: "Web Development Intern", description: "Honing my React skills and contributing to real-world projects at Fortis Legal Solution." },
    { icon: <CodeIcon />, date: "Completed", title: "Full-Stack Development Bootcamp", description: "Mastered the MERN stack through intensive training at Karam Academy." },
    { icon: <CodeIcon />, date: "Completed", title: "Data Analytics Bootcamp", description: "Gained hands-on experience in data manipulation and visualization with Novitech." },
    { icon: <BriefcaseIcon />, date: "Internship", title: "Nuvolix Software Solution", description: "Applied my skills in a professional environment, contributing to various tech projects." }
  ];

  return (
    <section className="min-h-screen py-20 px-4 flex justify-center items-center text-white relative bg-[#10002B] overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-4xl w-full mx-auto z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-2">
            My Journey
          </h2>
          <p className="text-purple-400 text-lg">
            A timeline of my key experiences and learning milestones.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="text-slate-300 relative border-l-2 border-purple-500/30 ml-3">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              className="mb-10 ml-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <span className="absolute flex items-center justify-center w-8 h-8 bg-slate-800 text-purple-400 rounded-full -left-4 ring-8 ring-slate-900">
                {event.icon}
              </span>
              <h3 className="flex items-center mb-1 text-xl font-semibold text-white">
                {event.title}
                <span className="bg-purple-900 text-purple-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                  {event.date}
                </span>
              </h3>
              <p className="text-base font-normal text-slate-400">
                {event.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
