"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ProductPageNouser = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState({})
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3111/api/v1/auction", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Unable to retrieve product information");
        }
  
        const data = await response.json();
  
        const activeProducts = data.data.filter(product => product.status === "active");
        setProducts(activeProducts);
  
        const initialTimeLeft = {};
        activeProducts.forEach(product => {
          initialTimeLeft[product._id] = calculateTimeLeft(product.expiresAt);
        });
        setTimeLeft(initialTimeLeft);
  
        const interval = setInterval(() => {
          const updatedTimeLeft = {};
          activeProducts.forEach(product => {
            updatedTimeLeft[product._id] = calculateTimeLeft(product.expiresAt);
          });
          setTimeLeft(updatedTimeLeft);
        }, 1000);
  
        checkWinningProducts(data.data); // Check for winning products
  
        return () => clearInterval(interval);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory.id)
    : products;

  const checkWinningProducts = (products) => {
    const userId = "currentUserId"; // Replace with the actual user ID
    const winningProducts = products.filter(product => {
      const endTime = new Date(product.expiresAt).getTime();
      const now = new Date().getTime();
      return endTime <= now && product.bids.length > 0 && product.bids[product.bids.length - 1].userId === userId;
    });
    setCart(winningProducts);
  };

  // 📌 ฟังก์ชันคำนวณเวลาคงเหลือ
  const calculateTimeLeft = (expiresAt) => {
    const endTime = new Date(expiresAt).getTime()
    const now = new Date().getTime()
    const diff = endTime - now

    if (diff <= 0) return "Time Out!!"

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0')
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }
  
  if (loading) return (
    <div className='flex flex-col justify-center items-center h-screen text-4xl text-center font-bold'>
      <div className='p-4'>Loading...</div>
      <img alt="Loading" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
    </div>
  );
  if (error) return (
    <div className='flex flex-col justify-center items-center h-screen text-4xl text-center font-bold'>
      <div className='p-4'>Error: {error}</div>
      <img alt="Error" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
    </div>
  );



  return (
  <div>
    <div className="max-w-full mx-auto bg-white p-8">
      <h1 className="font-bold mb-4 text-center font-extrabold text-4xl p-2 shadow-xl bg-gradient-to-tr from-yellow-400 to-red-300">Auction Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 bg-white shadow-xl">
              <Link href={{
                pathname: `/page/bid_copy`,
                query: { 
                  id: product._id,
                  name: product.name,
                  image: Array.isArray(product.image) ? product.image[0] : product.image, // Check if image is array
                  price: product.currentPrice,
                  prices: product.startingPrice,
                  Date: product.expiresAt,
                  bids: product.bids.length,
                  discription: product.description
                }
              }} legacyBehavior>
                <a>
                  <img 
                    src={Array.isArray(product.image) ? product.image[0] : product.image} 
                    alt={product.name} 
                    className="w-full h-auto mb-4 rounded-lg cursor-pointer"
                  />
                </a>
              </Link>
              <h2 className="font-bold text-xl mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">Current Bid: {product.currentPrice} ฿</p>
              <p className="text-md text-red-500 font-semibold">{timeLeft[product._id] || "Loading..."}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default ProductPageNouser;