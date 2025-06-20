-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create pet_alerts table
CREATE TABLE pet_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    pet_type VARCHAR(20) NOT NULL CHECK (pet_type IN ('dog', 'cat', 'other')),
    breed VARCHAR(100),
    color VARCHAR(100) NOT NULL,
    size VARCHAR(20) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    description TEXT NOT NULL,
    image_url TEXT,
    last_seen_location TEXT NOT NULL,
    last_seen_date DATE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_Point(longitude, latitude)) STORED,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'lost' CHECK (status IN ('lost', 'found', 'reunited')),
    found_by VARCHAR(100),
    found_date DATE
);

-- Create found_reports table
CREATE TABLE found_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pet_alert_id UUID NOT NULL REFERENCES pet_alerts(id) ON DELETE CASCADE,
    reporter_name VARCHAR(100),
    reporter_email VARCHAR(255),
    reporter_phone VARCHAR(20),
    found_location TEXT NOT NULL,
    found_date DATE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_Point(longitude, latitude)) STORED,
    description TEXT NOT NULL,
    image_url TEXT
);

-- Create indexes for performance
CREATE INDEX idx_pet_alerts_location ON pet_alerts USING GIST (location);
CREATE INDEX idx_pet_alerts_status ON pet_alerts (status);
CREATE INDEX idx_pet_alerts_created_at ON pet_alerts (created_at DESC);
CREATE INDEX idx_found_reports_location ON found_reports USING GIST (location);
CREATE INDEX idx_found_reports_pet_alert_id ON found_reports (pet_alert_id);

-- Create function to find nearby pets
CREATE OR REPLACE FUNCTION find_nearby_pets(
    search_lat DECIMAL,
    search_lng DECIMAL,
    radius_km DECIMAL DEFAULT 3.2
)
RETURNS TABLE (
    id UUID,
    pet_name VARCHAR,
    pet_type VARCHAR,
    color VARCHAR,
    size VARCHAR,
    description TEXT,
    image_url TEXT,
    last_seen_location TEXT,
    last_seen_date DATE,
    contact_name VARCHAR,
    contact_email VARCHAR,
    contact_phone VARCHAR,
    distance_km DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.id,
        pa.pet_name,
        pa.pet_type,
        pa.color,
        pa.size,
        pa.description,
        pa.image_url,
        pa.last_seen_location,
        pa.last_seen_date,
        pa.contact_name,
        pa.contact_email,
        pa.contact_phone,
        (ST_Distance(pa.location, ST_Point(search_lng, search_lat)::geography) / 1000)::DECIMAL as distance_km,
        pa.created_at
    FROM pet_alerts pa
    WHERE pa.status = 'lost'
    AND ST_DWithin(pa.location, ST_Point(search_lng, search_lat)::geography, radius_km * 1000)
    ORDER BY pa.location <-> ST_Point(search_lng, search_lat)::geography;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE pet_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public service)
CREATE POLICY "Anyone can view pet alerts" ON pet_alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pet alerts" ON pet_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their own pet alerts" ON pet_alerts FOR UPDATE USING (true);

CREATE POLICY "Anyone can view found reports" ON found_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert found reports" ON found_reports FOR INSERT WITH CHECK (true);