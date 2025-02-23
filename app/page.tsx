"use client";  // Add this to enable client-side functionality

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from './lib/firebase';

interface Winery {
  id: string;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
  siteUrl?: string;
  featured?: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredWineries, setFeaturedWineries] = useState<Winery[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedWineries = async () => {
      setLoading(true);
      try {
        const wineriesRef = collection(db, 'winery');
        const featuredQuery = query(
          wineriesRef,
          where('featured', '==', true),
          limit(6)
        );
        
        const querySnapshot = await getDocs(featuredQuery);
        const wineries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Winery));

        setFeaturedWineries(wineries);
      } catch (error) {
        console.error("Error fetching wineries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWineries();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[600px] w-full">
        <Image
          src="/hero-winery.jpg"
          alt="Beautiful vineyard landscape"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl font-bold text-center">GoVisitWinery.com</h1>
          <p className="mb-6 md:mb-8 text-lg md:text-xl text-center">Discover and explore the finest wineries near you</p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="relative flex w-full rounded-lg bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search wineries..."
                className="w-full rounded-lg px-4 md:px-6 py-3 md:py-4 text-gray-900 focus:outline-none text-sm md:text-base"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 rounded-lg bg-purple-600 px-4 md:px-6 py-1.5 md:py-2 text-white hover:bg-purple-700 text-sm md:text-base"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Wineries Section */}
      <section className="py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Featured Wineries
          </h2>
          {loading ? (
            <div className="text-center">Loading featured wineries...</div>
          ) : (
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Discover the Perfect Winery Experience
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 md:mb-4 text-3xl md:text-4xl">🍷</div>
              <h3 className="mb-2 text-lg md:text-xl font-semibold">Extensive Directory</h3>
              <p className="text-sm md:text-base text-gray-600">Browse through thousands of wineries</p>
            </div>
            <div className="text-center">
              <div className="mb-3 md:mb-4 text-3xl md:text-4xl">⭐</div>
              <h3 className="mb-2 text-lg md:text-xl font-semibold">Verified Reviews</h3>
              <p className="text-sm md:text-base text-gray-600">Read authentic reviews</p>
            </div>
            <div className="text-center">
              <div className="mb-3 md:mb-4 text-3xl md:text-4xl">📍</div>
              <h3 className="mb-2 text-lg md:text-xl font-semibold">Easy Navigation</h3>
              <p className="text-sm md:text-base text-gray-600">Get directions easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* VineyardSun Promo Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src="/vineyard-sun-glasses.jpg"
                  alt="VineyardSun Cork Sunglasses"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">Complete Your Wine Experience</h2>
                <p className="text-gray-600 mb-6">
                  Discover our unique cork sunglasses at VineyardSun.com. Perfect for wine enthusiasts 
                  who appreciate sustainable style and fashion-forward designs.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    Sustainable cork material
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    Fashionable designs
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    Perfect for wine country visits
                  </div>
                </div>
                <a
                  href="https://vineyardsun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Shop VineyardSun →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
