"use client";

import React, { useState, useEffect } from 'react';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Processing CSV file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          console.log('CSV Headers:', results.meta.fields);
          console.log('First row:', results.data[0]);
          
          const batch = writeBatch(db);
          const wineriesRef = collection(db, 'winery');

          results.data.forEach((row: any, index: number) => {
            console.log(`Processing row ${index + 1}:`, row);

            // Validate required fields with better error message
            const requiredFields = ['name', 'address', 'city', 'state'];
            const missingFields = requiredFields.filter(field => !row[field]);
            
            if (missingFields.length > 0) {
              throw new Error(
                `Row ${index + 1} is missing required fields: ${missingFields.join(', ')}\n` +
                `Row data: ${JSON.stringify(row, null, 2)}`
              );
            }

            const convertToBoolean = (value: any) => {
              if (typeof value === 'boolean') return value;
              if (typeof value === 'string') {
                return value.toLowerCase() === 'true';
              }
              return false;
            };

            const wineryData = {
              name: row.name?.trim() || '',
              siteUrl: row.siteUrl?.trim() || '',
              phone: row.phone?.trim() || '',
              address: row.address?.trim() || '',
              city: row.city?.trim() || '',
              state: row.state?.trim() || '',
              rating: parseFloat(row.rating) || 0,
              imageUrl: row.photoUrl?.trim() || '',
              goodForCouples: convertToBoolean(row.Couples),
              goodForGroups: convertToBoolean(row['Groups of Friends']),
              goodForFamilies: convertToBoolean(row.Families),
              petFriendly: convertToBoolean(row['Pet-Friendly']),
              outdoorSeating: convertToBoolean(row['Outdoor Seating']),
              liveMusic: convertToBoolean(row['Live Music on Weekends']),
              description: row.Description?.trim() || '',
              featured: false
            };

            const docRef = doc(wineriesRef);
            batch.set(docRef, wineryData);
          });

          await batch.commit();
          setMessage(`Successfully uploaded ${results.data.length} wineries!`);
        } catch (error: any) {
          console.error('Error uploading wineries:', error);
          setMessage(`Error: ${error.message}`);
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setMessage('Error parsing CSV file. Please check the format.');
        setUploading(false);
      }
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = `name,siteUrl,phone,address,city,state,rating,photoUrl,Couples,Groups of Friends,Families,Pet-Friendly,Outdoor Seating,Live Music on Weekends,Description
5 Soul Wine Co,http://www.5soulwine.com/,+1 512-809-1672,4514 Bob Wire Rd,Spicewood,Texas,4.6,https://example.com/photo.jpg,FALSE,TRUE,TRUE,TRUE,TRUE,TRUE,"5 Soul Wine Co in Spicewood offers a welcoming outdoor haven..."`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-wineries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {!isAuthenticated ? (
          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Wineries CSV</h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">CSV should include the following columns:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>name</li>
                <li>siteUrl</li>
                <li>phone</li>
                <li>address</li>
                <li>city</li>
                <li>state</li>
                <li>rating</li>
                <li>photoUrl</li>
                <li>Couples (TRUE/FALSE)</li>
                <li>Groups of Friends (TRUE/FALSE)</li>
                <li>Families (TRUE/FALSE)</li>
                <li>Pet-Friendly (TRUE/FALSE)</li>
                <li>Outdoor Seating (TRUE/FALSE)</li>
                <li>Live Music on Weekends (TRUE/FALSE)</li>
                <li>Description</li>
              </ul>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100
                disabled:opacity-50"
            />

            <button
              onClick={downloadSampleCSV}
              className="mb-4 text-purple-600 hover:text-purple-800 text-sm"
            >
              Download Sample CSV
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('Error') || message.includes('failed') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
} 