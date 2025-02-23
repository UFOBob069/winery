"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Head from 'next/head';

interface Winery {
  id: string;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
  siteUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  goodForCouples?: boolean;
  goodForGroups?: boolean;
  goodForFamilies?: boolean;
  petFriendly?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
}

export default function WineryDetail() {
  const params = useParams();
  const router = useRouter();
  const [winery, setWinery] = useState<Winery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinery = async () => {
      try {
        const docRef = doc(db, 'winery', params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setWinery({
            id: docSnap.id,
            name: data.name,
            location: data.location,
            rating: data.rating,
            imageUrl: data.imageUrl,
            description: data.description,
            siteUrl: data.siteUrl,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            goodForCouples: data.goodForCouples,
            goodForGroups: data.goodForGroups,
            goodForFamilies: data.goodForFamilies,
            petFriendly: data.petFriendly,
            outdoorSeating: data.outdoorSeating,
            liveMusic: data.liveMusic
          });
        } else {
          console.log("No such winery!");
        }
      } catch (error) {
        console.error("Error fetching winery:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchWinery();
    }
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-8">Loading winery details...</div>;
  }

  if (!winery) {
    return <div className="text-center py-8">Winery not found</div>;
  }

  return (
    <>
      <Head>
        <title>{winery?.name ? `${winery.name} | GoVisitWinery.com` : 'Winery | GoVisitWinery.com'}</title>
        <meta 
          name="description" 
          content={winery?.description?.slice(0, 160) || 'Discover this amazing winery'} 
        />
        {/* OpenGraph tags */}
        <meta property="og:title" content={`${winery?.name || 'Winery'} | GoVisitWinery.com`} />
        <meta property="og:description" content={winery?.description?.slice(0, 160) || 'Discover this amazing winery'} />
        <meta property="og:image" content={winery?.imageUrl || ''} />
        <meta property="og:type" content="website" />
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={winery?.name || 'Winery'} />
        <meta name="twitter:description" content={winery?.description?.slice(0, 160) || 'Discover this amazing winery'} />
        <meta name="twitter:image" content={winery?.imageUrl || ''} />
      </Head>

      <main className="min-h-screen bg-white py-8" itemScope itemType="https://schema.org/Winery">
        <div className="mx-auto max-w-7xl px-4">
          {/* Navigation */}
          <nav aria-label="Back to search results" className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-purple-600 hover:text-purple-800"
            >
              ← Back
            </button>
          </nav>

          {/* Hero Image */}
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={winery.imageUrl}
              alt={`${winery.name} vineyard`}
              fill
              className="object-cover"
              priority
              itemProp="image"
            />
          </div>

          {/* Winery Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-6" itemProp="name">{winery.name}</h1>
              
              {/* Structured Description */}
              <div className="prose prose-lg max-w-none mb-8" itemProp="description">
                {winery.description.split('. ').map((sentence, index) => {
                  // Skip empty sentences
                  if (!sentence.trim()) return null;
                  
                  // Add period back if it's not the last sentence
                  const formattedSentence = index < winery.description.split('. ').length - 1 
                    ? sentence + '.' 
                    : sentence;

                  return (
                    <p 
                      key={index} 
                      className="mb-4 text-gray-600 leading-relaxed"
                    >
                      {formattedSentence}
                    </p>
                  );
                })}
              </div>
              
              {/* Quick Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {winery.goodForCouples && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">👫</span>
                    Perfect for Date Night
                  </div>
                )}
                {winery.goodForGroups && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">👥</span>
                    Great for Groups
                  </div>
                )}
                {winery.goodForFamilies && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">👨‍👩‍👧‍👦</span>
                    Family-Friendly
                  </div>
                )}
                {winery.petFriendly && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">🐕</span>
                    Pet-Friendly
                  </div>
                )}
                {winery.outdoorSeating && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">🌳</span>
                    Outdoor Seating
                  </div>
                )}
                {winery.liveMusic && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-purple-600 mr-2">🎵</span>
                    Live Music on Weekends
                  </div>
                )}
              </div>

              {/* Website Link */}
              {winery.siteUrl && (
                <a
                  href={winery.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                >
                  <span>Visit Website</span>
                  <span className="ml-2">→</span>
                </a>
              )}
            </div>

            <aside className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Contact</h3>
                  {winery.phone && (
                    <p className="text-gray-600">
                      <a href={`tel:${winery.phone}`} className="hover:text-purple-600">
                        {winery.phone}
                      </a>
                    </p>
                  )}
                </div>

                <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    <span itemProp="streetAddress">{winery.address}</span><br />
                    <span itemProp="addressLocality">{winery.city}</span>,{' '}
                    <span itemProp="addressRegion">{winery.state}</span>
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Rating</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{winery.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Get Directions</h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${winery.name} ${winery.address} ${winery.city}, ${winery.state}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
} 