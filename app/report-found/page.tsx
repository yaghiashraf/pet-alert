'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { getCurrentLocation } from '../../lib/geolocation'

function ReportFoundPetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const petId = searchParams.get('pet_id')
  
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    foundLocation: '',
    foundDate: new Date().toISOString().split('T')[0],
    description: '',
    imageFile: null as File | null
  })

  useEffect(() => {
    // Auto-detect location on load
    getCurrentLocation()
      .then(pos => setLocation({ lat: pos.latitude, lng: pos.longitude }))
      .catch(console.error)
  }, [])

  const handleLocationDetection = async () => {
    try {
      setLoading(true)
      const pos = await getCurrentLocation()
      setLocation({ lat: pos.latitude, lng: pos.longitude })
      
      // For now, just use coordinates as location
      setFormData(prev => ({
        ...prev,
        foundLocation: `${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`
      }))
    } catch (error) {
      console.error('Location detection failed:', error)
      alert('Location detection failed. Please enter address manually.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!file) return null

    // For now, we'll skip Cloudinary upload since it needs setup
    // In production, this would upload to Cloudinary
    console.log('Image upload would happen here:', file.name)
    return null
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

      // Insert found report
      const { error } = await supabase
        .from('found_reports')
        .insert([
          {
            pet_alert_id: petId,
            reporter_name: formData.reporterName || null,
            reporter_email: formData.reporterEmail || null,
            reporter_phone: formData.reporterPhone || null,
            found_location: formData.foundLocation,
            found_date: formData.foundDate,
            latitude: location.lat,
            longitude: location.lng,
            description: formData.description,
            image_url: imageUrl
          }
        ])
        .select()

      if (error) throw error

      // If this is for a specific pet, update the pet status
      if (petId) {
        await supabase
          .from('pet_alerts')
          .update({ 
            status: 'found',
            found_by: formData.reporterName || 'Anonymous',
            found_date: formData.foundDate
          })
          .eq('id', petId)
      }

      alert('Thank you for reporting! The pet owner will be notified immediately.')
      router.push('/nearby')
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎉 Report Found Pet
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-700 text-sm">
              <strong>Thank you for helping!</strong> Your report will immediately notify the pet owner and update the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Found Pet Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where did you find this pet? *
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleLocationDetection}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  📍 Use My Current Location
                </button>
                <input
                  type="text"
                  required
                  value={formData.foundLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, foundLocation: e.target.value }))}
                  placeholder="Enter address or describe the location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When did you find this pet? *
              </label>
              <input
                type="date"
                required
                value={formData.foundDate}
                onChange={(e) => setFormData(prev => ({ ...prev, foundDate: e.target.value }))}
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
                placeholder="Describe the pet's condition, behavior, or any other details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo of Found Pet
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
              <p className="text-xs text-gray-500 mt-1">
                A photo helps confirm this is the right pet
              </p>
            </div>

            {/* Contact Information (Optional) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Contact Information (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Providing your contact info helps the owner thank you and arrange pickup.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporterEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporterPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
            >
              {loading ? 'Submitting Report...' : '🎉 Submit Found Pet Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ReportFoundPet() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <ReportFoundPetContent />
    </Suspense>
  )
}