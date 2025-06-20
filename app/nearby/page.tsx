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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 border border-gray-700">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">🔍 Finding nearby lost pets...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4 animate-pulse">🔍</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Lost Pets Near You
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            <span className="text-blue-400 font-semibold">{pets.length} lost pets</span> found within <span className="text-purple-400 font-semibold">{radius}km</span> of your location
          </p>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setRadius(1.6)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                radius === 1.6 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm'
              }`}
            >
              📍 1 mile
            </button>
            <button
              onClick={() => setRadius(3.2)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                radius === 3.2 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm'
              }`}
            >
              📍 2 miles
            </button>
            <button
              onClick={() => setRadius(8)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                radius === 8 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm'
              }`}
            >
              📍 5 miles
            </button>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 border border-gray-700 max-w-md mx-auto">
              <div className="text-6xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                No Lost Pets Nearby!
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Great news! There are currently no reported lost pets in your area. Your community pets are safe at home.
              </p>
              <Link
                href="/report-lost"
                className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 transform"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🚨</span>
                  Report a Lost Pet
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <div key={pet.id} className="group bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden hover:border-red-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10">
                {pet.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={pet.image_url}
                      alt={pet.pet_name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {pet.pet_name}
                    </h3>
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      🚨 LOST
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-300 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">🐾</span>
                      <span className="font-medium text-gray-400">Type:</span> 
                      <span className="text-white">{pet.pet_type.charAt(0).toUpperCase() + pet.pet_type.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">📏</span>
                      <span className="font-medium text-gray-400">Size:</span> 
                      <span className="text-white">{pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">🎨</span>
                      <span className="font-medium text-gray-400">Color:</span> 
                      <span className="text-white">{pet.color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">📅</span>
                      <span className="font-medium text-gray-400">Last seen:</span> 
                      <span className="text-white">{formatDate(pet.last_seen_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">📍</span>
                      <span className="font-medium text-gray-400">Location:</span> 
                      <span className="text-white text-xs">{pet.last_seen_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">📍</span>
                      <span className="font-bold text-red-400">{formatDistance(pet.distance_km)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">
                    {pet.description}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/alert/${pet.id}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25"
                    >
                      👁️ View Details
                    </Link>
                    <Link
                      href={`/report-found?pet_id=${pet.id}`}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-green-500/25"
                    >
                      🎉 I Found This Pet!
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={loadNearbyPets}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              Refresh Search
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}