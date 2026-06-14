// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  platform: string;
  url: string;
}


interface Owner {
  name: string;
  email?: string;
  role?: string;
  phone?: string;
  avatar?: string;
}

interface PosterInfo {
  name: string;
  role: string;
  agency: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  totalReviews: number;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  profileUrl: string;
  location: string;
  memberSince: string;
  bio: string;
  activeListings: number;
  dealsClosed: number;
  experience: number;
  languages: string[];
  specialisations: string[];
  socialLinks: SocialLink[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const POSTER_DATA: PosterInfo = {
  name: "Rajesh Sharma",
  role: "Senior Real Estate Consultant",
  agency: "RE/MAX Nagpur",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  isVerified: true,
  isOnline: true,
  rating: 4.2,
  totalReviews: 87,
  phone: "+91 98765 43210",
  email: "rajesh.sharma@remax.in",
  whatsapp: "919876543210",
  website: "https://rajeshsrealtyworks.in",
  profileUrl: "/user/rajesh-sharma",
  location: "Dharampeth, Nagpur, Maharashtra",
  memberSince: "March 2021",
  bio: "Specialising in residential and commercial properties across Nagpur for over a decade. I believe in transparent dealings, timely communication, and helping clients find spaces they truly love — not just a property that fits a budget.",
  activeListings: 38,
  dealsClosed: 200,
  experience: 10,
  languages: ["Hindi", "English", "Marathi"],
  specialisations: ["Residential", "Commercial", "Plots & Land"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/rajesh-sharma" },
    { platform: "Instagram", url: "https://instagram.com/rajeshrealty" },
  ],
};

// ─── Helper: Render star rating ───────────────────────────────────────────────

// function StarRating({ rating, total }: { rating: number; total: number }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <svg
//             key={star}
//             className="w-3.5 h-3.5"
//             viewBox="0 0 14 14"
//             fill={star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
//           >
//             <polygon points="7,1 8.8,5.2 13.4,5.6 10,8.6 11.1,13.1 7,10.6 2.9,13.1 4,8.6 0.6,5.6 5.2,5.2" />
//           </svg>
//         ))}
//       </div>
//       <span className="text-sm text-gray-500 dark:text-gray-400">
//         {rating} · {total} reviews
//       </span>
//     </div>
//   );
// }

// ─── Helper: Stat card ────────────────────────────────────────────────────────

// function StatCard({
//   value,
//   label,
// }: {
//   value: string | number;
//   label: string;
// }) {
//   return (
//     <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl py-4 px-2 text-center">
//       <span className="text-2xl font-semibold text-gray-900 dark:text-white">
//         {value}
//       </span>
//       <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//         {label}
//       </span>
//     </div>
//   );
// }

// ─── Helper: Detail row ───────────────────────────────────────────────────────

// function DetailRow({
//   icon,
//   label,
//   value,
//   isLink,
//   href,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   isLink?: boolean;
//   href?: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       {/* Icon box */}
//       <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-0.5">
//         {icon}
//       </div>

//       <div className="min-w-0">
//         <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
//           {label}
//         </p>
//         {isLink && href ? (
//           <a
//             href={href}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
//           >
//             {value}
//           </a>
//         ) : (
//           <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
//             {value}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyPosterInfo({ owner }: { owner?: Owner }) {
   const poster = {
    ...POSTER_DATA,                          // keep all the static fields (rating, bio, etc.)
    name: owner?.name ?? POSTER_DATA.name,
    email: owner?.email ?? POSTER_DATA.email,
    role: owner?.role ?? POSTER_DATA.role,
    phone: owner?.phone ?? POSTER_DATA.phone,
    avatar: owner?.avatar ?? POSTER_DATA.avatar,
  };

  // const [avatarError, setAvatarError] = useState(false);

  // Initials fallback when avatar fails to load
  // const initials = poster.name
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase();

  return (
    <section className="border-t border-gray-200 dark:border-gray-700 pt-8 bg-white pb-16">
      {/* Section heading */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 px-5">
        Posted by
      </h2>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">

        {/* ── Top header: avatar + name + badges ── */}
        <div className="bg-gray-50 dark:bg-gray-800 px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700">

          {/* Avatar with online dot */}
          <div className="relative flex-shrink-0 self-start sm:self-center">
            {/* {!avatarError ? (
              <img
                src={poster.avatar}
                alt={poster.name}
                onError={() => setAvatarError(true)}
                className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xl font-semibold text-indigo-700 dark:text-indigo-300 border-2 border-white dark:border-gray-700">
                {initials}
              </div>
            )} */}

            {/* Online indicator */}
            {/* {poster.isOnline && (
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            )} */}
          </div>

          {/* Name, role, rating */}
          <div className="flex-1 min-w-0">
            {/* Name + verified */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {poster.name}
              </h3>

              {poster.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                  {/* Checkmark icon */}
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            {/* Role · Agency */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{poster.role}</p>
  
            {/* <StarRating rating={poster.rating} total={poster.totalReviews} /> */}
          </div>
        </div>

        {/* ── Body ── */}
        {/* <div className="px-5 py-5 space-y-6"> */}
        <div>

          {/* Stats row */}
          {/* <div className="grid grid-cols-3 gap-3">
            <StatCard value={poster.activeListings} label="Active listings" />
            <StatCard value={`${poster.dealsClosed}+`} label="Deals closed" />
            <StatCard value={`${poster.experience} yrs`} label="Experience" />
          </div> */}

          {/* Bio */}
          {/* <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
            {poster.bio}
          </p> */}

          {/* Contact details grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <DetailRow
              label="Phone"
              value={poster.phone}
              href={`tel:${poster.phone}`}
              isLink
              icon={
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L7.78 9.3a11 11 0 005.01 4.99l1.3-1.32a1 1 0 011.02-.23l3.3 1.1a1 1 0 01.68.95V17a2 2 0 01-2 2C7.16 19 1 12.84 1 5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            />

            <DetailRow
              label="Email"
              value={poster.email}
              href={`mailto:${poster.email}`}
              isLink
              icon={
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <DetailRow
              label="Location"
              value={poster.location}
              icon={
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <DetailRow
              label="Member since"
              value={poster.memberSince}
              icon={
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
          </div> */}

          {/* Languages */}
          {/* <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              Languages spoken
            </p>
            <div className="flex flex-wrap gap-2">
              {poster.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div> */}

          {/* Specialisations */}
          {/* <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              Specialises in
            </p>
            <div className="flex flex-wrap gap-2">
              {poster.specialisations.map((spec) => (
                <span
                  key={spec}
                  className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div> */}

          {/* ── Action buttons ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">

            {/* View profile */}
            {/* <a
              href={poster.profileUrl}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              View profile
            </a> */}

            {/* Visit website */}
            {/* <a
              href={poster.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 10h16M10 2c-2 2-3 5-3 8s1 6 3 8M10 2c2 2 3 5 3 8s-1 6-3 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Visit website
            </a> */}

            {/* WhatsApp — primary CTA */}
            {/* <a
              href={`https://wa.me/${poster.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C5.58 2 2 5.58 2 10c0 1.49.4 2.88 1.09 4.09L2 18l4.05-1.06A8 8 0 1010 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7.5 8.5c.28.56.7 1.2 1.25 1.75.55.55 1.19.97 1.75 1.25.5-.25.9-.65 1.25-1.25l-1.5-1-.75.5-.5-.25c-.33-.17-.67-.46-1-.75l-.25-.5.5-.75-1-1.5c-.6.35-1 .75-1.25 1.25l.5.25z" fill="white" />
              </svg>
              WhatsApp
            </a> */}
          </div>

        </div>
      </div>
    </section>
  );
}