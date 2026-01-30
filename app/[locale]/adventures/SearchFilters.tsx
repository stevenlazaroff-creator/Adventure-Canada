'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Activity, Region } from '@/types'

interface SearchFiltersProps {
  activities: Activity[]
  regions: Region[]
  currentFilters: {
    q?: string
    activity?: string
    region?: string
    price?: string
    season?: string
  }
}

const priceRanges = [
  { value: '$', label: 'Budget ($)' },
  { value: '$$', label: 'Moderate ($$)' },
  { value: '$$$', label: 'Premium ($$$)' },
  { value: '$$$$', label: 'Luxury ($$$$)' },
]

const seasons = ['Spring', 'Summer', 'Fall', 'Winter']

export function SearchFilters({ activities, regions, currentFilters }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const [searchQuery, setSearchQuery] = useState(currentFilters.q || '')
  const [showAllActivities, setShowAllActivities] = useState(false)

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/${locale}/adventures?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters('q', searchQuery || null)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    router.push(`/${locale}/adventures`)
  }

  const hasActiveFilters = currentFilters.q || currentFilters.activity ||
    currentFilters.region || currentFilters.price || currentFilters.season

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                placeholder="Search adventures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear all filters
        </button>
      )}

      {/* Activities */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-gray-900">Activities</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {displayedActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() =>
                  updateFilters(
                    'activity',
                    currentFilters.activity === activity.slug ? null : activity.slug
                  )
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentFilters.activity === activity.slug
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {activity.name}
              </button>
            ))}
            {activities.length > 8 && (
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {showAllActivities ? 'Show less' : `Show ${activities.length - 8} more`}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regions */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-gray-900">Region</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() =>
                  updateFilters(
                    'region',
                    currentFilters.region === region.slug ? null : region.slug
                  )
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentFilters.region === region.slug
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-gray-900">Price Range</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() =>
                  updateFilters(
                    'price',
                    currentFilters.price === range.value ? null : range.value
                  )
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentFilters.price === range.value
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasons */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-gray-900">Season</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() =>
                  updateFilters(
                    'season',
                    currentFilters.season === season ? null : season
                  )
                }
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  currentFilters.season === season
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
