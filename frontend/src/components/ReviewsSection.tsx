import { memo } from "react";
import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const ReviewsSection = memo(() => {
  const reviews: Review[] = [
    {
      id: 1,
      author: "Rahul Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "Amazing property! Very clean and well-maintained. Perfect location. Will definitely visit again!",
      verified: true,
    },
    {
      id: 2,
      author: "Priya Verma",
      rating: 4,
      date: "1 month ago",
      comment: "Great experience overall. The amenities are top-notch. Can improve on the WiFi speed a bit.",
      verified: true,
    },
    {
      id: 3,
      author: "Amit Kumar",
      rating: 5,
      date: "1 month ago",
      comment: "Fantastic stay! The host is very cooperative. The pool and gym facilities are excellent.",
      verified: true,
    },
    {
      id: 4,
      author: "Neha Gupta",
      rating: 4,
      date: "2 months ago",
      comment: "Good value for money. Clean rooms and friendly staff. Everything as expected.",
      verified: false,
    },
  ];

  return (
    <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Guest Reviews</h2>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          See all reviews
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  {review.verified && (
                    <MdVerified className="text-green-600" size={16} />
                  )}
                </div>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;
