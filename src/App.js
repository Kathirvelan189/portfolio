import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Skill from './pages/Skill.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
    const [page, setPage] = useState('home');

    const renderPage = () => {
        switch (page) {
            case 'about':
                return <About />;
            case 'projects':
                return <Projects />;
            case 'skill':
                return <Skill />;
            case 'contact':
                return <Contact />;
            case 'home':
            default:
                return <Home setPage={setPage} />;
        }
    };

    return (
        <div className="bg-slate-900 text-slate-300 font-sans">
            <Navbar setPage={setPage} />
            <main>
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}
