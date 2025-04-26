'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3111/api/v1';
const FILE_URL = 'http://localhost:3111';

const shippingSteps = [
  { status: 'created', label: 'มีคำสั่งซื้อใหม่' },
  { status: 'uploaded', label: 'รายการสั่งซื้อชำระเงินแล้ว' },
  { status: 'shipped', label: 'คำสั่งซื้อกำลังจัดส่งแล้ว' },
  { status: 'delivered', label: 'รับสินค้าแล้ว' },
  { status: 'completed', label: 'ให้คะแนน' },
];

export default function TrackPage() {
  const { auctionId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`${API_URL}/payment/slip-by-auction/${auctionId}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (!data.success) {
          setError(data.error || 'ไม่พบข้อมูล');
        } else {
          // แปลง path เป็น URL เต็ม
          if (data.slipImage && !data.slipImage.startsWith('http')) {
            data.slipImage = `${FILE_URL}${data.slipImage}`;
          }
          setPayment(data);
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) fetchPayment();
  }, [auctionId]);

  const getStepIndex = () => {
    if (!payment) return 0;
    if (!payment.status || payment.status === 'pending') return 0;
    if (payment.shippingStatus === 'shipped') return 2;
    if (payment.shippingStatus === 'delivered') return 3;
    return 1;
  };

  if (loading) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center text-red-600 p-6">❌ {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
        <h1 className="text-2xl font-extrabold text-center text-pink-600 mb-6 tracking-wide">
          🎉 ตรวจสอบการชำระเงิน
        </h1>

        {payment.slipImage && (
          <div className="text-center mb-6">
            <img
              src={payment.slipImage}
              alt="slip"
              className="mx-auto w-full max-w-xs border-4 border-pink-200 rounded-xl shadow-md transition-transform hover:scale-105"
            />
          </div>
        )}

        {payment.isPaid && (
          <p className="text-green-600 text-center font-semibold text-lg mb-6">
            ✅ การชำระเงินได้รับการยืนยันแล้ว
          </p>
        )}

        <div className="mb-8 bg-pink-50 p-4 rounded-xl">
          <h2 className="text-lg font-bold text-pink-700 mb-2">📍 ข้อมูลที่อยู่จัดส่ง</h2>
          <p>👤 ชื่อผู้รับ: {payment.recipientName}</p>
          <p>📞 เบอร์โทร: {payment.recipientPhone}</p>
          <p>🏡 ที่อยู่: {payment.shippingAddress}</p>
          <p>📝 โน้ตลูกค้า: {payment.note || '-'}</p>
        </div>

        <div className="mb-10 bg-purple-50 p-4 rounded-xl">
          <h2 className="text-lg font-bold text-purple-700 mb-2">📦 สถานะการจัดส่ง</h2>
          <p className="mb-1">🚚 สถานะ: <strong>{payment.shippingStatus}</strong></p>
          <p>🔢 เลขพัสดุ: {payment.trackingNumber || '—'}</p>
        </div>

        <div className="flex items-center justify-between gap-3 mt-10">
          {shippingSteps.map((step, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold shadow-sm 
                ${getStepIndex() >= idx 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'}`}>
                {idx + 1}
              </div>
              <p className="text-xs mt-2 text-gray-700">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}