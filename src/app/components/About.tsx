'use client';

const About = () => {
    return (
        <section id="about" className="py-16 bg-neutral-900">
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                        About Shivalik Hostel
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A home away from home for students at IIT Delhi
                    </p>
                </div>
                
                {/* About content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left side: Image */}
                    <div className="rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
                        <img 
                            src="/shivalik-new-logo-removed-bg.png" 
                            alt="Shivalik Hostel Building" 
                            className="w-full h-auto object-cover" 
                        />
                    </div>
                    
                    {/* Right side: Content */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Our Legacy
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Established in 1961, Shivalik Hostel has been a cornerstone of student life at IIT Delhi for decades. Our hostel provides a nurturing environment where academic excellence meets vibrant community living.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Named after the majestic Shivalik range, our hostel embodies strength, stability, and grandeur - qualities we aim to instill in every resident.
                        </p>
                        
                        {/* Key features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <svg 
                                        className="w-5 h-5 text-purple-600" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </div>
                                <p className="ml-3 text-gray-600 dark:text-gray-300">Modern Facilities</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <svg 
                                        className="w-5 h-5 text-purple-600" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </div>
                                <p className="ml-3 text-gray-600 dark:text-gray-300">Supportive Community</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <svg 
                                        className="w-5 h-5 text-purple-600" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </div>
                                <p className="ml-3 text-gray-600 dark:text-gray-300">Rich Cultural Activities</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <svg 
                                        className="w-5 h-5 text-purple-600" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </div>
                                <p className="ml-3 text-gray-600 dark:text-gray-300">Sporting Excellence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;