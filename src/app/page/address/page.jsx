'use client'
import React, { useState, useEffect } from 'react';
import provinces from '../../../../data/provinces.json';
import amphures from '../../../../data/amphures.json';
import districts from '../../../../data/districts.json';
import NavbarAddress from '../../components/NavbarAddress';

const API_URL = 'http://localhost:3111/api/v1';

const AddressForm = ({ onSubmit }) => {
  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedAmphure, setSelectedAmphure] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [zipcode, setZipcode] = useState('');

  const amphureOptions = amphures.filter(a => a.province_id === Number(selectedProvince));
  const districtOptions = districts.filter(d => d.amphure_id === Number(selectedAmphure));

  useEffect(() => {
    const district = districts.find(d => d.id === Number(selectedDistrict));
    if (district) setZipcode(district.zip_code.toString());
  }, [selectedDistrict]);

  const handleSubmit = async () => {
    const provinceName = provinces.find(p => p.id === Number(selectedProvince))?.name_th || '';
    const amphureName = amphures.find(a => a.id === Number(selectedAmphure))?.name_th || '';
    const districtName = districts.find(d => d.id === Number(selectedDistrict))?.name_th || '';

    const fullAddr = `${newAddress}, ต.${districtName}, อ.${amphureName}, จ.${provinceName} ${zipcode}`;
    const res = await fetch(`${API_URL}/profile/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          label: newLabel,
          fullAddress: fullAddr,
          name: newName,
          phone: newPhone
        }),
    });
    const data = await res.json();
    if (data.success) {
        setNewLabel('');
        setNewAddress('');
        setNewName('');
        setNewPhone('');
        setSelectedProvince('');
        setSelectedAmphure('');
        setSelectedDistrict('');
        setZipcode('');
        setRefresh(!refresh);
    }
};

  return (
    <div>
        <NavbarAddress />
        <div className="mt-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-gray-200 p-10 rounded-3xl shadow-2xl mb-12 max-w-4xl mx-auto">
            <h4 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">
             เพิ่มที่อยู่ใหม่
            </h4>
            <div className="flex flex-col md:flex-row gap-8">
            {/* ข้อมูลทั่วไป */}
            <div className="flex-1 space-y-6">
                <input
                type="text"
                placeholder=": ชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน "
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                type="text"
                placeholder=": ชื่อผู้รับ "
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                type="text"
                placeholder=": เบอร์โทรศัพท์ "
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <textarea
                placeholder=": บ้านเลขที่, ซอย, ถนน "
                rows={3}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>

            {/* ข้อมูลที่อยู่ */}
            <div className="flex-1 space-y-6">
                <select
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={selectedProvince}
                onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedAmphure('');
                    setSelectedDistrict('');
                    setZipcode('');
                }}
                >
                <option value="">-- เลือกจังหวัด --</option>
                {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                    {p.name_th}
                    </option>
                ))}
                </select>
                <select
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={selectedAmphure}
                onChange={(e) => {
                    setSelectedAmphure(e.target.value);
                    setSelectedDistrict('');
                    setZipcode('');
                }}
                >
                <option value="">-- เลือกอำเภอ --</option>
                {amphureOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                    {a.name_th}
                    </option>
                ))}
                </select>
                <select
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                <option value="">-- เลือกตำบล --</option>
                {districtOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                    {d.name_th}
                    </option>
                ))}
                </select>
                <input
                type="text"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-100 focus:outline-none"
                readOnly
                placeholder=": รหัสไปรษณีย์"
                value={zipcode}
                />
            </div>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => {
                    handleSubmit();
                    alert("เพิ่มที่อยู่เรียบร้อยแล้ว! ");
                    window.location.reload();
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                    ✅ บันทึกที่อยู่นี้
                </button>
            </div>
        </div>
    </div>
  );
};

export default AddressForm;