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

const Contact = () => {
  return (
    <section className="min-h-screen py-20 px-4 flex justify-center items-center text-white relative bg-[#10002B] overflow-hidden">
      {/* 3D Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto z-10 w-full text-center"
      >
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4"
          >
            Let's <span className="text-purple-400">Connect</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-purple-400 text-lg max-w-2xl mx-auto"
          >
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </motion.p>
        </div>

        {/* Cards with staggered animation */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {[
            {
              title: "Email",
              text: "Reach out directly",
              link: "mailto:kathirvelan418@gmail.com",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              ),
            },
            {
              title: "LinkedIn",
              text: "Let's connect professionally",
              link: "https://www.linkedin.com/in/kathirvelan-m-ab558125b",
            },
            {
              title: "GitHub",
              text: "Explore my projects",
              link: "https://github.com/Kathirvelan189",
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-900 to-[#10002B] p-8 rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-500 group backdrop-blur-sm"
            >
              <div className="bg-purple-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {card.icon || <circle cx="12" cy="12" r="10" />}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-300 mb-4">{card.text}</p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-white transition-colors font-medium"
              >
                {card.title === "Email" ? "kathirvelan418@gmail.com" : "Connect"}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-br from-slate-900 to-[#10002B] p-8 rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 max-w-2xl mx-auto backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Let's Work Together</h3>
          <p className="text-slate-300 mb-6">
            I'm currently available for freelance work and open to full-time opportunities. 
            If you have a project that you want to get started or think you need my help with something, 
            then get in touch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:kathirvelan418@gmail.com"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/20"
            >
              Send an Email
            </a>
            <a
              href="https://www.linkedin.com/in/kathirvelan-m-ab558125b"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 border border-purple-500/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-purple-600 transform hover:-translate-y-1"
            >
              Connect on LinkedIn
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;