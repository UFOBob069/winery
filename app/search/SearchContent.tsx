"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Winery {
  id: string;
  name: string;
  siteUrl?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  imageUrl: string;
  goodForCouples: boolean;
  goodForGroups: boolean;
  goodForFamilies: boolean;
  petFriendly: boolean;
  outdoorSeating: boolean;
  liveMusic: boolean;
  description: string;
  featured?: boolean;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Winery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);

    const searchWineries = async () => {
      if (!searchQuery) return;
      
      setIsLoading(true);
      try {
        const wineriesRef = collection(db, 'winery');
        const querySnapshot = await getDocs(wineriesRef);
        
        const wineries = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || '',
              siteUrl: data.siteUrl || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              rating: data.rating || 0,
              imageUrl: data.imageUrl || '',
              goodForCouples: data.goodForCouples || false,
              goodForGroups: data.goodForGroups || false,
              goodForFamilies: data.goodForFamilies || false,
              petFriendly: data.petFriendly || false,
              outdoorSeating: data.outdoorSeating || false,
              liveMusic: data.liveMusic || false,
              description: data.description || ''
            } as Winery;
          })
          .filter(winery => {
            const searchLower = searchQuery.toLowerCase();
            return (
              (winery.name?.toLowerCase() || '').includes(searchLower) ||
              (winery.city?.toLowerCase() || '').includes(searchLower) ||
              (winery.state?.toLowerCase() || '').includes(searchLower) ||
              (winery.description?.toLowerCase() || '').includes(searchLower)
            );
          });

        setSearchResults(wineries);
      } catch (error) {
        console.error("Error searching wineries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchWineries();
  }, [searchParams]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Search Results Header */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for &ldquo;{query}&rdquo;
          </h1>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Search Results */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((winery) => (
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
                  <p className="text-sm text-gray-600">{winery.city}, {winery.state}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">{winery.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No wineries found matching &ldquo;{query}&rdquo;</p>
            <Link href="/" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
              Return to home page
            </Link>
          </div>
        )}
      </section>
    </main>
  );
} 