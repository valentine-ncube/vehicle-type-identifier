import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [image, setImage] = useState(null) // Holds the selected image
  const [preview, setPreview] = useState(null) // Holds the image preview
  const [prediction, setPrediction] = useState(null) // Holds the prediction result
  const [loading, setLoading] = useState(false) // State to manage loading state

  // Function to determine premium information
  const getInsuranceInfo = (vehicleType) => {
    const premiumInfo = {
      Suv: 'Premium starts at $300/month',
      Truck: 'Premium starts at $400/month',
      Sedan: 'Premium starts at $200/month',
    }

    // Normalize the vehicle type to match the keys in premiumInfo, ensures the function is case-insensitive
    const normalizedType =
      vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1).toLowerCase()
    return premiumInfo[normalizedType] || 'No premium information available'
  }
}
export default App
