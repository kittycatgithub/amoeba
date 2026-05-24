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
import MySubscriptions from "./pages/MySubscriptions"
import AdminLogin from "./components/superadmin/AdminLogin"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminAddProperty from "./pages/admin/AdminAddProperty"
import PropertiesList from "./pages/admin/PropertiesList"
import Users from "./pages/admin/Users"
import AdminDashboard from "./pages/admin/AdminDashboard"

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin')
  const { showUserLogin, showRegister, showForgotPassword, isAdmin } = useAppContext()
  const isPropertySearch = useLocation().pathname.includes('property-search')

  return (  
    // <div className="text-default min-h-screen text-gray-700 bg-white">
    <div>
      {isAdminPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      {showRegister ? <Register /> : null}
      {showForgotPassword ? <ForgotPassword /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/admin" element={<Services />} /> */}
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

        {/* Subscription Page */}
        <Route path="/my-subscriptions" element={<MySubscriptions/>}/>

        {/* Private Route - because no role involved */}
        <Route path="/admin" element={ isAdmin ? <AdminLayout/> : <AdminLogin/> }>
          {/* index means at route /admin itself */}
          <Route index element={ isAdmin && <AdminDashboard/>}/>
          <Route path="add-property" element={<AdminAddProperty/>}/>
          <Route path="properties-list" element={<PropertiesList/>}/>
          <Route path="users" element={<Users/>}/>
        </Route>
      </Routes>
      {/* { !isPropertySearch && <Footer /> } */}
      { (!isPropertySearch && !isAdminPath) && <Footer /> }
    </div>
  )
}

export default App






