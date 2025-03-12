'use client';

import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import NavbarProfile from '../../components/NavbarProfile';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import Input from '../../components/Input';

const API_URL = "http://localhost:3111/api/v1";
const socket = io("http://localhost:3111");

function ProfilePage() {
  const [profile, setProfile] = useState({
    wonAuctions: 0,
    participatedAuctions: 0,
    listedItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedStat, setSelectedStat] = useState('wonAuctions');
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
  const router = useRouter();
  const [myWinningBids, setMyWinningBids] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null); // Define the message state
  const categories = [
    { id: "chair", name: "Chair" },
    { id: "sofas_and_armchairs", name: "Sofas and armchairs" },
    { id: "table", name: "Table" },
    { id: "cupboard", name: "Cupboard" },
    { id: "bad", name: "Bad" },
    { id: "counter", name: "Counter" },
    { id: "office_furniture", name: "Office furniture" },
    { id: "Kitchenware_and_freezer", name: "Kitchenware and freezer" },
    { id: "door", name: "Door" },
    { id: "home_decoration", name: "Home decoration" },
  ];
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    startPrice: '',
    minBid: '',
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchMyBids();
    fetchMyCreatedAuctions();
    fetchWinningBids();
    
    socket.on("bid_update", (data) => {
      setMyBids(prev => prev.map(bid => 
        bid.auction?._id === data.auctionId 
          ? { ...bid, auction: { ...bid.auction, currentPrice: data.highestBid } }
          : bid
      ));
    });

    return () => {
      socket.off("bid_update");
    };
  }, []);

  const fetchMyBids = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setMyBids(data.data || []);
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลการบิดของคุณได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCreatedAuctions = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setMyCreatedAuctions(data.data || []);
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลการประมูลของคุณได้');
    }
  };

  const fetchWinningBids = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
  
      // Check if the response is in JSON format
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format");
      }
  
      const result = await response.json();
  
      if (result.status === 'success') {
        setMyWinningBids(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile', {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Unable to retrieve profile information.');

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
        const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error("Failed to load image.");

        const data = await res.json();
        setProfileImage(data.image);
      } catch (err) {
        console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err);
      }
    };

    const fetchAuctionHistory = async () => {
      try {
        const res = await fetch('http://localhost:3111/api/v1/auction', {
          credentials: 'include'
        });

        if (!res.ok) throw new Error('Unable to retrieve auction history.');

        const data = await res.json();
        setMyAuctions(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBidHistory = async () => {
      try {
        const res = await fetch('http://localhost:3111/api/v1/auction', {
          credentials: 'include'
        });

        if (!res.ok) throw new Error('Unable to retrieve bid history.');

        const data = await res.json();
        setBidHistory(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
    fetchProfileImage();
    fetchAuctionHistory();
    fetchBidHistory();
    fetchWinningBids();
  }, [refresh]);

  if (loading) return   
      <div className='flex flex-col justify-center items-center h-screen text-4xl text-center font-bold'>
        <div className='p-4'>Loading...</div>
        <img alt="Loading" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
      </div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const renderProfileStats = () => {
    switch (selectedStat) {
      case 'wonAuctions':
        return (
          <div className="bg-blue-100 border-2 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-xl">Details about the winning bids...</h3>
            </div>
            <ul className="list-disc list-inside mt-2">
              {myWinningBids.map((bid) => (
                <li key={bid._id} className='mt-2'>
                  {bid.auction?.name}: ฿{bid.amount}
                  <Link href={`/page/wonAuctionsDetails/${bid.auction?._id}`}>
                    <button className="ml-4 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all">
                      👁️
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'participatedAuctions':
        return (
          <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-xl">Details about the participated auctions...</h3>
            </div>
            <ul className="list-disc list-inside mt-2">
              {myBids.map((bid) => (
                <li key={bid._id} className='mt-2'>
                  {bid.auction?.name}: ฿{bid.amount}
                  <button
                    onClick={() => router.push(`${API_URL}/auction/${bid.auction._id}`)}
                    className="ml-4 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    👁️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'listedItems':
        return (
          <div className="bg-purple-100 border-2 border-purple-500 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-xl">Details about the listed items...</h3>
            </div>
            <ul className="list-disc list-inside mt-2">
              {myCreatedAuctions.map((auction) => (
                <li key={auction._id} className='mt-2'>
                  {auction.name}: ฿{auction.startingPrice}
                  <button
                    onClick={() => router.push(`${API_URL}/auction/${auction._id}`)}
                    className="ml-4 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    👁️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('startingPrice', formData.startPrice)
      formDataToSend.append('minimumBidIncrement', formData.minBid)

      formData.images.forEach(image => {
        formDataToSend.append('image', image)
      })

      const response = await fetch('http://localhost:3111/api/v1/auction', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

      setMessage({ type: 'success', text: 'สร้างการประมูลสำเร็จ!' })
      setTimeout(() => router.push('/page/profile'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + formData.images.length > 5) {
      setMessage({ type: 'error', text: 'สามารถอัปโหลดรูปภาพได้ไม่เกิน 5 รูป' })
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))

    const previewURLs = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...previewURLs])
  }

  return (
    <div>
      <NavbarProfile />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 m-5">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img 
                src={profileImage || "/image/profile1.jpg"}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {profile?.name || 'Not specified'}
                </h1>
              </div>
              <p className="text-gray-500 pl-6">Email : {profile?.email || 'Not specified'}</p>
              <p className="text-gray-500 pl-6">Phone : {profile?.phone || 'Not specified'}</p>
              <div className='mt-2 '>
                <Link href="/page/editprofile">
                  <button className="bg-gradient-to-tr from-yellow-500 to-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
                    Edit profile
                  </button>
                </Link>
              </div>
              <div className='mt-2 '>
                <button onClick={handleShowForm} className="bg-gradient-to-tr from-yellow-500 to-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
                  Create Auction
                </button>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow p-6 space-y-6 w-full max-w-2xl mx-auto relative">
                <button onClick={handleHideForm} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2">✕</button>
                <h1 className="text-2xl font-bold mb-6">Create Auction</h1>

                <form onSubmit={handleSubmit}>
                  {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {message.text}
                    </div>
                  )}

                  <Input label="Product Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                  <Input label="Description" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
                  <Input label="StartingPrice" type="text" name="startPrice" value={formData.startPrice} onChange={handleChange} required />
                  <Input label="MinimumBidIncrement" type="text" name="minBid" value={formData.minBid} onChange={handleChange} required />

                  {/* อัปโหลดรูปภาพ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product image (Max 5 image)</label>
                    <input type="file" multiple onChange={handleImageChange} accept="image/*" className="w-full p-2 border rounded-lg" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {previewImages.map((src, index) => (
                        <div key={index} className="relative">
                          <img src={src} alt="Preview" className="w-full h-20 object-cover rounded-lg border" />
                          <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveImage(index)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* หมวดหมู่สินค้า */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                      <option value="">Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Now!'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 🔥 Personal Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Personal information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600 pl-6">- Phone number | {profile?.phone || 'ไม่ระบุ'}</p>
                <p className="text-gray-600 pl-6">- Address | {profile?.address || 'ไม่ระบุ'}</p>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              className={`p-4 rounded-lg ${selectedStat === 'wonAuctions' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'}`}
              onClick={() => setSelectedStat('wonAuctions')}
            >
              Winning bid
            </button>
            <button
              className={`p-4 rounded-lg ${selectedStat === 'participatedAuctions' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50'}`}
              onClick={() => setSelectedStat('participatedAuctions')}
            >
              Auction history
            </button>
            <button
              className={`p-4 rounded-lg ${selectedStat === 'listedItems' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'}`}
              onClick={() => setSelectedStat('listedItems')}
            >
              Create auction
            </button>
          </div>

          {/* Render selected profile stats */}
          <div className="mt-6">
            {renderProfileStats()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;