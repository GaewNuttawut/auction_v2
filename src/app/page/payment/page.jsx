// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { QRCodeSVG } from 'qrcode.react';
// import NavbarPayment from '../../components/NavbarPayment';

// const PaymentPage = () => {
//   const router = useRouter();
//   const [totalAmount, setTotalAmount] = useState(10000);
//   const [countdown, setCountdown] = useState(300); // 5 minutes countdown

//   useEffect(() => {
//     if (router.query && router.query.totalAmount) {
//       setTotalAmount(parseFloat(router.query.totalAmount));
//     }
//   }, [router.query]);

//   const [paymentMethod, setPaymentMethod] = useState('creditCard');
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiryDate, setExpiryDate] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [cardHolderName, setCardHolderName] = useState('');
//   const [referenceNumber, setReferenceNumber] = useState('');
//   const [qrCodeValue, setQrCodeValue] = useState('');

//   useEffect(() => {
//     if (paymentMethod === 'qrCode') {
//       setQrCodeValue(`Amount: ${totalAmount}`);
//       setCountdown(1200); // Reset countdown to 5 minutes
//     }
//   }, [paymentMethod, totalAmount]);

//   useEffect(() => {
//     let timer;
//     if (paymentMethod === 'qrCode' && countdown > 0) {
//       timer = setInterval(() => {
//         setCountdown((prevCountdown) => prevCountdown - 1);
//       }, 1000);
//     } else if (countdown === 0) {
//       // Handle QR Code expiration logic here
//       alert('QR Code expired');
//     }
//     return () => clearInterval(timer);
//   }, [paymentMethod, countdown]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle payment submission logic here
//     alert('Payment submitted');
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   return (
//     <div>
//       <NavbarPayment />
//       <form onSubmit={handleSubmit}>
//         <div className="max-w-2xl mx-auto bg-white p-8  border border-yellow-300 rounded-lg shadow-lg mt-20 m-10" style={{ boxShadow: '0 4px 6px rgb(255, 217, 0), 0 8px 8px rgba(0, 0, 0, 0.06)' }}>
//           <h2 className="text-2xl font-bold mb-6 text-center">Payment Information</h2>
//           <div className="space-y-4">
//             <div className="form-group">
//               <label className="block font-semibold mb-2">Choose form of payment:</label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded text-sm"
//               >
//                 <option value="qrCode">QR Code</option>
//                 <option value="creditCard">Credit Card</option>
//                 <option value="bankTransfer">Bank Transfer</option>
//               </select>
//             </div>
//             {/* QR Code /////////////////////////////////////////////////// */}
//             {paymentMethod === 'qrCode' && (
//                 <div className="form-group flex justify-center items-center flex-col">
//                     <label className="block font-semibold mb-2">Scan QR Code:</label>
//                     <QRCodeSVG value={qrCodeValue} size={128} className="w-64 h-64 mb-4" />
//                     <div className="text-center font-bold text-xl">Amount: ${totalAmount.toLocaleString()}</div>
//                     <div className="text-center font-bold text-red-500">Expires in: {formatTime(countdown)}</div>
//                 </div>
//             )}
//             {/* creditCard /////////////////////////////////////////////////// */}
//             {paymentMethod === 'creditCard' && (
//               <>
//                 <div className="form-group">
//                   <label className="block font-semibold mb-2">Card Number:</label>
//                   <input
//                     type="text"
//                     value={cardNumber}
//                     onChange={(e) => setCardNumber(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded text-sm"
//                     placeholder="1234 5678 9012 3456"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="block font-semibold mb-2">Expiry Date:</label>
//                   <input
//                     type="text"
//                     value={expiryDate}
//                     onChange={(e) => setExpiryDate(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded text-sm"
//                     placeholder="MM/YY"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="block font-semibold mb-2">CVV:</label>
//                   <input
//                     type="text"
//                     value={cvv}
//                     onChange={(e) => setCvv(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded text-sm"
//                     placeholder="123"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="block font-semibold mb-2">Card Holder Name:</label>
//                   <input
//                     type="text"
//                     value={cardHolderName}
//                     onChange={(e) => setCardHolderName(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded text-sm"
//                     placeholder="Your Name"
//                   />
//                 </div>
//                 <div className='mt-4 ml-4 pt-4 border-t-2 border-gray-300'></div>
//                 <div className="text-center font-bold">Amount: ${totalAmount.toLocaleString()}</div>
//               </>
//             )}
//             {/* bankTransfer ///////////////////////////////////////////////////
//             {paymentMethod === 'bankTransfer' && (
//               <>
//                 <div className="form-group">
//                   <label className="block font-semibold mb-2">Reference Number:</label>
//                   <input
//                     type="text"
//                     value={referenceNumber}
//                     onChange={(e) => setReferenceNumber(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded text-sm"
//                     placeholder="Reference Number"
//                   />
//                 </div>
//                 <div className="text-center font-bold">Amount: {totalAmount.toLocaleString()} บาท</div>
//               </>
//             )} */}


//               <div className='mt-4 ml-4 pt-4 border-t-2 border-gray-300'></div>
//               <div>
//                 <h2 className='flex items-center justify-center mb-2 text-xl font-bold'>Attach money transfer slip</h2>
//                 <input type="file" className="w-full p-2 border border-gray-300 rounded text-sm" />
//               </div>

//             <button type="submit" className="w-full bg-green-500 text-white p-2 rounded font-semibold hover:bg-green-600 hover:scale-105">
//               Submit Payment
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PaymentPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import NavbarPayment from '../../components/NavbarPayment';

// const API_URL = "http://localhost:3111/api/v1";

// function PaymentPage() {
//   const searchParams = useSearchParams();
//   const [auction, setAuction] = useState(null);
//   const [winner, setWinner] = useState(null);  // ข้อมูลผู้ชนะบิด
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [qrCode, setQrCode] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState("pending");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const auctionId = searchParams.get('auctionId');

//   useEffect(() => {
//     if (!auctionId) {
//       setError("❌ ไม่พบข้อมูลการประมูล");
//       return;
//     }

//     fetch(`${API_URL}/auction/${auctionId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success") {
//           setAuction(data.data);
//           setAmount(data.data.currentPrice);

//           if (data.data.seller && data.data.seller.phone) {
//             setRecipient(data.data.seller.phone);
//             generateQR(data.data.seller.phone, data.data.currentPrice);
//           }

//           // ดึงข้อมูลผู้ชนะบิด
//           if (data.data.winner) {
//             setWinner(data.data.winner);  // สมมติว่า `winner` มีข้อมูลของผู้ชนะ
//           }

//         } else {
//           setError("❌ ไม่พบข้อมูลการประมูล");
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
//         setLoading(false);
//       });
//   }, [auctionId]);

//   const generateQR = async (phone, price) => {
//     if (!phone || !price) {
//       setError("⚠️ ข้อมูลไม่ครบถ้วน ไม่สามารถสร้าง QR Code ได้");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/payment/generate-qr`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ recipient: phone, amount: price, auctionId }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setQrCode(data.qrCode);
//         setPaymentStatus("completed");
//         setError(null);
//       } else {
//         setError("❌ สร้าง QR Code ล้มเหลว");
//       }
//     } catch (error) {
//       setError("❌ เกิดข้อผิดพลาดในการสร้าง QR Code");
//     }
//   };

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   return (
//     <>
//     <NavbarPayment />
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-blue-300 via-green-200 to-blue-300 text-gray-800">
//       <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* 🔥 ส่วนแสดงรายละเอียดสินค้า */}
//         <div className="p-4">
//           <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//             📦 รายละเอียดสินค้า
//           </h1>
//           {auction.image && auction.image.length > 0 && (
//             <img
//               src={auction.image[0]}
//               alt={auction.name}
//               className="w-full h-60 object-cover rounded-xl shadow-lg"
//             />
//           )}
//           <h2 className="text-xl font-semibold text-gray-800 mt-4">{auction.name}</h2>
//           <p className="text-gray-600">{auction.description}</p>
//           <p className="text-xl font-bold text-green-600 mt-2">💰 ราคา: {auction.currentPrice} บาท</p>

//           {/* 🔥 ข้อมูลผู้ขาย */}
//           <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ขาย</h3>
//             <p className="text-gray-800">📛 ชื่อ: {auction.seller?.name || "ไม่ระบุ"}</p>
//             <p className="text-gray-800">📧 Email: {auction.seller?.email || "ไม่มีข้อมูล"}</p>
//             <p className="text-gray-800">📞 เบอร์โทร: {auction.seller?.phone || "ไม่มีข้อมูล"}</p>
//           </div>
//         </div>

//         {/* 🔥 ส่วนแสดง QR Code และการชำระเงิน */}
//         <div className="p-4 flex flex-col justify-center items-center border-l border-gray-300">
//           <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//             💳 ชำระเงิน
//           </h1>

//           {qrCode ? (
//             <div className="text-center">
//               <h2 className="text-lg font-semibold text-gray-700">🔗 QR Code สำหรับการชำระเงิน</h2>
//               <img
//                 src={qrCode}
//                 alt="QR Code"
//                 className="w-48 h-48 border-2 border-gray-400 rounded-lg shadow-xl mt-4 mx-auto"
//               />
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center">⏳ กำลังสร้าง QR Code...</p>
//           )}

//           {/* 🔥 แสดงจำนวนเงิน */}
//           <p className="text-lg font-bold text-gray-800 mt-6">💰 จำนวนเงินที่ต้องจ่าย: {amount} บาท</p>

//           {/* 🔥 แสดงสถานะการชำระเงิน */}
//           <div className="mt-4 flex items-center">
//             <span className="text-lg font-semibold">สถานะ:</span>
//             {paymentStatus === "completed" ? (
//               <span className="ml-2 text-green-600 font-bold flex items-center">
//                 ✔ ชำระเงินแล้ว <span className="ml-2 w-4 h-4 bg-green-500 rounded-full"></span>
//               </span>
//             ) : (
//               <span className="ml-2 text-red-500 font-bold flex items-center">
//                 ⏳ รอชำระเงิน <span className="ml-2 w-4 h-4 bg-red-500 rounded-full"></span>
//               </span>
//             )}
//           </div>

//           {/* 🔥 แสดงข้อมูลผู้ชนะบิด */}
//           {winner && (
//             <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//               <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ชนะบิด</h3>
//               <p className="text-gray-800">📛 ชื่อ: {winner.name || "ไม่ระบุ"}</p>
//               <p className="text-gray-800">📧 Email: {winner.email || "ไม่มีข้อมูล"}</p>
//               <p className="text-gray-800">📞 เบอร์โทร: {winner.phone || "ไม่มีข้อมูล"}</p>
//               <p className="text-gray-800">🏠 ที่อยู่: {winner.address || "ไม่มีข้อมูล"}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }

// export default PaymentPage;

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavbarPayment from '../../components/NavbarPayment';

const API_URL = 'http://localhost:3111/api/v1';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('auctionId');

  const [auction, setAuction] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [paymentId, setPaymentId] = useState('');
  const [note, setNote] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const shippingFee = 60; // ค่าจัดส่ง
  const total = (auction?.currentPrice || 0) + shippingFee;

  useEffect(() => {
    const loadAll = async () => {
      if (!auctionId) return;

      const [auctionRes, qrRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/auction/${auctionId}`),
        fetch(`${API_URL}/payment/generate-qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ auctionId }),
        }),
        fetch(`${API_URL}/profile`, { credentials: 'include' }),
      ]);

      const auctionData = await auctionRes.json();
      if (auctionData.status === 'success') setAuction(auctionData.data);

      const qrData = await qrRes.json();
      if (qrData.success) {
        setQrCode(qrData.qrCode);
        setPaymentId(qrData.paymentId);
        setQrError('');
      } else {
        setQrError(qrData.error || 'ไม่สามารถสร้าง QR ได้');
      }

      const profileData = await profileRes.json();
      if (profileData.status === 'success') {
        const user = profileData.data;
        setRecipientName(user.name || '');
        setRecipientPhone(user.phone || '');

        const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
        if (defaultAddress) {
          setShippingAddress(defaultAddress.fullAddress);
        }
      }

      setLoading(false);
    };

    loadAll();
  }, [auctionId]);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSlipFile(file);
  };

  const handlePlaceOrder = async () => {
    if (!slipFile) return alert('กรุณาอัปโหลดสลิป');
    if (!shippingAddress) return alert('ไม่พบที่อยู่จัดส่ง');

    const formData = new FormData();
    formData.append('slip', slipFile);

    const uploadRes = await fetch(`${API_URL}/payment/upload-slip/${paymentId}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) return alert('❌ อัปโหลดสลิปล้มเหลว');

    const addressRes = await fetch(`${API_URL}/payment/shipping-address/${paymentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        address: shippingAddress,
        note,
      }),
    });

    const addressData = await addressRes.json();
    if (!addressData.success) return alert('❌ บันทึกที่อยู่ล้มเหลว');

    alert('✅ ส่งข้อมูลคำสั่งซื้อสำเร็จ กรุณารอการอนุมัติ');
  };

  if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8 pt-16">
      <NavbarPayment />
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ฝั่งซ้าย: ข้อมูลที่อยู่และรายการสินค้า */}
        <div className="p-8 space-y-10">
          {/* 📍 ที่อยู่จัดส่ง */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4">📍 ข้อมูลที่อยู่จัดส่ง</h2>
            <div className="text-gray-800 space-y-2">
              <p><strong>ชื่อผู้รับ:</strong> {recipientName || '—'}</p>
              <p><strong>เบอร์โทร:</strong> {recipientPhone || '—'}</p>
              <p><strong>ที่อยู่:</strong> {shippingAddress || '—'}</p>
            </div>
          </div>

          {/* รายการสินค้า */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4">🛒 รายการสินค้าที่สั่งซื้อ</h2>
            <div className="flex items-center gap-6">
              <img src={auction?.image?.[0]} className="w-24 h-24 object-cover rounded-lg border shadow-sm" />
              <div>
                <p className="font-semibold text-gray-900">{auction?.name}</p>
                <p className="text-sm text-gray-600">ตัวเลือกสินค้า: 2pin</p>
                <p className="text-sm text-gray-500 mt-1">จำนวน: 1</p>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📦 ความคิดเห็นถึงร้านค้า</label>
              <textarea
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ฝากข้อความถึงผู้ขาย เช่น กรุณาห่อกันกระแทก"
              />
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: วิธีชำระเงินและยอดรวม */}
        <div className="p-8 space-y-10">
          {/* วิธีชำระเงิน */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4">💳 วิธีชำระเงิน</h2>
            <div className="flex items-center gap-4">
              <input type="radio" checked readOnly className="w-5 h-5 text-green-600" />
              <label className="text-gray-800">QR PromptPay</label>
            </div>
            <div className="mt-6 text-center">
              {qrCode ? (
                <>
                  <img src={qrCode} alt="QR Promptpay" className="w-48 h-48 mx-auto border-2 border-green-400 rounded-lg shadow-md" />
                  <p className="text-sm text-gray-600 mt-4">📷 กรุณาสแกนเพื่อชำระเงิน</p>
                </>
              ) : qrError ? (
                <p className="text-red-600 text-sm mt-4">❌ {qrError}</p>
              ) : (
                <p className="text-gray-500 text-sm mt-4">⏳ กำลังสร้าง QR Code...</p>
              )}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📤 อัปโหลดสลิปหลังโอน</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlipUpload}
                className="block w-full text-sm text-gray-500 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* ยอดรวม */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <div className="text-right">
              <p className="text-sm text-gray-600">ราคาสินค้า: ฿{auction?.currentPrice}</p>
              <p className="text-sm text-gray-600">ค่าจัดส่ง: ฿{shippingFee}</p>
              <p className="text-2xl font-bold text-green-700 mt-4">ยอดชำระทั้งหมด: ฿{total}</p>
            </div>
          </div>

          {/* ปุ่มยืนยัน */}
          <div className="text-center">
            <button
              onClick={handlePlaceOrder}
              disabled={!paymentId}
              className="bg-green-600 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-green-500 transition duration-200 disabled:opacity-50"
            >
              ยืนยันคำสั่งซื้อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}