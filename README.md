# 🐾 PetAlert

A hyper-local lost pet recovery network that instantly connects pet owners with their community when pets go missing.

## Features

- **🚨 Quick Lost Pet Reporting** - 60-second posting with photo and location
- **📍 Proximity-Based Alerts** - 2-mile radius community notifications  
- **🎉 Anonymous Found Reporting** - No account needed to report found pets
- **📱 QR Code Sharing** - Easy sharing via scannable codes
- **🔍 Real-time Pet Search** - Location-based discovery of nearby lost pets

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Hosting**: Vercel
- **Images**: Cloudinary (optional)
- **Notifications**: EmailJS

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd pet-alert
npm install
```

### 2. Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_emailjs_user_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### 3. Database Setup
1. Create a Supabase project
2. Run the SQL from `supabase-setup.sql` in the SQL Editor
3. Update your environment variables

### 4. Optional Services
- **EmailJS**: For email notifications
- **Cloudinary**: For image hosting (or use Supabase storage)

### 5. Run Development Server
```bash
npm run dev
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Build
```bash
npm run build
npm start
```

## Cost Breakdown

- **Domain**: ~$8/year (Namecheap)
- **Supabase**: Free tier (50k rows, 1GB storage)
- **Vercel**: Free tier (100GB bandwidth)
- **Cloudinary**: Free tier (25 credits/month)
- **EmailJS**: Free tier (200 emails/month)

**Total**: $8/year!

## Key Features

### Lost Pet Posting
- Quick form with pet details
- Photo upload capability
- GPS location detection
- Contact information

### Nearby Pet Discovery
- Real-time proximity search
- Distance filtering (1-5 miles)
- Photo galleries
- Direct contact options

### Found Pet Reporting
- Anonymous reporting option
- GPS location capture
- Photo evidence upload
- Automatic owner notification

### QR Code Integration
- Shareable alert codes
- Direct found pet reporting
- No app installation required

## Database Schema

### pet_alerts
- Pet information and photos
- Location data with geographic indexing
- Contact details
- Status tracking (lost/found/reunited)

### found_reports
- Sighting reports linked to alerts
- Reporter contact info (optional)
- Location and photo evidence
- Automatic matching system

## Future Enhancements

- SMS notifications via Twilio
- Push notifications for browser users
- Social media integration
- Volunteer network features
- Pet profile pages with vaccination records
- Veterinary clinic partnerships

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for reuniting pets with their families.
