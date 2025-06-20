'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getCurrentLocation } from '../../lib/geolocation'
import Link from 'next/link'

interface NearbyPet {
  id: string
  pet_name: string
  pet_type: string
  color: string
  size: string
  description: string
  image_url?: string
  last_seen_location: string
  last_seen_date: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  distance_km: number
  created_at: string
}

export default function NearbyPets() {
  const [pets, setPets] = useState<NearbyPet[]>([])
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [radius, setRadius] = useState(3.2) // 2 miles in km

  useEffect(() => {
    loadNearbyPets()
  }, [])

  const loadNearbyPets = async () => {
    try {
      setLoading(true)
      
      // Get user location
      const pos = await getCurrentLocation()
      setLocation({ lat: pos.latitude, lng: pos.longitude })
      
      // Query nearby pets using the database function
      const { data, error } = await supabase
        .rpc('find_nearby_pets', {
          search_lat: pos.latitude,
          search_lng: pos.longitude,
          radius_km: radius
        })

      if (error) throw error

      setPets(data || [])
    } catch (error) {
      console.error('Error loading nearby pets:', error)
      alert('Failed to load nearby pets. Please allow location access and try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m away`
    }
    return `${km.toFixed(1)}km away`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby lost pets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Lost Pets Near You
          </h1>
          <p className="text-gray-600 mb-4">
            {pets.length} lost pets found within {radius}km of your location
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setRadius(1.6)}
              className={`px-4 py-2 rounded-md transition-colors ${
                radius === 1.6 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              1 mile
            </button>
            <button
              onClick={() => setRadius(3.2)}
              className={`px-4 py-2 rounded-md transition-colors ${
                radius === 3.2 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              2 miles
            </button>
            <button
              onClick={() => setRadius(8)}
              className={`px-4 py-2 rounded-md transition-colors ${
                radius === 8 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              5 miles
            </button>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Lost Pets Nearby!
            </h2>
            <p className="text-gray-600 mb-6">
              Great news - there are currently no reported lost pets in your area.
            </p>
            <Link
              href="/report-lost"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Report a Lost Pet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {pet.image_url && (
                  <img
                    src={pet.image_url}
                    alt={pet.pet_name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {pet.pet_name}
                    </h3>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      LOST
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-medium">Type:</span> {pet.pet_type.charAt(0).toUpperCase() + pet.pet_type.slice(1)}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span> {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {pet.color}
                    </p>
                    <p>
                      <span className="font-medium">Last seen:</span> {formatDate(pet.last_seen_date)}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {pet.last_seen_location}
                    </p>
                    <p className="text-blue-600 font-medium">
                      📍 {formatDistance(pet.distance_km)}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {pet.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/alert/${pet.id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-md transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/report-found?pet_id=${pet.id}`}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-md transition-colors text-sm font-medium"
                    >
                      I Found This Pet
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={loadNearbyPets}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  )
}