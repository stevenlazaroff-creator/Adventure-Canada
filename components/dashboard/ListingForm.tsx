'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase/client'
import { TIER_LIMITS, type SubscriptionTier, type Listing, type Activity, type Region } from '@/types'
import { slugify } from '@/lib/utils'

interface ListingFormProps {
  listing?: Listing & { listing_activities?: { activity_id: string }[] }
  tier: SubscriptionTier
  activities: Activity[]
  regions: Region[]
}

export function ListingForm({ listing, tier, activities, regions }: ListingFormProps) {
  const router = useRouter()
  const limits = TIER_LIMITS[tier]
  const isEditing = !!listing

  const [formData, setFormData] = useState({
    name: listing?.name || '',
    contact_email: listing?.contact_email || '',
    phone: listing?.phone || '',
    website_url: listing?.website_url || '',
    address: listing?.address || '',
    city: listing?.city || '',
    region_id: listing?.region_id?.toString() || '',
    postal_code: listing?.postal_code || '',
    description_short: listing?.description_short || '',
    description_long: listing?.description_long || '',
    price_range: listing?.price_range || '',
    seasons: listing?.seasons || [],
    instagram_url: listing?.instagram_url || '',
    facebook_url: listing?.facebook_url || '',
    youtube_url: listing?.youtube_url || '',
  })

  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    listing?.listing_activities?.map((la) => la.activity_id) || []
  )

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSeasonToggle = (season: string) => {
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }))
  }

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    )
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!formData.name || !formData.contact_email) {
      setError('Name and contact email are required')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setIsLoading(false)
      return
    }

    const slug = slugify(formData.name)

    const listingData = {
      operator_id: user.id,
      name: formData.name,
      slug: isEditing ? listing.slug : slug,
      status,
      contact_email: formData.contact_email,
      phone: limits.hasPhone ? formData.phone || null : null,
      website_url: limits.hasWebsite ? formData.website_url || null : null,
      address: formData.address || null,
      city: formData.city || null,
      region_id: formData.region_id ? parseInt(formData.region_id) : null,
      postal_code: formData.postal_code || null,
      description_short: limits.descriptionLength > 0
        ? formData.description_short?.slice(0, limits.descriptionLength) || null
        : null,
      description_long: limits.descriptionLength >= 2000
        ? formData.description_long || null
        : null,
      price_range: formData.price_range || null,
      seasons: formData.seasons,
      instagram_url: limits.hasSocialLinks ? formData.instagram_url || null : null,
      facebook_url: limits.hasSocialLinks ? formData.facebook_url || null : null,
      youtube_url: limits.hasSocialLinks ? formData.youtube_url || null : null,
    }

    try {
      if (isEditing) {
        // Update existing listing
        const { error: updateError } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)

        if (updateError) throw updateError

        // Update activities
        await supabase
          .from('listing_activities')
          .delete()
          .eq('listing_id', listing.id)

        if (selectedActivities.length > 0) {
          await supabase.from('listing_activities').insert(
            selectedActivities.map((activityId) => ({
              listing_id: listing.id,
              activity_id: activityId,
            }))
          )
        }
      } else {
        // Create new listing
        const { data: newListing, error: insertError } = await supabase
          .from('listings')
          .insert(listingData)
          .select()
          .single()

        if (insertError) throw insertError

        // Add activities
        if (selectedActivities.length > 0 && newListing) {
          await supabase.from('listing_activities').insert(
            selectedActivities.map((activityId) => ({
              listing_id: newListing.id,
              activity_id: activityId,
            }))
          )
        }
      }

      router.push('/dashboard/listings')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving listing:', err)
      setError(err.message || 'Failed to save listing')
      setIsLoading(false)
    }
  }

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter']
  const priceRanges = [
    { value: '$', label: '$ - Budget Friendly' },
    { value: '$$', label: '$$ - Moderate' },
    { value: '$$$', label: '$$$ - Premium' },
    { value: '$$$$', label: '$$$$ - Luxury' },
  ]

  return (
    <form onSubmit={(e) => handleSubmit(e, 'pending')}>
      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Business Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your adventure business name"
              required
            />

            <Input
              label="Contact Email *"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="contact@yourbusiness.com"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`Phone ${!limits.hasPhone ? '(Upgrade to Basic+)' : ''}`}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                disabled={!limits.hasPhone}
              />

              <Input
                label={`Website ${!limits.hasWebsite ? '(Upgrade to Basic+)' : ''}`}
                name="website_url"
                type="url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://yourbusiness.com"
                disabled={!limits.hasWebsite}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Location</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Adventure Street"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Banff"
              />

              <Select
                label="Region"
                name="region_id"
                value={formData.region_id}
                onChange={handleChange}
                placeholder="Select a region"
                options={regions.map((region) => ({
                  value: region.id.toString(),
                  label: region.name,
                }))}
              />

              <Input
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="T1L 1A1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Description</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description {limits.descriptionLength === 0 ? '(Upgrade to Basic+)' : `(${formData.description_short.length}/${limits.descriptionLength} chars)`}
              </label>
              <textarea
                name="description_short"
                value={formData.description_short}
                onChange={handleChange}
                placeholder="A brief description of your adventure business..."
                rows={3}
                maxLength={limits.descriptionLength || undefined}
                disabled={limits.descriptionLength === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {limits.descriptionLength >= 2000 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description (Pro+)
                </label>
                <textarea
                  name="description_long"
                  value={formData.description_long}
                  onChange={handleChange}
                  placeholder="A detailed description of your adventures, what makes you unique..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Activities Offered</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {activities.map((activity) => (
                <label
                  key={activity.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedActivities.includes(activity.id.toString())
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity.id.toString())}
                    onChange={() => handleActivityToggle(activity.id.toString())}
                    className="sr-only"
                  />
                  <span className="text-sm">{activity.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Additional Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Price Range"
              name="price_range"
              value={formData.price_range}
              onChange={handleChange}
              placeholder="Select price range"
              options={priceRanges.map((range) => ({
                value: range.value,
                label: range.label,
              }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating Seasons
              </label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => handleSeasonToggle(season)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.seasons.includes(season)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        {limits.hasSocialLinks && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Social Media (Pro+)</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Instagram URL"
                name="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/yourbusiness"
              />
              <Input
                label="Facebook URL"
                name="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/yourbusiness"
              />
              <Input
                label="YouTube URL"
                name="youtube_url"
                type="url"
                value={formData.youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/@yourbusiness"
              />
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleSubmit(e as any, 'draft')}
              disabled={isLoading}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {isEditing ? 'Update Listing' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
