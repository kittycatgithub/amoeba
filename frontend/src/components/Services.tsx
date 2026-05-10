import { LiaAngleRightSolid } from 'react-icons/lia'

const Services = () => {
  return (
    <section className="max-w-7xl mx-auto py-24 text-themegray">
  <h2 className="mb-4 text-2xl">
    Services Offered By 26Shelters 
  </h2>

  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li><a href="/property-search" data-clickable="Category:20:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Productivity category">
              <img src="/icons/house.png" alt="real-estate" className='h-10 w-10'/>
            </span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Real Estate
            </h3>

            {/* <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    791
                    tools
                </span>
            </div> */}
          </div>

          <div className="flex-shrink-0 ml-4">            
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:5:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Business category">
              <img src="/icons/promotion.png" alt="jobs" className='h-10 w-10'/>
            </span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Jobs
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    Coming Soon
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5 "/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:86:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Content Generation category">
              <img src="/icons/interview.png" alt="hire-professionals" className='h-10 w-10'/>
            </span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Hire Professionals
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    Coming Soon
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:44:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Developer Tools category">
              <img src="/icons/application.png" alt="link-website" className='h-10 w-10'/>
            </span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Link website (For Dealers)
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    Coming Soon
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    {/* <li><a href="" data-clickable="Category:17:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Marketing category">📣</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Marketing
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    409
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:11:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Education category">🎓</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Education
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    270
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:42:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Image Generator category">🖌️</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Image Generator
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    268
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:8:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Data Analysis category">📊</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Data Analysis
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    247
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:9:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Design category">🎨</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Design
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    228
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:55:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Customer Support category">🙋</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Customer Support
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    228
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:28:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Writing category">✍️</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Writing
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    180
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li>
    <li><a href="" data-clickable="Category:57:category-card"
        className="block h-full transition-all duration-200 bg-white border border-gray-200 rounded group hover:shadow-lg hover:border-primary hover:ring-1 hover:ring-green-500/20">
        <div className="flex items-center p-6">
          <div
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-colors duration-200 rounded bg-green-50 group-hover:bg-green-100">
            <span className="text-4xl" role="img" aria-label="Education Assistant category">🍎</span>
          </div>

          <div className="flex-grow ml-6">
            <h3
              className="text-lg font-semibold  transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              Education Assistant
            </h3>

            <div className="inline-flex items-center mt-1">
              <span className="text-gray-600 rounded">
                    173
                    tools
                </span>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <LiaAngleRightSolid className="w-5 h-5"/>
          </div>
        </div>
      </a>
    </li> */}
  </ul>

  {/* <div className="flex justify-end mt-6 text-center">
    <a href="https://eliteai.tools/category"
      className="inline-flex items-center px-3 py-1 font-medium border rounded text-green-600 border-green-600 hover:bg-green-50">
      View all
      <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" aria-hidden="true" data-slot="icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
      </svg> </a>
  </div> */}
</section>
  )
}

export default Services