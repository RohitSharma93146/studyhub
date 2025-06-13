import React from 'react'
import { assets } from '../../../assets/assets'

const Companies = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <p className='text-base'>Trusted by learners from</p>
      <div className='flex flex-wrap justify-center items-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28' />
        <img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28' />
        <img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28' />
      </div>
    </div>
  )
}

export default Companies