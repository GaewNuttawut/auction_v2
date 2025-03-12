"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NavbarBidscopy from '../../components/NavbarBidscopy';
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

  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const image = searchParams.get('image');
  const price = Number(searchParams.get('price'));
  const prices = searchParams.get('prices');
  const expiresAt = searchParams.get('expiresAt');

  // // 📌 ตรวจสอบการเข้าสู่ระบบ
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3111/api/v1/auth/check', {
  //         method: 'GET',
  //         credentials: 'include',
  //       });
  //       if (!response.ok) {
  //         router.push('/page/login'); // Redirect to login page if not logged in
  //       }
  //     } catch (err) {
  //       router.push('/page/login'); // Redirect to login page if error occurs
  //     }
  //   };

  //   checkLoginStatus();
  // }, [router]);

  // // 📌 ตรวจสอบการเข้าสู่ระบบ
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3111/api/v1/auth/check', {
  //         method: 'GET',
  //         credentials: 'include',
  //       });
  //       if (!response.ok) {
  //         toast.error(
  //           <div>
  //             กรุณาเข้าสู่ระบบ
  //             <div>
  //               <button onClick={() => router.push('/page/login')} className="bg-red-500 text-white py-1 px-2 rounded mt-2">
  //                 ยืนยัน
  //               </button>
  //             </div>
  //           </div>
  //         );
  //       }
  //     } catch (err) {
  //       toast.error(
  //         <div>
  //           กรุณาเข้าสู่ระบบ
  //           <div>
  //             <button onClick={() => router.push('/page/login')} className="bg-red-500 text-white py-1 px-2 rounded mt-2">
  //               ยืนยัน
  //             </button>
  //           </div>
  //         </div>
  //       );
  //     }
  //   };

  //   checkLoginStatus();
  // }, [router]);

  // 📌 ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3111/api/v1/auction/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        const auction = data.data;
        const auctionData = data.data;
        setStartingPrice(auction.startingPrice);
        setCurrentPrice(auction.currentPrice);
        setMinimumBidIncrement(auction.minimumBidIncrement);
        setDescription(auction.description); // Set the description state
        setProduct(auction.product); // Set the product state
        setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ
        setAuction(auctionData);
        setLoading(false);

        // Handle both single image and array of images
        const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
        setImages(auctionImages);
        setSelectedImage(auctionImages[0]); // Set first image as selected

        // Log the product data to verify
        console.log('Product data:', auction.product);

        // ✅ ตั้งเวลาหมดอายุ
        const endTime = new Date(auction.expiresAt).getTime();
        const interval = setInterval(() => {
          const now = new Date().getTime();
          const diff = endTime - now;
          if (diff <= 0) {
            clearInterval(interval);
            setTimeLeft('หมดเวลา');
          } else {
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft(`${hours}:${minutes}:${seconds}`);
          }
        }, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
      }
    });
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
  const handleBid = async () => {
    if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
      alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        toast.success(
          <div>
            Successful bid!
            <div>
              <button onClick={() => window.location.reload()} className="bg-green-500 text-white py-1 px-2 rounded mt-2">
                Confirm
              </button>
            </div>
          </div>
        );
        // window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด!');
    }
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
    setBidAmount(currentPrice.toFixed(2));
  }, [currentPrice]);


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
      <NavbarBidscopy />
      <ToastContainer />
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                  >
                    ◀
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                  >
                    ▶
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
                        ? 'border-yellow-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-pink-300'
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
          {/* <div className="rounded-lg overflow-hidden">
            <Slider>
              {product && product.image && Array.isArray(product.image) ? (
                product.image.map((img, index) => (
                  <div key={index}>
                    <img src={img} alt={`${name} ${index + 1}`} className="w-full h-auto object-cover" />
                  </div>
                ))
              ) : (
                product && product.image && (
                  <img src={product.image} alt={name} className="w-full h-auto object-cover" />
                )
              )}
            </Slider>
          </div> */}
            {/* <div className="rounded-lg overflow-hidden">
              <img src={image} alt={name} className="w-full h-auto object-cover" />
            </div> */}

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
                    min={price}
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