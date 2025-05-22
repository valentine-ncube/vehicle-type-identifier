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

  //Handling image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // Helper: convert File → Base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // strip off the "data:*/*;base64," prefix
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })

  //Submitting to the API
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      alert('Please upload an image!')
      return
    }

    setLoading(true)
    setPrediction(null)

    try {
      // 1) Convert image to Base64
      const base64 = await toBase64(image)

      // 2) Prepare Vision API request payload
      const payload = {
        requests: [
          {
            image: { content: base64 },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
          },
        ],
      }

      // 3) Call Google Vision REST endpoint
      const API_Key = process.env.REACT_APP_VISION_KEY
      const URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_Key}`
      const { data } = await axios.post(URL, payload)

      // 4) Extract labels and pick a matching vehicle type
      const labels = data.responses[0].labelAnnotations.map(
        (l) => l.description
      )
      const vehicle =
        labels.find((l) => /^(suv|truck|sedan|car|vehicle)$/i.test(l)) ||
        'Unknown'

      setPrediction({ tagName: vehicle })
    } catch (error) {
      console.error('Error:', error)
      alert('Vision API error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>Vehicle Type Identification</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Upload'}
        </button>
      </form>

      {preview && (
        <div className="preview-container">
          <img
            src={preview}
            alt="Uploaded Preview"
            className="uploaded-image"
          />
        </div>
      )}

      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <p>
            <strong>Type:</strong> {prediction.tagName}
          </p>
          <p>
            <strong>Insurance Info:</strong>{' '}
            {getInsuranceInfo(prediction.tagName)}
          </p>
        </div>
      )}
    </div>
  )
}
export default App
