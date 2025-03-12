"use client";
import React from 'react'
import Link from 'next/link';

const ButtonMain = () => {
  return (
    <div className="flex gap-4">
      <Link href="/" legacyBehavior>
        <a className="text-yellow-400 px-4 py-2 rounded hover:bg-gradient-to-tr from-red-500 to-yellow-500 hover:text-white transition duration-50 ease-in-out transform hover:scale-105">Home</a>
      </Link>

      <Link href="#auction" legacyBehavior>
        <a className="text-yellow-400 px-4 py-2 rounded hover:bg-gradient-to-tr from-red-500 to-yellow-500 hover:text-white transition duration-50 ease-in-out transform hover:scale-105">Auction</a>
      </Link>

      <Link href="#product_v1" legacyBehavior>
        <a className="text-yellow-400 px-4 py-2 rounded hover:bg-gradient-to-tr from-red-500 to-yellow-500 hover:text-white transition duration-50 ease-in-out transform hover:scale-105">Product</a>
      </Link>

      <Link href="#contactt" legacyBehavior>
        <a className="text-yellow-400 px-4 py-2 rounded hover:bg-gradient-to-tr from-red-500 to-yellow-500 hover:text-white transition duration-50 ease-in-out transform hover:scale-105">Contact</a>
      </Link>
    </div>
  );
};

export default ButtonMain ;