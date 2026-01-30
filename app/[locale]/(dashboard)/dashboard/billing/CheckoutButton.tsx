'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { SubscriptionTier } from '@/types'

interface CheckoutButtonProps {
  tier: SubscriptionTier
  currentTier: SubscriptionTier
}

export function CheckoutButton({ tier, currentTier }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const handleCheckout = async () => {
    setIsLoading(true)

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

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsLoading(false)
    }
  }

  const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro', 'premium']
  const isUpgrade = tierOrder.indexOf(tier) > tierOrder.indexOf(currentTier)

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
          Monthly
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
          Annual
        </button>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={handleCheckout}
        isLoading={isLoading}
      >
        {isUpgrade ? 'Upgrade' : 'Switch'} to {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Button>
    </div>
  )
}
