const NewsLetter = () => {
  return (
    <div className="flex justify-center py-6 bg-gray-50">
      <div className="flex md:flex-row flex-col border border-gray-500/20 rounded-2xl items-start md:items-center justify-between gap-8 text-sm max-w-6xl bg-white p-8 md:p-10 shadow-sm">

        {/* Left Section */}
        <div className="max-w-lg w-full">
          <h1 className="text-2xl font-semibold text-gray-800 leading-tight">
            Stay Updated with New Properties & Smart Features
          </h1>

          <p className="text-gray-500 mt-3 leading-6">
            Get instant alerts for newly listed properties, price drops,
            verified owners, AI-powered property recommendations, home loan
            updates, & upcoming real estate features designed to help you
            buy, rent, or invest smarter & beyond.
          </p>

          <div className="flex items-center gap-4 mt-8 flex-col sm:flex-row">
            <input
              className="py-3 px-4 w-full outline-none focus:border-indigo-500/60 transition border border-gray-300 rounded-lg"
              type="email"
              placeholder="Enter your email address"
            />

            <button className="bg-indigo-600 hover:bg-indigo-700 transition-all px-7 py-3 rounded-lg text-white font-medium whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Feature 1 */}
        <div className="space-y-4 md:max-w-56">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 w-max p-3 rounded-xl">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 20.167H9.167c-3.457 0-5.186 0-6.26-1.074s-1.074-2.802-1.074-6.26V11c0-3.457 0-5.185 1.074-6.26 1.074-1.073 2.803-1.073 6.26-1.073h3.667c3.456 0 5.185 0 6.259 1.074s1.074 2.802 1.074 6.26v1.833c0 3.457 0 5.185-1.074 6.259-.599.599-1.401.864-2.593.981M6.417 3.667V2.292m9.167 1.375V2.292m4.125 5.958H9.854m-8.02 0h3.552"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-gray-800">
              Instant Property Alerts
            </h3>
          </div>

          <p className="text-gray-500 leading-6">
            Be the first to know about new listings, price reductions,
            trending locations, rental opportunities, and premium projects in
            your preferred area.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="space-y-4 md:max-w-56">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 w-max p-3 rounded-xl">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 3.208v6.875-5.958a1.375 1.375 0 1 1 2.75 0v5.958-3.208a1.375 1.375 0 1 1 2.75 0v7.791a5.5 5.5 0 0 1-5.5 5.5H11.8a5.5 5.5 0 0 1-3.76-1.486l-4.546-4.261a1.594 1.594 0 1 1 2.218-2.291l1.623 1.623V5.958a1.375 1.375 0 1 1 2.75 0v4.125-6.875a1.375 1.375 0 1 1 2.75 0"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-gray-800">
              Smart Real Estate Updates
            </h3>
          </div>

          <p className="text-gray-500 leading-6">
            Receive updates about verified listings, AI recommendations,
            upcoming portal features, home loan tools, market insights, and
            safer property transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;