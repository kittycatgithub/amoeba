export interface Property {
  _id: string;
  title: string;
  category: string;
  price: string;
  priceValue: number;       // numeric price in Lakhs (Buy/Commercial/Plots) or ₹K/month (Rent)
  area: string;
  areaValue: number;        // sq ft as number for filtering
  type: string;             // e.g. 'Residential Apartment', 'Independent House/Villa'
  status: string;           // 'Available' | 'Sold Out' | 'Rented'
  bedrooms: number;
  bathrooms: number;
  furnishing: string;       // 'Furnished' | 'Semifurnished' | 'Unfurnished'
  postedBy: string;         // 'Owner' | 'Builder' | 'Dealer' | 'Feature Dealer'
  availableFor: string[];   // e.g. ['Family', 'Single Men']
  amenities: string[];
  images: string[];
  location: string;
  city: string;
  description: string;
  availability?: string;  // 'Ready to Move' | 'Within 6 Months' | 'Within 1 Year' | 'More Than 1 Year'
}