'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, getSession } from 'next-auth/react';
import axios from 'axios';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [token, setToken] = useState(null); // เพิ่ม state สำหรับ token

  useEffect(() => {
    // Fetch user and token from local storage or API
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    setUser(storedUser);
    setToken(storedToken);
  }, []);


  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({
          email: user.email, // Include the email in the request body
          password: user.password, // Include the password in the request body
        }),
      });
  
      if (response.status === 200) {
        // ทำการ sign out สำเร็จ
        console.log('Signed out successfully');
        setUser(null);
        router.push('/page/login'); // เปลี่ยนเส้นทางไปยังหน้า login
      } else {
        console.error('Error signing out:', response.statusText);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };



  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user);
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



  return (
    <nav className="bg-white p-2 w-full fixed top-0 left-0 right-0 rounded-bl-lg rounded-br-lg shadow-lg z-10  bg-opacity-50 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex space-x-5 p-2">
          <div className="flex space-x-5 pl-2">
            {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <Link href="/page/profile" legacyBehavior>
                          <a className="flex items-center justify-center px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">
                            Profile
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </a>
                        </Link>
                        <Link href="/page/sett" legacyBehavior>
                          <a className="flex items-center justify-center px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">
                            Settings
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </a>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center justify-center w-full px-4 py-2 text-black hover:bg-red-800 hover:text-white rounded-lg"
                        >
                          Logout
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/page/login" className='text-white bg-gradient-to-tr from-red-500 to-yellow-500 px-4 py-2 rounded-xl font-bold hover:scale-125'>
                      Log in
                    </Link>
                    <Link href="/page/register" className='text-yellow-400 hover:bg-gradient-to-tr from-red-500 to-yellow-500 hover:text-white px-4 py-2 rounded-xl font-bold hover:scale-125'>
                      Register
                    </Link>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <Link href="/" legacyBehavior>
                    <a className="text-black text-3xl font-bold hover:scale-125 hover:text-yellow-400 underline decoration-double">UFA99</a>
                  </Link>
                </div>
              </div>
          </div>

          {/* input////////////////////////////////////////////////// */}
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder='ค้นหาสินค้า'
              className='border-2 border-gray-300 p-2 rounded-lg w-96'
            />
          </div>

          {/* icon contact////////////////////////////////////////////////// */}
          <div className="flex items-center space-x-5">
              <div className='bg-gradient-to-tr from-red-500 to-yellow-500 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white hover:scale-125'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                      <path  strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
              </div>
              <div className='bg-gradient-to-tr from-red-500 to-yellow-500 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white hover:scale-125'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>
              </div>
              <div className='bg-gradient-to-tr from-red-500 to-yellow-500 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white hover:scale-125'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
              </div>
              <div className='bg-gradient-to-tr from-red-500 to-yellow-500 px-4 py-2 rounded-full flex items-center hover:bg-yellow-500 hover:text-white hover:scale-125'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
              </div>
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;
