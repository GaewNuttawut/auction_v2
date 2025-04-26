import React from 'react'
import Image from 'next/image';
import img_map from '../../../../public/images/img_map.jpg'
import contact from '../../../../public/images/contact2.jpg'

function ContactPage() {
  return (
    <div className='flex'>
      <div className="w-1/2">
        <Image src={contact} alt="Map" className="w-full h-auto" />
      </div>
      
      <div className="flex flex-col bg-[#333333] w-1/2">
        <h1 className="text-4xl text-center mt-4 text-white">Contact us</h1>
        <div>
          <div className="flex items-center text-2xl text-start text-white pl-6">
            <div className='bg-gradient-to-tr from-yellow-400 to-red-300 p-4 rounded-full flex items-center hover:bg-yellow-500 hover:text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <a className='pl-4'>099-999-9999</a>
          </div>

          <div className="flex items-center text-2xl text-start text-white pl-6 pt-1">
            <div className='bg-gradient-to-tr from-yellow-400 to-red-300 p-4 rounded-full flex items-center hover:bg-yellow-500 hover:text-white'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>
            </div>
            <a className='pl-4'>facebook.com/NutKanAuction</a>
          </div>

          <div className="flex items-center text-2xl text-start text-white pl-6 pt-1">
            <div className='bg-gradient-to-tr from-yellow-400 to-red-300 p-4 rounded-full flex items-center hover:bg-yellow-500 hover:text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <a className='pl-4'>@NutKanAuction</a>
          </div>

          <div className="flex items-center text-2xl text-start text-white pl-6 pt-1">
            <div className='bg-gradient-to-tr from-yellow-400 to-red-300 p-4 rounded-full flex items-center hover:bg-yellow-500 hover:text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <a className='pl-4'>nutkanauction@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage