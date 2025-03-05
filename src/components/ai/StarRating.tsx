
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  max?: number;
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  max = 5 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            className="focus:outline-none"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={`h-8 w-8 ${
                (hoverRating || rating) >= starValue
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
