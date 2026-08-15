import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, numReviews = 0, size = 'sm' }) => {
  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              value >= star
                ? 'fill-amber-400 text-amber-400'
                : value >= star - 0.5
                ? 'fill-amber-200 text-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
      {numReviews > 0 && (
        <span className="text-xs text-slate-500 font-medium ml-1">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default Rating;
