'use client';

import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface AchievementsCardProps {
  imageUrl: string | StaticImport;
  title: string;
  description: string;
}

const AchievementsCard = ({ imageUrl, title, description }: AchievementsCardProps) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg max-w-sm">
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
        {typeof imageUrl === 'string' ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-16 h-16"
          />
        ) : (
          <Image 
            src={imageUrl} 
            alt={title} 
            width={64} 
            height={64} 
            className="w-16 h-16"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-white text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default AchievementsCard;