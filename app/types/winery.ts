export interface Winery {
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