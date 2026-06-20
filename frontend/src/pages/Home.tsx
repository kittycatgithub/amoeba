import HeaderCarousel from '../components/HeaderCarousel'
// import NewsLetter from '../components/NewsLetter'
import RealEstateSearchAdvanced from '../components/RealEstateSearchAdvanced'

const Home = () => {
  return (
    <div className='z-0'>
        <HeaderCarousel/>
        <RealEstateSearchAdvanced/>
        {/* <Services/> */}
        {/* <ServicesSection/> */}
        {/* <NewsLetter /> */}
    </div>
  )
}

export default Home