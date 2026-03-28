'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Search, MapPin, Home, ChevronRight, Sparkles,
  TrendingUp, Building2, Droplets, Wind, Leaf,
  BarChart3, Shield, CheckCircle, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const dummyProperties = [
  {
    id: '1',
    title: 'Luxury Penthouse with City Views',
    location: 'Indiranagar, Bengaluru',
    price: 75000000,
    beds: 4,
    baths: 5,
    sqft: 4200,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200',
  },
  {
    id: '2',
    title: 'Contemporary Villa with Pool',
    location: 'Whitefield, Bengaluru',
    price: 120000000,
    beds: 5,
    baths: 6,
    sqft: 5800,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200',
  },
  {
    id: '3',
    title: 'Modern Apartment in Prime Location',
    location: 'Koramangala, Bengaluru',
    price: 45000000,
    beds: 3,
    baths: 4,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
  },
  {
    id: '4',
    title: 'Elegant Townhouse with Garden',
    location: 'HSR Layout, Bengaluru',
    price: 58000000,
    beds: 4,
    baths: 4,
    sqft: 3800,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200',
  },
  {
    id: '5',
    title: 'Sophisticated Duplex Residence',
    location: 'Jayanagar, Bengaluru',
    price: 62000000,
    beds: 4,
    baths: 5,
    sqft: 4000,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
  },
  {
    id: '6',
    title: 'Exclusive Waterfront Estate',
    location: 'Hebbal Lake, Bengaluru',
    price: 150000000,
    beds: 6,
    baths: 7,
    sqft: 7200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
  },
]

const cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai']

const marketData = [
  { city: 'Bengaluru', growth: '+12%', trend: 'up' },
  { city: 'Mumbai', growth: '+8%', trend: 'up' },
  { city: 'Chennai', growth: '+15%', trend: 'up' },
  { city: 'Hyderabad', growth: '+10%', trend: 'up' },
  { city: 'Delhi', growth: '+6%', trend: 'up' },
]

// Role to dashboard path mapping
const getRoleDashboardPath = (role?: string): string => {
  const roleMap: Record<string, string> = {
    'ADMIN': '/admin',
    'GOVERNMENT': '/government',
    'BUYER': '/buyer',
    'OWNER': '/owner',
    'BROKER': '/broker',
  }
  return roleMap[role || ''] || '/dashboard'
}

