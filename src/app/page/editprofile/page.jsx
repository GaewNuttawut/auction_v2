'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavbarEditProfile from '../../components/NavbarEditProfile'

function EditProfilePage() {
  const router = useRouter()
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

   // ✅ โหลดข้อมูลโปรไฟล์จากเซิร์ฟเวอร์
   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile', {
          method: 'GET',
          credentials: 'include',
        })
        if (!response.ok) throw new Error('โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')
        const data = await response.json()

        setFormData({
          name: data.data.name || 'New User',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
        })
        setPreviewImage(data.data.profileImage) // ✅ โหลดรูปโปรไฟล์จาก API
      } catch (error) {
        console.error('❌ Error loading profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleCancel = () => {
    router.push('/page/profile')
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file)) // แสดงตัวอย่างรูปที่เลือก
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log("📩 Sending Data:", formData) // ✅ Debug formData ก่อนส่ง

    try {
      // 🔹 อัปเดตข้อมูลโปรไฟล์
      const profileUpdateResponse = await fetch('http://localhost:3111/api/v1/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!profileUpdateResponse.ok) throw new Error('อัปเดตข้อมูลไม่สำเร็จ')

      // 🔹 อัปโหลดรูปโปรไฟล์ (ถ้ามีการเปลี่ยนรูป)
      if (profileImage) {
        const formDataToSend = new FormData()
        formDataToSend.append('image', profileImage)

        const uploadResponse = await fetch('http://localhost:3111/api/v1/profile/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend,
        })

        if (!uploadResponse.ok) throw new Error('อัปโหลดรูปภาพไม่สำเร็จ')

        // ✅ โหลดรูปใหม่หลังอัปโหลด
        const imageData = await uploadResponse.json()
        setPreviewImage(imageData.image)
      }

      router.push('/page/profile') // 🔄 กลับไปหน้าโปรไฟล์
    } catch (error) {
      console.error('❌ Error updating profile:', error)
    }
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarEditProfile />
      <div className="container mx-auto px-4 py-10 flex flex-col items-center pt-20">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit profile</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-6 flex flex-col items-center">
              <img 
                src={previewImage || "/image/profile1.jpg"} 
                alt="Profile" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 mb-4"
              />
              <label className="cursor-pointer bg-gradient-to-tr from-red-500 to-yellow-500 text-white px-4 py-2 rounded-lg transition-all">
                Upload Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">User name</label>
                <input 
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="User name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone number</label>
                <input 
                  type="tel"
                  name="phone"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 mt-6">
              <button 
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-tr from-red-500 to-yellow-500 text-white rounded-lg  transition-all"
              >
                Save
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage