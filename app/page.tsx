"use client";  // Add this to enable client-side functionality

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Winery {
  id: string;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
}

// This will be replaced with actual API data later
const featuredWineries: Winery[] = [
  {
    id: "1",
    name: "Napa Valley Vineyards",
    location: "Napa, California",
    rating: 4.8,
    imageUrl: "/images/placeholder-winery.jpg",
    description: "Experience the finest wines in the heart of Napa Valley."
  },
  {
    id: "2",
    name: "Sonoma Wine Estate",
    location: "Sonoma, California",
    rating: 4.6,
    imageUrl: "/images/placeholder-winery.jpg",
    description: "Beautiful estate featuring premium wine tastings."
  },
  // More wineries will be added here
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect to search page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="/hero-winery.jpg"
          alt="Beautiful vineyard landscape"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="mb-6 text-5xl font-bold">GoVisitWinery.com</h1>
          <p className="mb-8 text-xl">Discover and explore the finest wineries near you</p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl px-4">
            <div className="relative flex w-full rounded-lg bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for wineries by name or location..."
                className="w-full rounded-lg px-6 py-4 text-gray-900 focus:outline-none"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Wineries Section - Show only when not searching */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Featured Wineries</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWineries.map((winery) => (
            <Link 
              href={`/winery/${winery.id}`} 
              key={winery.id}
              className="group overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={winery.imageUrl}
                  alt={winery.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{winery.name}</h3>
                <p className="text-sm text-gray-600">{winery.location}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">{winery.rating}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{winery.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Discover the Perfect Winery Experience
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">🍷</div>
              <h3 className="mb-2 text-xl font-semibold">Extensive Directory</h3>
              <p className="text-gray-600">Browse through thousands of wineries across the country</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">⭐</div>
              <h3 className="mb-2 text-xl font-semibold">Verified Reviews</h3>
              <p className="text-gray-600">Read authentic reviews from wine enthusiasts</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">📍</div>
              <h3 className="mb-2 text-xl font-semibold">Easy Navigation</h3>
              <p className="text-gray-600">Get directions and plan your wine tasting journey</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