export default function HomePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy')
  const dashboardPath = getRoleDashboardPath(session?.user?.role)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Background Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.92), rgba(255,255,255,0.85), rgba(250,250,249,0.95)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
    
      {/* Market Ticker */}
      <div className="bg-amber-50/80 backdrop-blur-sm border-b border-amber-100/50 py-3 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...marketData, ...marketData].map((data, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="font-serif text-stone-900">{data.city}</span>
              <span className="text-amber-700 font-medium">{data.growth}</span>
              <TrendingUp className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {session ? (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-full px-5 py-2 mb-8">
                <User className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
                <span className="text-sm text-amber-900 font-light">
                  Welcome back, <span className="font-medium">{session.user?.name?.split(' ')[0] || 'User'}</span>
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
                <span className="text-sm text-amber-900 font-light">AI-Powered Property Intelligence</span>
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 leading-tight tracking-tight">
              {session ? 'Find Your Next Investment' : 'Discover Your Dream Home'}
            </h1>
            <p className="text-xl text-stone-600 mb-12 font-light leading-relaxed">
              Exceptional properties with satellite-verified analytics and blockchain certification.
              Find your perfect residence with data-driven insights.
            </p>

            {/* Search Box */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-2xl p-8 max-w-3xl mx-auto">
              <div className="flex gap-3 mb-8 border-b border-stone-200">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-6 py-3 text-sm font-light border-b-2 transition-colors ${
                    activeTab === 'buy'
                      ? 'border-amber-700 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActiveTab('rent')}
                  className={`px-6 py-3 text-sm font-light border-b-2 transition-colors ${
                    activeTab === 'rent'
                      ? 'border-amber-700 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Rent
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" strokeWidth={1.5} />
                  <select className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent font-light">
                    <option>Select City</option>
                    {cities.map(city => <option key={city}>{city}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <select className="w-full px-4 py-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent font-light">
                    <option>Property Type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Townhouse</option>
                  </select>
                </div>

                <Link href="/explore" className="w-full">
                  <Button variant="default" size="lg" className="w-full bg-amber-700 hover:bg-amber-800 py-4 font-light">
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Info Section - Only for logged in users */}
      {session && (
        <section className="py-12 bg-gradient-to-br from-amber-50/80 to-stone-50/80 backdrop-blur-sm border-y border-amber-100/50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-1">
                      {session.user?.name || 'Welcome'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-xs font-medium text-amber-900">
                        {session.user?.role || 'Member'}
                      </span>
                      <span className="text-sm text-stone-600 font-light">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link href={dashboardPath} className="flex-1 md:flex-initial">
                    <Button variant="default" size="lg" className="w-full bg-amber-700 hover:bg-amber-800 text-white font-light">
                      <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                      View Dashboard
                    </Button>
                  </Link>
                  {session.user?.role === 'OWNER' && (
                    <Link href="/owner/properties/new" className="flex-1 md:flex-initial">
                      <Button variant="outline" size="lg" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 font-light">
                        <Building2 className="w-4 h-4" strokeWidth={1.5} />
                        List Property
                      </Button>
                    </Link>
                  )}
              
                </div>
              </div>

              {/* Quick Stats for logged in user */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-stone-200">
                <div className="text-center">
                  <p className="text-2xl font-serif text-amber-700 mb-1">
                    {session.user?.role === 'OWNER' ? '3' : '12'}
                  </p>
                  <p className="text-xs text-stone-600 font-light">
                    {session.user?.role === 'OWNER' ? 'Active Listings' : 'Saved Properties'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif text-amber-700 mb-1">5</p>
                  <p className="text-xs text-stone-600 font-light">Recent Searches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif text-amber-700 mb-1">
                    {session.user?.role === 'OWNER' ? '28' : '8'}
                  </p>
                  <p className="text-xs text-stone-600 font-light">
                    {session.user?.role === 'OWNER' ? 'Total Views' : 'Property Views'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif text-amber-700 mb-1">2</p>
                  <p className="text-xs text-stone-600 font-light">Messages</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      </div>
      {/* End Hero Background Section */}

      {/* Spectron Analytics Cards */}
      <section id="analytics" className="py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-stone-900 mb-4 tracking-tight">Property Intelligence Metrics</h2>
            <p className="text-stone-600 font-light">Real-time data from satellite imagery and environmental analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Urban Growth */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-stone-900 text-lg">Urban Growth</h3>
                <Building2 className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
              </div>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f5f5f4" strokeWidth="8"/>
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke="#b45309" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 54 * 0.78} ${2 * Math.PI * 54 * 0.22}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-serif text-stone-900">78</span>
                  <span className="text-xs text-stone-500 font-light">Development Index</span>
                </div>
              </div>
              <p className="text-stone-600 text-sm text-center font-light">High urban density with strong infrastructure growth</p>
            </div>

            {/* Flood Safety */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-stone-900 text-lg">Flood Safety</h3>
                <Droplets className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
              </div>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f5f5f4" strokeWidth="8"/>
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke="#15803d" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 54 * 0.92} ${2 * Math.PI * 54 * 0.08}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-serif text-stone-900">92</span>
                  <span className="text-xs text-stone-500 font-light">Safety Score</span>
                </div>
              </div>
              <p className="text-stone-600 text-sm text-center font-light">Excellent flood protection with minimal historical risk</p>
            </div>

            {/* Air Quality */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-stone-900 text-lg">Air Quality</h3>
                <Wind className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
              </div>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f5f5f4" strokeWidth="8"/>
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke="#ca8a04" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 54 * 0.65} ${2 * Math.PI * 54 * 0.35}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-serif text-stone-900">65</span>
                  <span className="text-xs text-stone-500 font-light">AQI Index</span>
                </div>
              </div>
              <p className="text-stone-600 text-sm text-center font-light">Moderate air quality with seasonal variation patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Prediction */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-6 tracking-tight">
                15-Year Historical Analytics + 5-Year Forecasts
              </h2>
              <p className="text-lg text-stone-600 mb-8 font-light leading-relaxed">
                Our AI models analyze satellite imagery and environmental data from 2009-2024 to predict
                property values and urban development through 2029.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                  <span className="text-stone-700 font-light">Google Earth Engine satellite data integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                  <span className="text-stone-700 font-light">NDVI vegetation analysis over 15 years</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                  <span className="text-stone-700 font-light">Flood risk timeline with event markers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                  <span className="text-stone-700 font-light">Urban sprawl predictive modeling</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"
                alt="Analytics dashboard"
                width={700}
                height={500}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Urban Sprawl Comparison */}
      <section className="py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-stone-900 mb-4 tracking-tight">Urban Development Timeline</h2>
            <p className="text-stone-600 font-light">Satellite imagery comparison showing urban growth patterns</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg z-10 border border-stone-200">
                <span className="text-amber-900 font-serif text-sm">2010</span>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800"
                alt="2010 satellite view"
                width={600}
                height={400}
                className="w-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative group bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg z-10 border border-stone-200">
                <span className="text-amber-900 font-serif text-sm">2024</span>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800"
                alt="2024 satellite view"
                width={600}
                height={400}
                className="w-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Verification */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-3xl p-12 text-center">
            <Shield className="w-16 h-16 text-amber-700 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-3xl font-serif text-stone-900 mb-4 tracking-tight">Blockchain Verified Properties</h2>
            <p className="text-stone-600 mb-6 font-light leading-relaxed">
              Every property analysis is cryptographically hashed and minted on Polygon blockchain
              for immutable verification and transparency.
            </p>
            <div className="inline-flex items-center gap-3 bg-white border border-stone-200 rounded-lg px-5 py-3">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
              <span className="font-mono text-sm text-stone-600">0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-3 tracking-tight">Featured Properties</h2>
              <p className="text-stone-600 font-light">Handpicked exclusive residences for discerning buyers</p>
            </div>
            <Link href="/explore" className="hidden md:flex items-center gap-2 text-amber-700 hover:text-amber-800 transition font-light">
              View all
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyProperties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-stone-900 mb-3 group-hover:text-amber-900 transition tracking-tight">
                    {property.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 flex items-center gap-2 font-light">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                    <div>
                      <p className="text-2xl font-serif text-stone-900 tracking-tight">
                        ₹{(property.price / 10000000).toFixed(2)}Cr
                      </p>
                      <p className="text-sm text-stone-500 mt-1 font-light">
                        {property.beds} Beds · {property.baths} Baths · {property.sqft.toLocaleString()} sqft
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/explore">
              <Button variant="outline" size="lg" className="border-amber-700 text-amber-700 hover:bg-amber-50 font-light">
                View all Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-serif text-amber-700 mb-2">2,500+</p>
              <p className="text-stone-600 font-light">Properties Verified</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-serif text-amber-700 mb-2">1,200+</p>
              <p className="text-stone-600 font-light">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-serif text-amber-700 mb-2">15+</p>
              <p className="text-stone-600 font-light">Years Data History</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-serif text-amber-700 mb-2">5</p>
              <p className="text-stone-600 font-light">Major Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
                <span className="text-xl font-serif text-white">Nestiva</span>
              </div>
              <p className="text-sm text-stone-400 font-light leading-relaxed">
                Your trusted partner in finding exceptional luxury properties with AI-powered intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Explore</h3>
              <ul className="space-y-3 text-sm text-stone-400 font-light">
                <li><Link href="/explore" className="hover:text-white transition">Properties</Link></li>
                <li><Link href="#analytics" className="hover:text-white transition">Analytics</Link></li>
                <li><Link href="#featured" className="hover:text-white transition">Featured</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-stone-400 font-light">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms & Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Cities</h3>
              <ul className="space-y-3 text-sm text-stone-400 font-light">
                {cities.map(city => (
                  <li key={city}>
                    <Link href={`/explore?city=${city}`} className="hover:text-white transition">
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm text-stone-500 font-light">
            <p>&copy; 2026 Nestiva. Powered by Satellite Intelligence & Blockchain Technology</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}