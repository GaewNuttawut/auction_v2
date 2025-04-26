'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo } from 'react-icons/fa'
import { colors } from '@mui/material';

const API_URL = "http://localhost:3111/api/v1";

const categories = [
  { key: "chair", name: "Chair" },
  { key: "sofas_and_armchairs", name: "Sofas and armchairs" },
  { key: "table", name: "Table" },
  { key: "cupboard", name: "Cupboard" },
  { key: "bad", name: "Bad" },
  { key: "counter", name: "Counter" },
  { key: "office_furniture", name: "Office furniture" },
  { key: "Kitchenware_and_freezer", name: "Kitchenware and freezer" },
  { key: "door", name: "Door" },
  { key: "home_decoration", name: "Home decoration" },
];

const NavbarCustomer = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // เพิ่ม state สำหรับ token
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile', {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้');

        const data = await response.json();
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const res = await fetch('http://localhost:3111/api/v1/profile/image', { 
          credentials: 'include'
        });

        // if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ");

        const data = await res.json();
        setProfileImage(data.image); // ใช้ Base64 Image
      } catch (err) {
        console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err);
      }
    };

    fetchProfile();
    fetchProfileImage();
  }, [refresh]); // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

  useEffect(() => {
    // Fetch user and token from local storage or API
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    setUser(storedUser);
    setToken(storedToken);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
        method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
        credentials: 'include', // ส่ง cookies ไปกับ request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logged out successfully');
        // ลบ session หรือรีเฟรชหน้า
        window.location.href = '/';
      } else {
        console.error('Failed to log out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user);
          setToken(session.accessToken); // เก็บ token จาก session
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    checkSession();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
    // Add new state for expanded view
    const [showAllNotifications, setShowAllNotifications] = useState(false)
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
          setNotificationOpen(false)
        }
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false)
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    const [categories, setCategories] = useState([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const categoriesRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
          setCategoriesOpen(false);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch('http://localhost:3111/api/v1/auction/categories', {
            credentials: 'include'
          });
    
          if (!response.ok) throw new Error('Failed to fetch categories');
    
          const data = await response.json();
          setCategories(data.categories);
        } catch (err) {
          console.error('Error fetching categories:', err);
        }
      };
    
      fetchCategories();
    }, []);

    const handleCategoryClick = (categories) => {
      setSearchText(categories);
      setCategoriesOpen(false);
      // Fetch items from the backend based on the selected category
      fetchItemsByCategory(categories);
    };
    
    const fetchItemsByCategory = async (categories) => {
      try {
        const response = await fetch(`http://localhost:3111/api/v1/auction/categories=${categories}`, {
          credentials: 'include'
        });
    
        if (!response.ok) throw new Error('Failed to fetch items');
    
        const data = await response.json();
        // Update state with fetched items
        setItems(data.items);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    const handleSearch = async (query) => {
      try {
        const response = await fetch(`http://localhost:3111/api/v1/search?query=${query}`, {
          credentials: 'include'
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch search results: ${errorData.message}`);
        }
    
        const data = await response.json();
        setSearchResults(data.results);
      } catch (err) {
        console.error('Error fetching search results:', err);
      }
    };

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_URL}/auction/notifications`, { credentials: 'include' });
          const data = await response.json();
          if (data.status === 'success') {
            setNotifications(data.data);
            setUnreadCount(data.data.filter(n => !n.read).length);
          }
        } catch (err) {
          console.error("Error fetching notifications", err);
        }
      };
  
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
          setNotificationOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const markAllAsRead = async () => {
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      await fetch(`${API_URL}/auction/notifications/read-all`, {
        method: "POST",
        credentials: 'include'
      });
    };

    const handleNotificationClick = (notification) => {
      if (notification.type === 'time_warning' || notification.type === 'auction_end') {
        // Navigate to the auction page
        router.push(`/page/bid/${notification.auction.id}`);
      } else if (notification.type === 'auction_won') {
        // Navigate to the payment page
        router.push(`/page/payment/${notification.auctionId}`);
      } else if (notification.type === 'higher_bid') {
        // Navigate to the auction page for higher bid
        router.push(`/page/bid/${notification.auctionId}`);
      } else {
        // Default navigation (if any)
        router.push(`/page/bid/${notification.id}`);
      }
    };

      useEffect(() => {
        if (searchText.trim() === "") {
          setSearchResults([]);
          setHasSearched(false);
          return;
        }
    
        const timer = setTimeout(() => {
          fetchSearchResults();
        }, 300);
    
        return () => clearTimeout(timer);
      }, [searchText]);
    
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`${API_URL}/auction/search?name=${encodeURIComponent(searchText)}`);
          const data = await response.json();
    
          if (data.status === "success") {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
          setHasSearched(true);
        } catch (error) {
          console.error("❌ เกิดข้อผิดพลาดในการค้นหา:", error);
          setSearchResults([]);
          setHasSearched(true);
        }
      };
    

  return (
    <nav className="bg-white p-2 w-full fixed top-0 left-0 right-0 rounded-bl-lg rounded-br-lg shadow-lg z-10  bg-opacity-50 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex space-x-5 p-2">
          <div className="flex space-x-5 pl-2">
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none hover:text-yellow-400 hover:scale-125">
                <span className="text-2xl font-medium mr-2">{profile?.name || 'ไม่ระบุ'}</span> 
                {profileImage ? (
                  <img
                    src={profileImage || "/image/profile1.jpg"}
                    alt="Profile"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </div>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link href="/page/homepage" legacyBehavior>
                    <a className="flex items-center justify-center px-4 py-2 text-black hover:bg-gradient-to-tr from-yellow-500 to-red-400 hover:text-white rounded-lg">
                      Home🏠
                    </a>
                  </Link>
                  <Link href="/page/profile" legacyBehavior>
                    <a className="flex items-center justify-center px-4 py-2 text-black hover:bg-gradient-to-tr from-yellow-500 to-red-400 hover:text-white rounded-lg">
                      Account🪪
                    </a>
                  </Link>
                  <Link href="/page/address" legacyBehavior>
                    <a className="flex items-center justify-center px-4 py-2 text-black hover:bg-gradient-to-tr from-yellow-500 to-red-400 hover:text-white rounded-lg">
                      Adress📍
                    </a>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-2 text-black hover:bg-red-800 hover:text-white rounded-lg"
                  >
                    Logout☺️
                  </button>
                </div>
              )}
              {/* <span className="text-base font-medium ml-2 text-2xl">{profile?.name || 'ไม่ระบุ'}</span> */}
            </div>
            <Link href="/page/homepage" legacyBehavior>
              <a className="text-black pl-6 text-3xl md:text-4xl font-bold hover:text-yellow-400 hover:scale-125 underline decoration-double">NutKan</a>
            </Link>

            {/* <div className='bg-gradient-to-tr from-yellow-400 to-red-300 px-3 rounded-full flex items-center hover:bg-yellow-500 hover:text-white cursor-pointer hover:scale-125'>
              <Link href="/page/cart" legacyBehavior>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </Link>
            </div> */}
              <div>
            </div>
          </div>
        </div>

        {/* input////////////////////////////////////////////////// */}
        <div className="flex items-center pr-16 space-x-4">
            <input 
              type="text" 
              placeholder='ค้นหาสินค้า'
              className='border-2 border-gray-300 p-2 rounded-lg w-96'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {hasSearched && (
              <div ref={dropdownRef} className="absolute w-96 bg-white shadow-lg rounded-lg top-16 m-2 z-10 max-h-80 overflow-y-auto border-4 border-red-400">
                {searchResults.length > 0 ? (
                  <ul className="p-0 m-0">
                    {searchResults.map((item) => (
                      <li key={item._id} className="p-2 border-b flex items-center cursor-pointer hover:bg-gradient-to-tr from-yellow-500 to-red-400">
                        <img
                          src={item.image?.length > 0 ? item.image[0] : "/default-image.jpg"}
                          alt={item.name}
                          className="w-12 h-12 rounded border object-cover ml-2"
                          onError={(e) => e.target.src = "/default-image.jpg"}
                        />
                        <Link href={`/page/bid/${item._id}`} className="flex-1 text-gray-700 hover:text-white ml-2 py-2">
                          {item.name} - ราคา: {item.currentPrice} บาท
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 p-2 text-center">❌ ไม่พบสินค้าที่ตรงกับ "{searchText}"</p>
                )}
              </div>
            )}
          </div>

        {/* icon contact////////////////////////////////////////////////// */}
        <div className="hidden md:flex flex-col items-center space-y-5 md:flex-row md:space-x-5 md:space-y-0 md:p-2">
          {/* <div className='bg-gradient-to-tr from-yellow-400 to-red-300 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <div className='bg-gradient-to-tr from-yellow-400 to-red-300 px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-white cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
            </svg>
          </div>
          <div className='bg-gradient-to-tr from-yellow-400 to-red-300 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div> */}
          {/* <div className='bg-gradient-to-tr from-yellow-400 to-red-300 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div> */}
          
          {/* Notification Bell */}
          <div className="relative flex items-center" ref={notificationRef}>
              <button 
                className="relative hover:text-gray-200"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <FaBell className='bg-gradient-to-tr from-yellow-500 to-red-400 rounded-full '  style={{ fontSize: 60, color: '#6f2f21' , padding: '10px'}}/>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <button onClick={markAllAsRead} className="text-blue-600 text-sm">Read all</button>
                  </div>

                  {/* Notification Items */}
                  <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-500 p-4">No notifications</p>
                    ) : (
                      notifications.map((notification, index) => (
                        <div 
                          key={notification.id || index} 
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === 'time_warning' ? (
                                <FaClock className="h-6 w-6 text-purple-500" />
                              ) : notification.type === 'auction_end' ? (
                                <FaCheckCircle className="h-6 w-6 text-green-500" />
                              ) : notification.type === 'higher_bid' ? (
                                <FaExclamationTriangle className="h-6 w-6 text-red-500" />
                              ) : (
                                <FaInfo className="h-6 w-6 text-blue-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarCustomer;