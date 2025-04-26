'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import NavbarCheckPayment from '../../components/NavbarCheck-Payment';

const API_URL = "http://localhost:3111/api/v1";

function CheckPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [slip, setSlip] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [shippingStatus, setShippingStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🧾 ข้อมูลผู้ซื้อ / ที่อยู่
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");

  const auctionId = searchParams.get('auctionId');

  const fetchSlipData = async () => {
    if (!auctionId) {
      setError("❌ ไม่พบข้อมูลการประมูล");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payment/slip-by-auction/${auctionId}?nocache=${Date.now()}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setPaymentId(data.paymentId);
        setIsPaid(data.isPaid);
        setShippingStatus(data.shippingStatus || "");
        setTrackingNumber(data.trackingNumber || "");
        setRecipientName(data.recipientName || "—");
        setRecipientPhone(data.recipientPhone || "—");
        setShippingAddress(data.shippingAddress || "—");
        setNote(data.note || "");

        if (data.slipImage) {
          setSlip(`http://localhost:3111${data.slipImage}`);
        }
      } else {
        return (
          <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <p className="text-center text-red-500 text-lg font-bold">{error}</p>
          </div>
        );
      }
    } catch (err) {
      console.error("❌ fetchSlipData error:", err);
      setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!auctionId) return;
    setConfirming(true);
    try {
      const res = await fetch(`${API_URL}/payment/confirm-payment/by-auction/${auctionId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ ยืนยันการชำระเงินแล้ว");
        await fetchSlipData();
      } else {
        alert(data.message || "❌ ยืนยันล้มเหลว");
      }
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด");
    } finally {
      setConfirming(false);
    }
  };

  const handleUpdateShipping = async () => {
    if (!paymentId) return alert("ไม่พบข้อมูลการชำระเงิน");
    setUpdating(true);

    try {
      const res = await fetch(`${API_URL}/payment/shipping-status/${paymentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingStatus, trackingNumber }),
      });
      const data = await res.json();
      if (data.success) {
        alert("📦 อัปเดตสถานะจัดส่งแล้ว");
        await fetchSlipData();
      } else {
        alert(data.message || "❌ อัปเดตล้มเหลว");
      }
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSlipData();
  }, [auctionId]);

  if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <NavbarCheckPayment />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 text-gray-800">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">🔍 ตรวจสอบการชำระเงิน</h1>

          {slip ? (
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* รูปภาพอยู่ทางซ้าย */}
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <img
                  src={slip}
                  alt="Slip"
                  className="w-72 h-72 rounded-lg shadow-md border-4 border-yellow-400"
                />
              </div>

              {/* ข้อมูลอื่น ๆ อยู่ทางขวา */}
              <div className="flex-grow">
                <p
                  className={`text-2xl font-bold mb-6 ${
                    isPaid ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {isPaid
                    ? "✅ การชำระเงินได้รับการยืนยันแล้ว"
                    : "⏳ ยังไม่ได้ยืนยันการชำระเงิน"}
                </p>

                {/* 📍 ข้อมูลที่อยู่จัดส่ง */}
                <div className="text-left border-t pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-pink-500">
                    📍 ข้อมูลที่อยู่จัดส่ง
                  </h3>
                  <p className="mb-2">
                    <strong>ชื่อผู้รับ:</strong> {recipientName}
                  </p>
                  <p className="mb-2">
                    <strong>เบอร์โทร:</strong> {recipientPhone}
                  </p>
                  <p className="mb-2">
                    <strong>ที่อยู่:</strong> {shippingAddress}
                  </p>
                  {note && (
                    <p className="mb-2">
                      <strong>โน้ตลูกค้า:</strong> {note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-lg text-center">⏳ ลูกค้ายังไม่ได้อัปโหลดสลิป</p>
          )}

          {/* ปุ่มอยู่ตรงกลาง */}
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            {!isPaid && (
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                ✅ ยืนยันการชำระเงิน
              </button>
            )}

            <button
              onClick={fetchSlipData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              🔄 โหลดสลิปใหม่
            </button>

            {isPaid && (
              <button
                onClick={handleUpdateShipping}
                disabled={updating}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
              >
                🚚 อัปเดตการจัดส่ง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckPaymentPage;