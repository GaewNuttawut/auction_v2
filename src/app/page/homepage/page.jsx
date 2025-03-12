'use client';

import React from 'react'
import NavbarCustomer from '../../components/NavbarCustomer';
import Image from 'next/image'
import logo from '../../images/Logo.png'
import ButtonMain from '../../components/ButtonMain'
import Slideimage from '../../components/Slideimage'
import Productpage from '../product/page'
import ProducttPage from '../product-1/page'
import ContactPage from '../contact/page'
import ScrollToTop from '../../components/ScolltoTop'
import ButtonMainCustomer from '../../components/ButtonMainCustomer'
import CreateAuction from '../../components/CreateAuction';
import Category from '../../components/Category';

function HomePage() {
  return (
    <div className="min-h-screen p-0 m-0 font-[family-name:var(--font-geist-sans)] bg-[#333333] md:p-0">
        <div>
            <NavbarCustomer />
        </div>
        <div className="pt-16">
            <div className="flex flex-col items-center gap-4 pt-8 mx-0">
                <Image 
                    src={logo}
                    width={400}
                    height={300}
                    alt="logo"
                />
                <div>
                    <ButtonMainCustomer />
                </div>
            </div>
        </div>
        <div className="pt-2 w-full bg-[#787878] p-4 mx-0">
            <Slideimage />
          </div>
          <div id="auction" className="pt-2 w-full h-auto bg-white mx-0 p-4">
            <Productpage />
          </div>
          <div id="product_v1" className="pt-2 w-full h-auto bg-[#787878] mx-0 p-4">
            <ProducttPage />
          </div>
          <div id="contactt" className="w-full h-auto bg-[#333333]  ">
            <ContactPage />
          </div>
          <div>
            <Category/>
          </div>
          {/* <div>
            <CreateAuction />
          </div> */}
          <div>
            <ScrollToTop />
          </div>
    </div>
  )
}

export default HomePage