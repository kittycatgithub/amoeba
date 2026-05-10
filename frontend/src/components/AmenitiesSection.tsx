import { memo } from "react";
import { FaWifi, FaTv, FaUtensils, FaSnowflake, FaParking, FaSwimmingPool, FaShower, FaBed, FaDog, FaCoffee } from "react-icons/fa";

interface AmenitiesItem {
  icon: any;
  label: string;
  desc: string;
}

interface AmenityCategory {
  category: string;
  items: AmenitiesItem[];
}

const AmenitiesSection = memo(({ selectedAmenities }: { selectedAmenities?: string[] }) => {
  // Map property amenity strings to the icon-based display items
  const amenityIconMap: Record<string, any> = {
    'Wifi': FaWifi, 'Swimming Pool': FaSwimmingPool, 'Parking': FaParking,
    'AC Room': FaSnowflake, 'Pet Friendly': FaDog,
  };

  // If specific amenities are passed, display them as flat chips
  if (selectedAmenities && selectedAmenities.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedAmenities.map(amenity => {
          const Icon = amenityIconMap[amenity];
          return (
            <div key={amenity} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-sm text-black">
              {/* {Icon && <Icon size={13} />} */}
              {amenity}
            </div>
          );
        })}
      </div>
    );
  }

  const amenitiesData: AmenityCategory[] = [
    {
      category: "Bedroom & Bathroom",
      items: [
        { icon: FaBed, label: "Comfortable Bed", desc: "Queen size with premium bedding" },
        { icon: FaShower, label: "Hot Water Shower", desc: "24/7 hot water facility" },
      ],
    },
    {
      category: "Entertainment",
      items: [
        { icon: FaTv, label: "Smart TV", desc: "65\" 4K entertainment" },
        { icon: FaWifi, label: "High Speed WiFi", desc: "100 Mbps broadband" },
      ],
    },
    {
      category: "Comfort & Climate",
      items: [
        { icon: FaSnowflake, label: "Air Conditioning", desc: "Central AC throughout" },
        { icon: FaCoffee, label: "Coffee Maker", desc: "Brews your perfect cup" },
      ],
    },
    {
      category: "Facilities",
      items: [
        { icon: FaUtensils, label: "Full Kitchen", desc: "Equipped with appliances" },
        { icon: FaParking, label: "Free Parking", desc: "Dedicated parking space" },
      ],
    },
    {
      category: "Recreation & Policies",
      items: [
        { icon: FaSwimmingPool, label: "Swimming Pool", desc: "Olympic size pool" },
        { icon: FaDog, label: "Pet Friendly", desc: "Pets welcome with fee" },
      ],
    },
  ];

  return (
    <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Amenities</h2>
      <div className="space-y-6">
        {amenitiesData.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold mb-3 text-blue-600 uppercase tracking-wide">
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item, itemIdx) => {
                const IconComponent = item.icon;
                return (
                  <div key={itemIdx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:bg-blue-100 transition">
                    <IconComponent className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

AmenitiesSection.displayName = "AmenitiesSection";

export default AmenitiesSection;
