'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '../../components/Input'
import NavbarCreateauction from '../../components/NavbarCreateauction'

function CreateAuctionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    images: [],
    category: '',
    description: '',
    startPrice: '',
    minBid: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [previewImages, setPreviewImages] = useState([])

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    const updatedPreviews = [...previewImages]
    updatedPreviews.splice(index, 1)

    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }))
    setPreviewImages(updatedPreviews)
  }

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }))
  }

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

      if (!response.ok) throw new Error(result.message || 'An error occurred.')

      setMessage({ type: 'success', text: 'Auction created successfully!' })
      setTimeout(() => router.push('/my-auctions'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavbarCreateauction />
      <div className="container mx-auto px-4 py-8 pt-20 mt-10">
        <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {message && (
              <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message.text}
              </div>
            )}

            <Input label="ชื่อสินค้า" type="text" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="รายละเอียดสินค้า" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
            <Input label="ราคาเริ่มต้น (บาท)" type="text" name="startPrice" value={formData.startPrice} onChange={handleChange} required />
            <Input label="บิดขั้นต่ำ (บาท)" type="text" name="minBid" value={formData.minBid} onChange={handleChange} required />

            {/* อัปโหลดรูปภาพ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสินค้า (สูงสุด 5 รูป)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่สินค้า</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
                {loading ? 'กำลังสร้าง...' : 'สร้างการประมูล'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAuctionPage