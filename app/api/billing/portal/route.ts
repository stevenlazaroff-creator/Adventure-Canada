import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
    }

    // Get Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('operator_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.redirect(
        new URL('/dashboard/billing?error=no_subscription', process.env.NEXT_PUBLIC_APP_URL)
      )
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.redirect(
      new URL('/dashboard/billing?error=portal_error', process.env.NEXT_PUBLIC_APP_URL)
    )
  }
}
