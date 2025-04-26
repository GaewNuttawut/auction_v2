'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, getSession } from 'next-auth/react';
import axios from 'axios';

const NavbarCheckPayment = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/page/profile' );
  };
  return (
    <nav className="bg-gradient-to-tr from-yellow-500 to-red-400 p-3 w-full fixed top-0 left-0 right-0 shadow-lg z-10  bg-opacity-90">
      <div>
        <button onClick={handleBackToHome} className='flex items-center space-x-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

        </button>
      </div>
    </nav>
    );
  };

export default NavbarCheckPayment;