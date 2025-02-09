import React from 'react'
import { Navbar } from './Navbar'
import './MapPage.css'

export const MapPage = () => {
  return (
    <div className='mappage'>
        <Navbar page="map"/>
        <h2 className='maphead'></h2>
        <div className='mapimgdiv'>
          <img className='mapimg' src="src/assets/map.png" alt="iitblogorfomer"/>
        </div>
    </div>
  )
}
