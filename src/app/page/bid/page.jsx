"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NavbarBids from '../../components/NavbarBids';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState(""); // ใช้ "" แทน null
  const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
  const [startingPrice, setStartingPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidsPerPage] = useState(5);
  const [product, setProduct] = useState([]);
  const [description, setDescription] = useState('');
  const [auction, setAuction] = useState(null);
  const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ควบคุม Modal ยืนยัน
  const [pendingBidAmount, setPendingBidAmount] = useState(null); // เก็บค่าบิดที่รอการยืนยัน
  const [category, setCategory] = useState('');

  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const image = searchParams.get('image');
  const price = Number(searchParams.get('price'));
  const prices = searchParams.get('prices');
  const expiresAt = searchParams.get('expiresAt');

  // 📌 ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    if (!id) return;
  
    let countdownInterval;
    let refreshInterval;
  
    const loadAuction = async () => {
      try {
        const res = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
        const data = await res.json();
        if (data.status === 'success') {
          const auction = data.data;
          setStartingPrice(auction.startingPrice);
          setCurrentPrice(auction.currentPrice);
          setMinimumBidIncrement(auction.minimumBidIncrement);
          setImages(auction.image || []);
          setAuction(auction);
          setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า');
          setCategory(auction.category || 'ไม่ระบุหมวดหมู่');
  
          // เริ่มนับเวลาถอยหลัง
          const endTime = new Date(auction.expiresAt).getTime();
          countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const diff = endTime - now;
            if (diff <= 0) {
              clearInterval(countdownInterval);
              setTimeLeft('หมดเวลา');
            } else {
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);
              setTimeLeft(`${hours}:${minutes}:${seconds}`);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', err);
      }
    };
  
    // โหลดข้อมูลครั้งแรก
    loadAuction();
  
    refreshInterval = setInterval(() => {
      fetch(`http://localhost:3111/api/v1/auction/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const auctionData = data.data;
            setAuction(auctionData);
            setCurrentPrice(auctionData.currentPrice);
            setMinimumBidIncrement(auctionData.minimumBidIncrement);
          }
        })
        .catch(err => console.error('⚠️ ดึงราคาล่าสุดล้มเหลว', err));
    }, 3000);
    
  
    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [id]);

  // 📌 ดึงประวัติการบิดจาก API
  const fetchBidHistory = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('There is no auction yet.');
      const data = await response.json();
      setBidHistory(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 ฟังก์ชันสำหรับการประมูล
  const handleBid = () => {
    if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
      showAlertModal(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
      return;
    }
    setPendingBidAmount(bidAmount); // เก็บค่าบิดที่รอการยืนยัน
    setShowConfirmModal(true); // แสดง Modal ยืนยัน
  };

  const confirmBid = async () => {
    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: Number(pendingBidAmount) }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        // ลบ toast และรีโหลดหน้าจอโดยตรง
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด!');
    } finally {
      setShowConfirmModal(false); // ปิด Modal
      setPendingBidAmount(null); // ล้างค่าบิดที่รอการยืนยัน
    }
  };

  const cancelBid = () => {
    setShowConfirmModal(false); // ปิด Modal
    setPendingBidAmount(null); // ล้างค่าบิดที่รอการยืนยัน
  };

  const handleCloseBidHistory = (e) => {
    if (e.target.id === "bidHistoryOverlay") {
      setShowBidHistory(false);
    }
  };

  const handleIncrementBid = () => {
    setBidAmount((prevBid) => (Number(prevBid) + minimumBidIncrement).toFixed(2));
  };

  const handleDecrementBid = () => {
    if (Number(bidAmount) <= currentPrice) {
      toast.error("Can't be reduced any more than this.");
      return;
    }
    setBidAmount((prevBid) => (Number(prevBid) - minimumBidIncrement).toFixed(2));
  };

  useEffect(() => {
  // ตั้งค่า bidAmount เป็นยอดปัจจุบัน + ยอดบิดขั้นต่ำ
  setBidAmount((currentPrice + minimumBidIncrement).toFixed(2));
}, [currentPrice, minimumBidIncrement]);

  // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]); // Update selected image
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]); // Update selected image
  };

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

  return (
    <div>
      <NavbarBids />
      <div className="max-w-screen-2xl mx-auto bg-white pt-20 m-10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Image Section */}
          <div className="space-y-4">
             <div className="relative">
               <img
                src={images[currentImageIndex]}
                alt={name}
                className="w-full h-[400px] object-contain"
              />
              
              {/* Navigation Arrows with improved styling */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-tr from-yellow-500 to-red-400 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-tr from-green-500 to-blue-400 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(img);
                      setCurrentImageIndex(index);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img 
                        ? 'border-red-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    <div className="aspect-square">
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{name}</h1>

            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Starting price</span>
                <span className="text-2xl font-bold">{startingPrice} ฿</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Current price</span>
                <span className="text-2xl font-bold text-green-600">{currentPrice} ฿</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">Remaining time</span>
                  <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Product details</h2>
              <span className="text-lg font-sm text-gray-500 pl-4">{description}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 ml-8 mb-2">Place You Bid :</label>
                <div className="flex items-center space-x-2 justify-center">
                  <button onClick={handleDecrementBid} className="bg-[#FF0000] hover:bg-red-400 text-black font-bold py-2 px-4 rounded">
                    -
                  </button>
                  <input
                    type="number"
                    className="w-50 p-2 border rounded"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={(currentPrice + minimumBidIncrement).toFixed(2)} // กำหนดยอดขั้นต่ำที่ต้องบิด
                  />
                  <button onClick={handleIncrementBid} className="bg-[#00FF00] hover:bg-green-400 text-black font-bold py-2 px-4 rounded">
                    +
                  </button>
                </div>
              </div>
              <div className='flex justify-center items-center space-x-4 mt-4'>
                <button className="w-full bg-[#00FFFF] text-white py-3 rounded-lg hover:bg-blue-600 mt-2" 
                  onClick={handleBid}>
                  Bid Now!
                </button>
                <div className="flex justify-end">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-200"
                    onClick={() => { setShowBidHistory(true); fetchBidHistory(); }}
                  >
                    <span>Auction history</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <p className="text-lg font-semibold">ยืนยันการบิด {pendingBidAmount} บาท?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={confirmBid}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                ยืนยัน
              </button>
              <button
                onClick={cancelBid}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {showBidHistory && (
        <div 
          id="bidHistoryOverlay" 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseBidHistory}
        >
          <div 
            className="fixed top-1/2 left-1/2 w-full max-w-sm min-h-[300px] max-h-[80vh] 
                      bg-white rounded-xl flex flex-col items-center gap-5 p-10 shadow-lg 
                      overflow-y-auto"
            style={{ transform: 'translate(-50%, -45%)' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex flex-col gap-4 px-4">
              <h1 className="text-2xl font-bold text-gray-900">Auction history</h1>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : bidHistory.length === 0 ? (
                <div className="text-center py-4">There is no auction history yet.</div>
              ) : (
                <div className="divide-y">
                  {bidHistory.map(bid => (
                    <div key={bid._id} className="py-4 flex justify-between">
                      <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
                      <p className="text-lg font-semibold">{bid.amount} บาท</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;