'use client';
import { useState } from 'react';

type GalleryImage = {
    src: string;
    alt: string;
};

const images: Record<string, GalleryImage[]> = {
    All: [
        { src: '/shivalik-new-logo.jpg', alt: 'Gallery image 1' },
    ],
    Events: [
        { src: '/shivalik-new-logo.jpg', alt: 'Event image' },
    ],
    Hostel: [
        { src: '/shiva-mess-roof.jpg', alt: 'Hostel image' },
    ],
    Sports: [
        { src: '/shivalik-new-logo.jpg', alt: 'Sports image' },
    ],
};

const categories = ['All', 'Events', 'Hostel', 'Sports'];

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    // If the user selects 'All', show all images from all categories.
    const galleryImages =
        activeCategory === 'All'
            ? [
                  ...images.Events,
                  ...images.Hostel,
                  ...images.Sports,
                  ...images.All,
              ]
            : images[activeCategory];

    return (
        <section id="gallery" className="py-16 bg-gray-50 dark:bg-neutral-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                        Gallery
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A glimpse into life at Shivalik Hostel
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                                activeCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-neutral-900">
                            <div className="aspect-square bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <img 
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <button className="p-2 bg-white rounded-full text-gray-800 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-6 w-6" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;