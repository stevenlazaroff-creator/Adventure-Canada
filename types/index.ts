// Database types

export type SubscriptionTier = 'free' | 'basic' | 'pro';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'suspended';
export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived';
export type EventType = 'view' | 'website_click' | 'phone_click' | 'inquiry';

export interface Operator {
  id: string;
  email: string;
  business_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  operator_id: string;
  tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
}

export interface Region {
  id: number;
  name: string;
  slug: string;
  province_code: string | null;
  description: string | null;
  display_order: number;
}

export interface Listing {
  id: string;
  operator_id: string;
  name: string;
  slug: string;
  status: ListingStatus;
  contact_email: string;
  address: string | null;
  city: string | null;
  province: string | null;
  region_id: number | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website_url: string | null;
  description_short: string | null;
  description_long: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  is_featured: boolean;
  is_verified: boolean;
  price_range: string | null;
  seasons: string[] | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ListingWithRelations extends Listing {
  region: Region | null;
  activities: Activity[];
  images: ListingImage[];
  primary_image: string | null;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  listing_id: string;
  event_type: EventType;
  visitor_id: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_country: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface AnalyticsData {
  total_views: number;
  website_clicks: number;
  phone_clicks: number;
  inquiries: number;
  views_by_day: { date: string; views: number }[];
}

// Tier feature limits
export const TIER_LIMITS: Record<SubscriptionTier, {
  images: number;
  descriptionLength: number;
  hasPhone: boolean;
  hasWebsite: boolean;
  hasLogo: boolean;
  hasSocialLinks: boolean;
  hasAnalytics: boolean;
  hasInquiryForm: boolean;
  isFeatured: boolean;
  isVerified: boolean;
}> = {
  free: {
    images: 0,
    descriptionLength: 0,
    hasPhone: false,
    hasWebsite: false,
    hasLogo: false,
    hasSocialLinks: false,
    hasAnalytics: false,
    hasInquiryForm: false,
    isFeatured: false,
    isVerified: false,
  },
  basic: {
    images: 1,
    descriptionLength: 500,
    hasPhone: true,
    hasWebsite: true,
    hasLogo: false,
    hasSocialLinks: false,
    hasAnalytics: false,
    hasInquiryForm: false,
    isFeatured: false,
    isVerified: false,
  },
  pro: {
    images: 15,
    descriptionLength: 2000,
    hasPhone: true,
    hasWebsite: true,
    hasLogo: true,
    hasSocialLinks: true,
    hasAnalytics: true,
    hasInquiryForm: true,
    isFeatured: true,
    isVerified: true,
  },
};

// Pricing
export const PRICING: Record<SubscriptionTier, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  basic: { monthly: 29, annual: 290 },
  pro: { monthly: 79, annual: 790 },
};
