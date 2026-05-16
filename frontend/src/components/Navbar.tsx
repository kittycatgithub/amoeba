import React, { useEffect, useRef, useState } from "react";
import { IoHeartOutline } from "react-icons/io5";
import { RiMenu3Fill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import {
  FiHeart,
  FiHome,
  FiMessageSquare,
  FiPlusCircle,
  FiSettings,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { MdClose, MdEmail, MdOutlineFeaturedPlayList } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
import { useAppSelector } from "../store/hooks";

const Navbar = () => {
  const { user, userProfile, logout, setShowUserLogin, navigate } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const wishlisted = useAppSelector(state => state.wishlist.ids ?? []); // ✅ direct from slice

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout is provided by AppContext (dispatches Redux logout action)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between w-full p-2 font-medium text-sm text-white  text-center bg-primary ">
        <div className="flex justify-between gap-1">
          <Link
            to="mailto:hostcloudrcs@gmail.com"
            className="flex items-center gap-1"
          >
            <MdEmail className="text-white" />
            hostcloudrcs@gmail.com
          </Link>
          <Link to="tel:+918956127940" className="flex items-center gap-1">
            | <FaPhoneAlt className="text-white" />
            +91 8421946550
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <BsClockFill className="text-white h-3.5" />
            Support Open Everyday - 10AM - 7PM
          </div>
          {/* <Link to={""} className="flex items-center gap-1">
                        <BsClockFill className="text-white h-3.5" />
              
            </Link> */}
        </div>
      </div>
      {/* <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all"> */}
      <nav className="flex items-center justify-between px-3 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <NavLink to={"/"}>
         <img src="/website/mainlogo.png" className="h-12 md:h-16"/>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-5 text-lg">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/property-search"}>Properties</NavLink>
          <NavLink to={"/my-properties"}>My Properties</NavLink>
          <NavLink to={"/contact"}>Contact</NavLink>

          {/* <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <BiSearch className="text-xl text-gray-400" />
          </div> */}

          {/* <div className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">3</button>
                </div> */}
          {/* <button className="group relative cursor-pointer overflow-hidden whitespace-nowrap p-3 text-white bg-green-600 rounded-full transition-all duration-300 hover:scale-108 flex justify-center" style={{ "--spread": "90deg", "--shimmer-color": "#ffffff", "--radius": "100px", "--speed": "2s", "--cut": "0.1em" } as React.CSSProperties}><div className="absolute inset-0 overflow-hidden"><div className="absolute inset-[-100%] animate-[spin_var(--speed)_linear_infinite]"><div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))]"></div></div></div><div className="absolute bg-green-600 rounded-full [inset:var(--cut)]"></div><span className="z-10 whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm font-semibold leading-none tracking-tight text-white">Post Property Free</span></button> */}
          
          <NavLink to="/wishlist" className="relative cursor-pointer">
            <IoHeartOutline className="text-2xl text-themered-dull" />
            <button className="absolute -top-2 -right-2 text-xs text-white bg-themered-dull w-[18px] h-[18px] rounded-full">
              {wishlisted?.length}
            </button>
          </NavLink>
          <button
            onClick={() => {
              if (user) {
                navigate("/add-property");
              } else {
                setShowUserLogin(true);
              }
            }}
            // className="group relative cursor-pointer overflow-hidden whitespace-nowrap p-3 text-white bg-primary-dull rounded-full transition-all duration-300 hover:scale-108 flex justify-center"
            className="group relative cursor-pointer overflow-hidden whitespace-nowrap p-2 text-white bg-primary rounded-full transition-all duration-300 hover:scale-108 flex justify-center"
            style={
              {
                "--spread": "90deg",
                "--shimmer-color": "#ffffff",
                "--radius": "100px",
                "--speed": "2s",
                "--cut": "0.1em",
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_var(--speed)_linear_infinite]">
                <div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))]"></div>
              </div>
            </div>
            <div className="absolute bg-primary rounded-full [inset:var(--cut)]"></div>
            <span className="z-10 whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-base leading-none tracking-tight text-white">
              Post Property Free
            </span>
          </button>
          <div className="relative">
            {/* USER BUTTON / PROFILE */}
            {!user ? (
              <button
                // onClick={() => setIsOpen(true)}
                onClick={() => {
                  setShowUserLogin(true);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-6 py-0.5 hover:bg-primary text-base text-black hover:text-white rounded-full border-2 border-primary  transition-all duration-300 hover:scale-108"
              >
                Login
              </button>
            ) : (
              <div
                onClick={() => setIsOpen(true)}
                className="bg-primary/10 rounded-full pr-4 cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={assets.profile_icon}
                    alt="profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <p>{userProfile?.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* MOBILE & TABLET MENU BUTTON + PROFILE */}
        {/*
        visible on mobile and tablet (up to lg breakpoint).  Desktop has its own
        profile/login button which also toggles the drawer, so we hide this
        block on large screens to avoid duplication.
      */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* profile preview */}
          {/* {user && (
          <div className="flex items-center gap-2 bg-primary/10 pr-2 rounded-full" onClick={() => setIsOpen(true)}>
            <img
              src={assets.profile_icon}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">Riya</span>
          </div>
        )} */}

          {/* hamburger (always shown alongside the profile on smaller screens) */}
          <button onClick={() => setIsOpen(true)} aria-label="Menu">
            {/* <MdMenu className="text-4xl" /> */}
            <RiMenu3Fill className="text-3xl" />
          </button>
        </div>

        {/* overlay & drawer always present so mobile toggle works */}
        {/* OVERLAY */}
        <div
          className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        />

        {/* DRAWER */}
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between p-6 border-b">
            <h2 className="text-xl">
              {user ? (userProfile?.name ?? "My Account") : "Welcome"}
            </h2>
            <button onClick={()=> setIsOpen(false)}>
              <MdClose className="text-2xl"/>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col p-4 gap-1 text-gray-700">
            {user && (
              <>
                <NavLink
                  to="/add-property"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiPlusCircle />
                  </span>
                  <span className="font-medium">Add Property</span>
                </NavLink>
                <NavLink
                  to="/my-properties"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    {/* <FiPlusCircle /> */}
                    <MdOutlineFeaturedPlayList />
                  </span>
                  <span className="font-medium">My Properties</span>
                </NavLink>
                <NavLink
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiHeart />
                  </span>
                  <span className="font-medium">Wishlist</span>
                  {wishlisted?.length > 0 && (
                    <span className="ml-auto text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlisted.length}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/shortlisted"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiHome />
                  </span>
                  <span className="font-medium">Shortlisted</span>
                </NavLink>
                <NavLink
                  to="/my-profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiUser />
                  </span>
                  <span className="font-medium">My Profile</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiSettings />
                  </span>
                  <span className="font-medium">Settings</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiMessageSquare />
                  </span>
                  <span className="font-medium">Contact Us</span>
                </NavLink>
                <NavLink
                  to="/feedback"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiStar />
                  </span>
                  <span className="font-medium">Feedback</span>
                </NavLink>
                <button
                  className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary transition text-white rounded-full"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <ul className="space-y-4 ">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiHome />
                  </span>
                  <span className="font-medium">Home</span>
                </NavLink>
                {/* <NavLink
                  to="/my-properties"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiPlusCircle />
                  </span>
                  <span className="font-medium">My Properties</span>
                </NavLink> */}
                {/* <NavLink
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiHeart />
                  </span>
                  <span className="font-medium">Saved Listings</span>
                </NavLink> */}
                <NavLink
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiMessageSquare />
                  </span>
                  <span className="font-medium">Contact Us</span>
                </NavLink>
                <NavLink
                  to="/feedback"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-lg">
                    <FiStar />
                  </span>
                  <span className="font-medium">Feedback</span>
                </NavLink>
                <button
                  className="w-full cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary transition text-white rounded-full"
                  onClick={() => {
                    setIsOpen(false);
                    setShowUserLogin(true);
                  }}
                >
                  Login
                </button>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
