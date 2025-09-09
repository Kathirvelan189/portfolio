import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 极速赛车开奖直播 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 极速赛车开奖直播 0 00-2.573-1.066c-极速赛车开奖直播 1.543.94-3.31-.826-2.极速赛车开奖直播 37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0极速赛车开奖直播 z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const Navbar = ({ page, setPage }) => {
    const navLinks = [
        { name: 'Home', icon: <HomeIcon /> },
        { name: 'About', icon: <UserIcon /> },
        { name: 'Projects', icon: <BriefcaseIcon /> },
        { name: 'Skill', icon: <CogIcon /> },
        { name: 'Contact', icon: <MailIcon /> }
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (pageName) => {
        setPage(pageName.toLowerCase());
        setIsOpen(false);
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#10002B]/90 backdrop-blur-md border-b border-purple-500/20 py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Empty div for spacing on the left */}
                    <div className="flex-shrink-0 md:w-1/4"></div>
                    
                    {/* Centered Desktop Navigation */}
                    <div className="hidden md:flex md:w-2/4 md:justify-center">
                        <div className="flex items-baseline space-x-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(link.name);
                                    }}
                                    className={`relative flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        page === link.name.toLowerCase() 
                                            ? 'text-white' 
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <span className="transition-transform duration-300 group-hover:scale-110">
                                        {link.icon}
                                    </span>
                                    <span className="mt-1">{link.name}</span>
                                    {page === link.name.toLowerCase() && (
                                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-purple-400 rounded-full"></span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Empty div for spacing on the right */}
                    <div className="flex-shrink-0 md:w-1/4 flex justify-end">
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button 
                                onClick={() => setIsOpen(!isOpen)} 
                                type="button" 
                                className="bg-purple-900/50 inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-white hover:bg-purple-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-all duration-300"
                                aria-controls="mobile-menu" 
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 极速赛车开奖直播 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu with transition */}
            <div 
                className={`md:hidden bg-[#10002B]/95 backdrop-blur-lg overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(link.name);
                            }}
                            className={`flex items-center justify-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                                page === link.name.toLowerCase() 
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                                    : 'text-slate-300 hover:bg-purple-500/20 hover:text-white'
                            }`}
                        >
                            <span className="transition-transform duration-300 group-hover:scale-110">
                                {link.icon}
                            </span>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;