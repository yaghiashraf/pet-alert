import Link from 'next/link'

// Dark Mode UI - Version 2.0 - Force rebuild
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🐾</div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                PetAlert
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Reunite lost pets with their families instantly. 
            <span className="text-blue-400 font-semibold"> Powered by community</span>, 
            <span className="text-purple-400 font-semibold"> driven by love</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/report-lost"
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-red-500/25 hover:scale-105 transform"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-2xl group-hover:animate-pulse">🚨</span>
                Report Lost Pet
              </span>
            </Link>
            <Link
              href="/report-found"
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-green-500/25 hover:scale-105 transform"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-2xl group-hover:animate-bounce">🎉</span>
                I Found a Pet
              </span>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="text-5xl mb-6 text-center group-hover:animate-pulse">📍</div>
            <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Instant Local Alerts
            </h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Get notified immediately when pets go missing within 2 miles of your location. Real-time community network.
            </p>
          </div>
          
          <div className="group bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="text-5xl mb-6 text-center group-hover:animate-pulse">📱</div>
            <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              No App Required
            </h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Report found pets instantly via QR codes. No downloads, no accounts, no barriers to helping.
            </p>
          </div>
          
          <div className="group bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="text-5xl mb-6 text-center group-hover:animate-pulse">🏠</div>
            <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Community Powered
            </h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Your neighbors are your best allies in bringing pets home safely. Together we're stronger.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/nearby"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transform"
          >
            <span className="text-xl group-hover:animate-spin">🔍</span>
            View Nearby Lost Pets
          </Link>
        </div>

        {/* Stats section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Always Active</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-400 mb-2">2mi</div>
              <div className="text-gray-300 text-sm">Alert Radius</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-purple-400 mb-2">60s</div>
              <div className="text-gray-300 text-sm">Quick Report</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400 mb-2">Free</div>
              <div className="text-gray-300 text-sm">Always Free</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
