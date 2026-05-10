import HeaderCarousel from '../components/HeaderCarousel'
import RealEstateSearch from '../components/RealEstateSearch'
import RealEstateSearchAdvanced from '../components/RealEstateSearchAdvanced'
import Services from '../components/Services'
import ServicesSection from '../components/ServicesSection'

const Home = () => {
  return (
    <div className='z-0'>
        <HeaderCarousel/>
        <RealEstateSearchAdvanced/>
        {/* <Services/> */}
        {/* <ServicesSection/> */}
    </div>
  )
}

export default Home