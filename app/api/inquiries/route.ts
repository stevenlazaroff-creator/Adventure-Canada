import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { listing_id, name, email, phone, message, preferred_date, group_size } = body

    // Validate required fields
    if (!listing_id || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the listing exists and has inquiry form enabled
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, operator_id, name')
      .eq('id', listing_id)
      .eq('status', 'active')
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if operator has inquiry form access (Pro or Premium)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('operator_id', listing.operator_id)
      .single()

    const tier = subscription?.tier || 'free'
    if (tier !== 'pro' && tier !== 'premium') {
      return NextResponse.json(
        { error: 'Inquiry form not available for this listing' },
        { status: 403 }
      )
    }

    // Create the inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        listing_id,
        name,
        email,
        phone: phone || null,
        message,
        preferred_date: preferred_date || null,
        group_size: group_size || null,
        status: 'new',
      })
      .select()
      .single()

    if (inquiryError) {
      console.error('Error creating inquiry:', inquiryError)
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }

    // Track the inquiry event for analytics
    try {
      await supabase.from('analytics_events').insert({
        listing_id,
        event_type: 'inquiry',
        metadata: { inquiry_id: inquiry.id },
      })
    } catch (e) {
      // Don't fail the request if analytics tracking fails
      console.error('Failed to track inquiry event:', e)
    }

    return NextResponse.json({ success: true, inquiry_id: inquiry.id })
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
