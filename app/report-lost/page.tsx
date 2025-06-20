'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { getCurrentLocation } from '../../lib/geolocation'

export default function ReportLostPet() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'dog' as 'dog' | 'cat' | 'other',
    breed: '',
    color: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    description: '',
    lastSeenLocation: '',
    lastSeenDate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    imageFile: null as File | null
  })

  const handleLocationDetection = async () => {
    try {
      setLoading(true)
      const pos = await getCurrentLocation()
      setLocation({ lat: pos.latitude, lng: pos.longitude })
      
      // Reverse geocode to get address
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pos.latitude}+${pos.longitude}&key=YOUR_OPENCAGE_API_KEY`
      )
      const data = await response.json()
      if (data.results[0]) {
        setFormData(prev => ({
          ...prev,
          lastSeenLocation: data.results[0].formatted
        }))
      }
    } catch (error) {
      console.error('Location detection failed:', error)
      alert('Location detection failed. Please enter address manually.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!file) return null

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'pet-alert') // You'll need to set this up in Cloudinary
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      alert('Please detect your location or enter it manually')
      return
    }

    setLoading(true)

    try {
      // Upload image if provided
      let imageUrl = null
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile)
      }

      // Insert into database
      const { data, error } = await supabase
        .from('pet_alerts')
        .insert([
          {
            pet_name: formData.petName,
            pet_type: formData.petType,
            breed: formData.breed,
            color: formData.color,
            size: formData.size,
            description: formData.description,
            image_url: imageUrl,
            last_seen_location: formData.lastSeenLocation,
            last_seen_date: formData.lastSeenDate,
            latitude: location.lat,
            longitude: location.lng,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            status: 'lost'
          }
        ])
        .select()

      if (error) throw error

      alert('Pet alert posted successfully! Nearby pet lovers will be notified.')
      router.push(`/alert/${data[0].id}`)
    } catch (error) {
      console.error('Error posting alert:', error)
      alert('Failed to post alert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-pulse">🚨</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Report Lost Pet
            </h1>
            <p className="text-gray-300 text-lg">Help us reunite your beloved pet with you</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pet Information */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-blue-400 mb-6">Pet Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.petName}
                    onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter your pet's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Pet Type *
                  </label>
                  <select
                    required
                    value={formData.petType}
                    onChange={(e) => setFormData(prev => ({ ...prev, petType: e.target.value as 'dog' | 'cat' | 'other' }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    <option value="dog">🐕 Dog</option>
                    <option value="cat">🐱 Cat</option>
                    <option value="other">🐾 Other</option>
                  </select>
                </div>
              </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="e.g., Golden Retriever"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Size *
                  </label>
                  <select
                    required
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as 'small' | 'medium' | 'large' }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    <option value="small">🐕‍🦺 Small (under 25 lbs)</option>
                    <option value="medium">🐕 Medium (25-60 lbs)</option>
                    <option value="large">🦮 Large (over 60 lbs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Color/Markings *
                </label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="e.g., Brown with white chest"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your pet's appearance, personality, any special markings..."
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Pet Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      imageFile: e.target.files?.[0] || null 
                    }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
                  />
                  <p className="text-gray-400 text-sm mt-2">📸 Upload a clear photo to help identify your pet</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-orange-400 mb-6">
                📍 Last Seen Location
              </h3>

              <div className="space-y-6">
                <button
                  type="button"
                  onClick={handleLocationDetection}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    Use My Current Location
                  </span>
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Address/Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastSeenLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                    placeholder="Where was your pet last seen?"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Date Last Seen *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.lastSeenDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-green-400 mb-6">
                📞 Contact Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  />
                  <p className="text-gray-400 text-sm mt-2">💡 Optional, but helps people contact you quickly</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-red-500/25 hover:scale-105 transform disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Posting Alert...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl">🚨</span>
                  Post Lost Pet Alert
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}