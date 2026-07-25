import { NavLink } from "react-router-dom";

const JobSection = () => {
  return (
    <div
      className="bg-cover w-full flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://kikimodev.com/static/media/bgheader.5609055ae782da0be362.webp')",
      }}
    >
      <div className="w-full bg-white md:p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
        <div className="w-12/12 mx-auto rounded-2xl bg-white md:p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="flex flex-wrap items-center overflow-x-auto overflow-y-hidden py-2 justify-center text-gray-800">
            {/* ── Card 1 ── */}
            <div className="flex flex-col md:w-1/2 xl:w-1/2 p-4">
              <div className="bg-white shadow-md rounded-3xl p-4 border border-gray-100">
                <div className="flex-none lg:flex">
                  <div className="h-full w-full md:w-1/2 lg:mb-0 mb-3">
                    <img
                      src="/images/real-estate-family.jpg"
                      alt="RealEstateCard"
                      className="w-full object-cover lg:h-full rounded-2xl"
                    />
                  </div>
                  <div className="flex-auto ml-3 md:w-1/2 justify-evenly py-2">
                    <div className="flex flex-wrap">
                      {/* <div className="w-full flex-none text-xs text-blue-700 font-medium">
                        Our Service
                      </div> */}
                      <h3 className="flex-auto text-lg font-medium pb-2">Property Services</h3>
                    </div>
                    {/* <div className="flex py-4 text-sm text-gray-500">
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p>Nairobi, Kenya</p>
                      </div>
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>Posted 6 month(s) ago</p>
                      </div>
                    </div> */}
                    <div className="flex flex-col pb-4 text-sm text-gray-600">                      
                      <div className="flex-1 inline-flex items-center">                        
                        <ol className="list-disc list-inside">
                            <li>List your property for sale or rent and connect with genuine buyers and tenants.</li>
                            <li>Browse verified residential and commercial properties across your preferred locations.</li>
                        </ol>
                      </div>
                    </div>
                    <div className="flex space-x-3 text-sm font-medium">
                      <NavLink
                        className="mb-2 md:mb-0 bg-white px-4 py-2 shadow-sm tracking-wider border text-gray-600 rounded-full hover:bg-gray-100"
                        to="/add-property"
                        onClick={()=> scrollTo(0,0)}
                      >
                        <span>Post Property</span>
                      </NavLink>
                      <NavLink to="/property-search" onClick={()=> scrollTo(0,0)} className="mb-2 md:mb-0 bg-themeyellow px-5 py-2 shadow-sm tracking-wider text-black rounded-full hover:bg-themeyellow">
                        Explore
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card 2 ── */}
            <div className="flex flex-col md:w-1/2 xl:w-1/2 p-4">
              <div className="bg-white shadow-md rounded-3xl p-4 border border-gray-100">
                <div className="flex-none lg:flex">
                  <div className="h-full w-full lg:h-full md:w-1/2 lg:mb-0 mb-3">
                    <img
                      src="/images/real-estate-jon.jpg"
                      alt="JobCard"
                      className="w-full object-cover lg:h-full rounded-2xl"
                    />
                  </div>
                  <div className="flex-auto ml-3 md:w-1/2 justify-evenly py-2">
                    <div className="flex flex-wrap">
                      {/* <div className="w-full flex-none text-xs text-blue-700 font-medium">
                        Kikimo Developers
                      </div> */} 
                      <h3 className="flex-auto text-lg font-medium pb-2">Job Services</h3>
                    </div>
                    {/* <div className="flex py-4 text-sm text-gray-600">
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p>Nairobi, Kenya</p>
                      </div>
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>Posted 6 month(s) ago</p>
                      </div>
                    </div> */}
                    <div className="flex flex-col pb-4 text-sm text-gray-600">
                      <ol className="list-disc list-inside">
                            <li>Publish real estate job openings and reach qualified professionals across India.</li>
                            <li>Find verified real estate jobs & apply for jobs matching your skills and experience.</li>
                        </ol>
                    </div>
                    <div className="flex space-x-3 text-sm font-medium">
                      <NavLink
                        to="/add-job" onClick={()=> scrollTo(0,0)}
                        className="mb-2 md:mb-0 bg-white px-4 py-2 shadow-sm tracking-wider border text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <span>Post Job</span>
                      </NavLink>
                      <NavLink to='/job-search' onClick={()=> scrollTo(0,0)} className="mb-2 md:mb-0 bg-themeyellow px-5 py-2 shadow-sm tracking-wider text-black rounded-full hover:bg-themeyellow">
                        Explore Jobs
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card 3 ── */}
            {/* <div className="flex flex-col md:w-1/2 xl:w-1/2 p-4">
              <div className="bg-white shadow-md rounded-3xl p-4 border border-gray-100">
                <div className="flex-none lg:flex">
                  <div className="h-full w-full lg:h-full lg:w-full lg:mb-0 mb-3">
                    <img
                      src="https://apis.kikimodev.com/Portfolio/Portfolio_rxL2KTMqyr.png"
                      alt="Work"
                      className="w-full object-cover lg:h-full rounded-2xl"
                    />
                  </div>
                  <div className="flex-auto ml-3 justify-evenly py-2">
                    <div className="flex flex-wrap">
                      <div className="w-full flex-none text-xs text-blue-700 font-medium">
                        Kikimo Developers
                      </div>
                      <h3 className="flex-auto text-lg font-medium">
                        Sightloss Kenya Website with admin panel
                      </h3>
                    </div>
                    <div className="flex py-4 text-sm text-gray-500">
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p>Nairobi, Kenya</p>
                      </div>
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>Posted 6 month(s) ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 text-sm font-medium">
                      <a
                        className="mb-2 md:mb-0 bg-white px-4 py-2 shadow-sm tracking-wider border text-gray-600 rounded-full hover:bg-gray-100"
                        to="/work/34"
                      >
                        <span>#WebDevelopment</span>
                      </a>
                      <button className="mb-2 md:mb-0 bg-red-600 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-gray-800">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* ── Card 4 ── */}
            {/* <div className="flex flex-col md:w-1/2 xl:w-1/2 p-4">
              <div className="bg-white shadow-md rounded-3xl p-4 border border-gray-100">
                <div className="flex-none lg:flex">
                  <div className="h-full w-full lg:h-full lg:w-full lg:mb-0 mb-3">
                    <img
                      src="https://apis.kikimodev.com/Portfolio/Portfolio_TMkWwDcLvo.png"
                      alt="Work"
                      className="w-full object-cover lg:h-full rounded-2xl"
                    />
                  </div>
                  <div className="flex-auto ml-3 justify-evenly py-2">
                    <div className="flex flex-wrap">
                      <div className="w-full flex-none text-xs text-blue-700 font-medium">
                        Kikimo Developers
                      </div>
                      <h3 className="flex-auto text-lg font-medium">
                        Water Management System
                      </h3>
                    </div>
                    <div className="flex py-4 text-sm text-gray-500">
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p>Nairobi, Kenya</p>
                      </div>
                      <div className="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>Posted 6 month(s) ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 text-sm font-medium">                      
                      <a  className="mb-2 md:mb-0 bg-white px-4 py-2 shadow-sm tracking-wider border text-gray-600 rounded-full hover:bg-gray-100"
                        to="/work/33"
                      >
                        <span>#WebDevelopment</span>
                      </a>
                      <button className="mb-2 md:mb-0 bg-red-600 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-gray-800">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSection;