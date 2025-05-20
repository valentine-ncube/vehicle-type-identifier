import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [image, setImage] = useState(null) // State to hold the selected image
  const [preview, setPreview] = useState(null) // State to hold the image preview
  const [prediction, setPrediction] = useState(null) // State to hold the prediction result
  const [loading, setLoading] = useState(false) // State to manage loading state
}

export default App
