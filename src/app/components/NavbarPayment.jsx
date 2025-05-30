'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const NavbarCart = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/page/profile' );
  };
  return (
    <nav className="bg-gradient-to-tr from-blue-400 to-pink-400 p-3 w-full fixed top-0 left-0 right-0 shadow-lg z-10  bg-opacity-90">
      <div>
        <button onClick={handleBackToHome} className='flex items-center space-x-2 ml-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

        </button>
      </div>
    </nav>
    );
  };

export default NavbarCart;