import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🐾 PetAlert
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Reunite lost pets with their families instantly. Get alerts when pets go missing in your neighborhood.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report-lost"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              🚨 Report Lost Pet
            </Link>
            <Link
              href="/report-found"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              🎉 I Found a Pet
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Instant Local Alerts</h3>
            <p className="text-gray-600">
              Get notified immediately when pets go missing within 2 miles of your location.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">No App Required</h3>
            <p className="text-gray-600">
              Report found pets instantly via QR codes. No downloads or accounts needed.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Community Powered</h3>
            <p className="text-gray-600">
              Your neighbors are your best allies in bringing pets home safely.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/nearby"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🔍 View Nearby Lost Pets
          </Link>
        </div>
      </div>
    </div>
  )
}
