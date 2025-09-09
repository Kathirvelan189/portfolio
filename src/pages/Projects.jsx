import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import framer-motion

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

// --- SVG Icons ---
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Project Modal with Transition ---
const ProjectModal = ({ project, onClose }) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 to-[#10002B] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-purple-500/20"
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 relative">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10002B] via-transparent to-transparent opacity-80"></div>
            </div>
            <div className="p-8 flex flex-col overflow-y-auto w-full md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-black text-white">{project.title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <CloseIcon />
                </button>
              </div>
              <p className="text-slate-300 mb-6 flex-grow">{project.detailedDescription}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((techItem, idx) => (
                  <span key={idx} className="bg-purple-900/70 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">{techItem}</span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold transition-all duration-300 self-start hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/20"
              >
                <GithubIcon />
                <span className="ml-2">View on GitHub</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projectData = [
    {
      title: "Face Recognition AI",
      description: "A real-time face recognition system using OpenCV and Python.",
      detailedDescription:
        "This project implements a real-time face recognition system capable of detecting and identifying individuals from a live webcam stream...",
      tech: ["Python", "OpenCV", "Face Recognition", "NumPy"],
      link: "https://github.com/Kathirvelan189/Face-Racognition",
      imageUrl: "https://placehold.co/600x400/6d28d9/ede9fe?text=AI+Project",
    },
    {
      title: "COVID-19 Analysis",
      description: "A machine learning model to predict future COVID-19 cases.",
      detailedDescription:
        "This data analysis project involved building a predictive model to forecast future COVID-19 cases...",
      tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
      link: "https://github.com/Kathirvelan189/covid-19-Analysis",
      imageUrl: "https://placehold.co/600x400/6d28d9/ede9fe?text=Data+Analysis",
    },
    {
      title: "Portfolio Website",
      description: "Designed and built this personal portfolio using React and Tailwind.",
      detailedDescription:
        "My personal portfolio, the site you are currently on, was designed and developed from scratch...",
      tech: ["React", "Tailwind CSS", "JavaScript", "Three.js"],
      link: "https://github.com/Kathirvelan189/",
      imageUrl: "https://placehold.co/600x400/6d28d9/ede9fe?text=Portfolio",
    },
  ];

  return (
    <>
      <section className="min-h-screen py-20 px-4 flex justify-center items-center text-white relative bg-[#10002B] overflow-hidden">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto z-10 w-full">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">
              My Projects
            </h2>
            <p className="text-purple-400 text-lg max-w-2xl mx-auto">
              A selection of my recent work. Click a card to explore each project in detail.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectData.map((project, index) => (
              <motion.div
                key={index}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-gradient-to-br from-slate-900 to-[#10002B] rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg cursor-pointer"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <div
                  className="h-48 w-full transition-all duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${project.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((techItem, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-900/50 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30"
                      >
                        {techItem}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="bg-slate-800 text-slate-400 text-xs font-semibold px-3 py-1 rounded-full">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default Projects;
