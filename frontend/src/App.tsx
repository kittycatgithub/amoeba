import { Route, Routes, useLocation } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import SearchPage from "./pages/SearchPage"
import Services from "./components/Services"
import PropertyDetails from "./pages/PropertyDetails"
import Home from "./pages/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import ForgotPassword from "./components/ForgotPassword"
import { useAppContext } from "./context/AppContext"
import AddProperty from "./pages/AddProperty"
import EditProperty from "./pages/EditProperty"
import Wishlist from "./pages/Wishlist"
import Shortlisted from "./pages/Shortlisted"
import MyProfile from "./pages/MyProfile"
import Settings from "./pages/Settings"
import ContactPage from "./pages/ContactPage"
import FeedbackPage from "./pages/FeedbackPage"
import MyProperties from "./pages/MyProperties"
import TermsAndConditions from "./pages/TermsAndConditions"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import RefundPolicy from "./pages/RefundPolicy"

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin')
  const { showUserLogin, showRegister, showForgotPassword } = useAppContext()
  const isPropertySearch = useLocation().pathname.includes('property-search')

  return (  
    <div>
      {isAdminPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      {showRegister ? <Register /> : null}
      {showForgotPassword ? <ForgotPassword /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Services />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/shortlisted" element={<Shortlisted />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* My Profile Routes */}
        <Route path="/my-profile" element={<MyProfile />} />

        {/* Property Routes */}
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path='/my-properties' element={<MyProperties/>}/>
        <Route path="/property-search" element={<SearchPage />} />
        <Route path="/property-details/:id" element={<PropertyDetails />} />

        {/* Policy Pages */}
        <Route path="/terms-conditions" element={<TermsAndConditions />}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="/refund-policy" element={<RefundPolicy />}/>
      </Routes>
      { !isPropertySearch && <Footer /> }
    </div>
  )
}

export default App






