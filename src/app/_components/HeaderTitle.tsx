"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SignedIn, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

export function HeaderTitle() {
  const [clicks, setClicks] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    if (clicks === 1) {
      const timer = setTimeout(() => {
        setClicks(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (clicks >= 5) {
      setIsDisabled(true);
      router.push('/sign-in');
      setClicks(0);
      
      setTimeout(() => {
        setIsDisabled(false);
      }, 2000);
    }
  }, [clicks, router]);

  return (
    <div className="container mx-auto py-4 flex items-center justify-between z-50">
      <div className="flex-1 flex justify-start gap-4">
        <SignedIn>
          <button
            onClick={() => router.push('/config-editor')}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Config Editor
          </button>
          
          <div className="relative group z-50">
            <button className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              Navigation
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
                <Link href="/Paragon" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paragon</Link>
                <Link href="/AstridAndOrion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">AstridAndOrion</Link>
                <Link href="/MerryChristmas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">MerryChristmas</Link>
                <Link href="/Hapland" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hapland</Link>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
      
      <div className="flex items-center justify-center">
        <Image src="/favicon.ico" alt="Icon" width={24} height={24} className="w-6 h-6 mr-2" />
        <h1 
          className={`text-center text-2xl font-bold ${isDisabled ? 'opacity-50' : ''}`}
          onClick={() => {
            if (!isDisabled) {
              setClicks(prev => prev + 1);
            }
          }}
        >
          Prucka Treasure Hunt
        </h1>
        <Image src="/favicon.ico" alt="Icon" width={24} height={24} className="w-6 h-6 ml-2" />
      </div>

      <div className="flex-1 flex justify-end">
        <SignedIn>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </SignedIn>
      </div>
    </div>
  );
}