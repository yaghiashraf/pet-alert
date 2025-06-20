'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import QRCode from 'qrcode'

interface PetAlert {
  id: string
  created_at: string
  pet_name: string
  pet_type: string
  breed?: string
  color: string
  size: string
  description: string
  image_url?: string
  last_seen_location: string
  last_seen_date: string
  latitude: number
  longitude: number
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: string
  found_by?: string
  found_date?: string
}

interface FoundReport {
  id: string
  created_at: string
  reporter_name?: string
  reporter_email?: string
  reporter_phone?: string
  found_location: string
  found_date: string
  description: string
  image_url?: string
}

export default function PetAlertPage() {
  const params = useParams()
  const petId = params.id as string
  
  const [pet, setPet] = useState<PetAlert | null>(null)
  const [foundReports, setFoundReports] = useState<FoundReport[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    if (petId) {
      loadPetAlert()
      loadFoundReports()
      generateQRCode()
    }
  }, [petId])

  const loadPetAlert = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_alerts')
        .select('*')
        .eq('id', petId)
        .single()

      if (error) throw error
      setPet(data)
    } catch (error) {
      console.error('Error loading pet alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFoundReports = async () => {
    try {
      const { data, error } = await supabase
        .from('found_reports')
        .select('*')
        .eq('pet_alert_id', petId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFoundReports(data || [])
    } catch (error) {
      console.error('Error loading found reports:', error)
    }
  }

  const generateQRCode = async () => {
    try {
      const url = `${window.location.origin}/report-found?pet_id=${petId}`
      const qr = await QRCode.toDataURL(url)
      setQrCode(qr)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost':
        return 'bg-red-100 text-red-800'
      case 'found':
        return 'bg-yellow-100 text-yellow-800'
      case 'reunited':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'lost':
        return '🚨'
      case 'found':
        return '👀'
      case 'reunited':
        return '🎉'
      default:
        return '❓'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h1>
          <p className="text-gray-600 mb-6">This pet alert doesn&apos;t exist or has been removed.</p>
          <Link
            href="/nearby"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Other Lost Pets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pet.pet_name}</h1>
                <p className="text-blue-100">
                  {pet.pet_type.charAt(0).toUpperCase() + pet.pet_type.slice(1)} • {pet.size} • {pet.color}
                </p>
              </div>
              <span className={`${getStatusColor(pet.status)} px-3 py-1 rounded-full font-medium text-sm`}>
                {getStatusEmoji(pet.status)} {pet.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pet Photo */}
              {pet.image_url && (
                <div>
                  <img
                    src={pet.image_url}
                    alt={pet.pet_name}
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Pet Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pet Details</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2">{pet.pet_type.charAt(0).toUpperCase() + pet.pet_type.slice(1)}</span>
                  </div>
                  {pet.breed && (
                    <div>
                      <span className="font-medium text-gray-700">Breed:</span>
                      <span className="ml-2">{pet.breed}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-2">{pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <span className="ml-2">{pet.color}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>

              {/* Last Seen */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Last Seen</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="font-medium text-yellow-800 mb-1">
                    📍 {pet.last_seen_location}
                  </p>
                  <p className="text-yellow-700 text-sm">
                    🗓️ {formatDate(pet.last_seen_date)}
                  </p>
                </div>
              </div>

              {/* Found Reports */}
              {foundReports.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Found Reports</h2>
                  <div className="space-y-4">
                    {foundReports.map((report) => (
                      <div key={report.id} className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-green-800">
                            Found by {report.reporter_name || 'Anonymous'}
                          </h3>
                          <span className="text-green-600 text-sm">
                            {formatDate(report.found_date)}
                          </span>
                        </div>
                        <p className="text-green-700 text-sm mb-2">
                          📍 {report.found_location}
                        </p>
                        <p className="text-green-700 text-sm">{report.description}</p>
                        {report.image_url && (
                          <img
                            src={report.image_url}
                            alt="Found pet"
                            className="mt-2 w-32 h-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {pet.status === 'lost' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/report-found?pet_id=${pet.id}`}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3 px-6 rounded-lg transition-colors font-semibold"
                  >
                    🎉 I Found This Pet!
                  </Link>
                  <Link
                    href="/nearby"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-6 rounded-lg transition-colors font-semibold"
                  >
                    🔍 View Other Lost Pets
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2">
                  <p className="font-medium text-blue-800">{pet.contact_name}</p>
                  <p className="text-blue-700 text-sm">
                    📧 <a href={`mailto:${pet.contact_email}`} className="hover:underline">
                      {pet.contact_email}
                    </a>
                  </p>
                  {pet.contact_phone && (
                    <p className="text-blue-700 text-sm">
                      📞 <a href={`tel:${pet.contact_phone}`} className="hover:underline">
                        {pet.contact_phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Share This Alert</h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                    <img src={qrCode} alt="QR Code" className="mx-auto mb-2" />
                    <p className="text-gray-600 text-xs">
                      Scan to report finding this pet
                    </p>
                  </div>
                </div>
              )}

              {/* Report Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Info</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Posted: {formatDate(pet.created_at)}</p>
                  {pet.status === 'found' && pet.found_by && (
                    <p>Found by: {pet.found_by}</p>
                  )}
                  {pet.found_date && (
                    <p>Found on: {formatDate(pet.found_date)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}