import React from 'react'
import {createContext, useContext,  useState,} from 'react'
import {useNavigate,  useParams, } from 'react-router-dom'
import doc1 from '../assets/assets_frontend/doc1.png';
import doc2 from '../assets/assets_frontend/doc2.png';
import doc3 from '../assets/assets_frontend/doc3.png';
import doc4 from '../assets/assets_frontend/doc4.png';
import doc5 from '../assets/assets_frontend/doc5.png';
import doc6 from '../assets/assets_frontend/doc6.png';
import doc7 from '../assets/assets_frontend/doc7.png';

export const AppContext = createContext();

const AppContextProvider  = (props) => {

     const currencySymbol = '$';
const [doctors, setDoctors] = useState([
    { 
    id: 1,
    name: 'Dr. John Doe',
    img: doc1,
    speciality: 'General Physician',
    address: {
      line1: '123 Heart St',
      line2: 'Suite 200',
    },
   },
    
   
    {
    id: 2,
    name: 'Dr Naomi Gold',
    img: doc2,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
   
    {
    id: 3,
    name: 'Dr. Cedric',
    img: doc3,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
   
    {
    id: 4,
    name: 'Dr. Noella',
    img: doc4,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
   
    {
    id: 5,
    name: 'Dr. Blessing',
    img: doc5,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
   
    {
    id: 6,
    name: 'Dr. John ',
    img: doc6,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
   
    {
    id: 7,
    name: 'Dr. Kamdem Christian',
    img: doc7,
    speciality: 'Neurology',
    address: {
      line1: '456 Brain Rd',
      line2: 'Office 304',
    },
  },
  ]);
    const value = {
        doctors,
        setDoctors,
        currencySymbol
    };

  return (
    <AppContext.Provider value={value}>
        {props.children}
      </AppContext.Provider>
  )
}

export default AppContextProvider