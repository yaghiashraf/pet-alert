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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🚨 Report Lost Pet
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.petName}
                  onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Type *
                </label>
                <select
                  required
                  value={formData.petType}
                  onChange={(e) => setFormData(prev => ({ ...prev, petType: e.target.value as 'dog' | 'cat' | 'other' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  required
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as 'small' | 'medium' | 'large' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small (under 25 lbs)</option>
                  <option value="medium">Medium (25-60 lbs)</option>
                  <option value="large">Large (over 60 lbs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color/Markings *
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Brown with white chest"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your pet's appearance, personality, any special markings..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  imageFile: e.target.files?.[0] || null 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Last Seen Location
              </h3>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleLocationDetection}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  📍 Use My Current Location
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address/Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastSeenLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                    placeholder="Where was your pet last seen?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Last Seen *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.lastSeenDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
            >
              {loading ? 'Posting Alert...' : '🚨 Post Lost Pet Alert'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}