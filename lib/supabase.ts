import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PetAlert {
  id: string
  created_at: string
  pet_name: string
  pet_type: 'dog' | 'cat' | 'other'
  breed?: string
  color: string
  size: 'small' | 'medium' | 'large'
  description: string
  image_url?: string
  last_seen_location: string
  last_seen_date: string
  latitude: number
  longitude: number
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: 'lost' | 'found' | 'reunited'
  found_by?: string
  found_date?: string
}

export interface FoundReport {
  id: string
  created_at: string
  pet_alert_id: string
  reporter_name?: string
  reporter_email?: string
  reporter_phone?: string
  found_location: string
  found_date: string
  latitude: number
  longitude: number
  description: string
  image_url?: string
}