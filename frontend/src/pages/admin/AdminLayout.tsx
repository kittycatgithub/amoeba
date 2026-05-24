import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleList, CiMonitor } from "react-icons/ci";
import { logout } from '../../store/slices/userSlice'
import { PiMoneyWavy, PiUserSwitchLight } from 'react-icons/pi';

const AdminLayout = () => {
    const { setIsAdmin } = useAppContext()

    const sidebarLinks = [
      {name: "Dashboard", path: "/admin", icon: <CiMonitor/>},
      {name: "Add Property", path: "/admin/add-property", icon: <IoIosAddCircleOutline/> },
      {name: "Properties List", path: "/admin/properties-list", icon: <CiCircleList/>},
      {name: "Users", path: "/admin/users", icon: <PiUserSwitchLight/>},
      // {name: "Subscription", path: "/admin/subscriptions", icon: <PiMoneyWavy/>},
      // {name: "", path: "", icon: <BsDash/>},
      // {name: "", path: "", icon: <BsDash/>},
      // {name: "", path: "", icon: <BsDash/>},
      // {name: "", path: "", icon: <BsDash/>},
    ]

  return (
    <>
      <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300
      py-3 bg-white transition-all duration-300'>
        <NavLink to={'/'}>
          <img src="/website/mainlogo.png" alt="Admin Logo" className='w-38'/>
        </NavLink>
        <div className='flex items-center gap-5 text-gray-500'>
          <p>Hi! Power Developer</p>
          <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
        </div>
      </div>
      <div className='flex '>
        <div className='w-16 md:w-64 border-r h-[91vh] text-base border-gray-300 pt-4 flex flex-col
        '>
          { sidebarLinks.map((item)=> (
            <NavLink to={item.path} key={item.name} end={item.path === '/admin'}
            className={({isActive})=> `flex items-center py-3 px-4 gap-3 
            ${ isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
              : "hover:bg-gray-100/90 border-white text-gray-700 "}`}
            >
              <span className='text-xl'>{item.icon}</span>              
              <p className='md:block hidden text-center'>{item.name}</p>
            </NavLink>
          )) }
        </div>
        {/* Outlet - used to display child components in parent component */}
        {/* Outlet - used to display child components in parent component, where child components
        are defined in App.tsx inside Route tags */}
        <Outlet/>
      </div>
    </>
  )
}

export default AdminLayout