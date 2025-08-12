import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
const About = () => {
    return (
        <div>

            <div className='text-center text2-xl pt-10 text-gray-500'>
                <p>ABOUT <span className='text-gray-700 font-medium' >US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p> Welcome to consulto ,your trusted partner in managing your healthcare needs conviniently and efficiently. At consulto, we understand the challenges individuals face when it comes to sheduling doctor appointment and managing their health records.</p>
                    <p> Consulto is committed to excellence in healthcare technology. we continiously strive to enhence our platform , integrating the latest advancements to improve user experience and deliver superior service. Weather your're booking your first appointment or managing ongoing care, Consulto is here to support your every step of the way.</p>
                    <b className='text-gray-800'> Our Vission</b>
                    <p>Our vission st consulto is to create a seamless healthcare experierience for every user. We aim to bridge he gap between patients and healthcare providers, making easier for you to access the care you need, when you need.</p>
                </div>
            </div>

            <div className='text-xl my-4'>
                <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Efficiency:</b>
                    <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Convinience:</b>
                    <p>Access to a network of trusted healthcare proffessionals in your area</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Personalization</b>
                    <p>Tailored recommendations and reminders to help you stay on top of your health</p>
                </div>
            </div>

        </div>
    )
}

export default About