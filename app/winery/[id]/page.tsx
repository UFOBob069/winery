"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Winery {
  id: string;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
  siteUrl?: string;
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
            siteUrl: data.siteUrl
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
    <main className="min-h-screen bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-800"
          >
            ← Back
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={winery.imageUrl}
            alt={winery.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Winery Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{winery.name}</h1>
            <p className="text-gray-600 mb-6">{winery.description}</p>
            
            {winery.siteUrl && (
              <a
                href={winery.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800"
              >
                Visit Website →
              </a>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-600">{winery.location}</p>
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
                    `${winery.name} ${winery.location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </main>
  );
} 