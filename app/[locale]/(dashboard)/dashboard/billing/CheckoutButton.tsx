'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { SubscriptionTier } from '@/types'

interface CheckoutButtonProps {
  tier: SubscriptionTier
  currentTier: SubscriptionTier
}

export function CheckoutButton({ tier, currentTier }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const t = useTranslations('dashboard')
  const tPricing = useTranslations('pricing.tiers')

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to start checkout')
        setIsLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('No checkout URL returned')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro']
  const isUpgrade = tierOrder.indexOf(tier) > tierOrder.indexOf(currentTier)

  const getTierLabel = (tierKey: SubscriptionTier) => {
    if (tierKey === 'free') return tPricing('free.name')
    if (tierKey === 'basic') return tPricing('basic.name')
    return tPricing('pro.name')
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setBillingPeriod('monthly')}
          className={`flex-1 py-1.5 px-3 text-sm rounded-lg border transition-colors ${
            billingPeriod === 'monthly'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          {t('monthly')}
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod('annual')}
          className={`flex-1 py-1.5 px-3 text-sm rounded-lg border transition-colors ${
            billingPeriod === 'annual'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          {t('annual')}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <Button
        variant="primary"
        className="w-full"
        onClick={handleCheckout}
        isLoading={isLoading}
      >
        {isUpgrade ? t('upgradeTo', { tier: getTierLabel(tier) }) : t('switchTo', { tier: getTierLabel(tier) })}
      </Button>
    </div>
  )
}
