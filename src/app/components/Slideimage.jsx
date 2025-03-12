"use client";
import React, { useState, useEffect } from 'react';
import Frame13 from '../images/Frame13.jpg';
import Frame14 from '../images/Frame14.jpg';
import Frame15 from '../images/Frame15.jpg';
import Frame18 from '../images/Frame18.jpg';

const images = [
    Frame13,
    Frame14,
    Frame15,
    Frame18,
];

const Slideimage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      setCurrentIndex(images.length - 2); // กลับไปที่ภาพสุดท้ายเมื่อถึงภาพแรก
    }
  };

  const nextSlide = () => {
    if (currentIndex < images.length - 2) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0); // กลับไปที่ภาพแรกเมื่อถึงภาพสุดท้าย
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // เปลี่ยนภาพทุกๆ 3 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อคอมโพเนนต์ถูก unmount
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 50}%)` }}>
        {images.map((image, index) => (
          <img key={index} src={image.src} alt={`Slide ${index}`} className="w-1/2 h-auto flex-shrink-0 px-2 rounded-2xl p-2" />
        ))}
      </div>
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 left-[-1rem] transform -translate-y-1/2 text-yellow-400 px-4 py-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentIndex === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 right-[-1rem] transform -translate-y-1/2 text-yellow-400 px-4 py-2 ${currentIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentIndex === images.length - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 9.22a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72h-5.69a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Slideimage;
