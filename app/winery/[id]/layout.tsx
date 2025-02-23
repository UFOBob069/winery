import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const docRef = doc(db, 'winery', params.id);
  const docSnap = await getDoc(docRef);
  const winery = docSnap.data();

  return {
    title: `${winery?.name || 'Winery'} | GoVisitWinery.com`,
    description: winery?.description?.slice(0, 160) || 'Discover this amazing winery',
    openGraph: {
      title: `${winery?.name} | GoVisitWinery.com`,
      description: winery?.description?.slice(0, 160),
      images: [winery?.imageUrl || ''],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: winery?.name,
      description: winery?.description?.slice(0, 160),
      images: [winery?.imageUrl || ''],
    }
  };
}

export default function WineryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 