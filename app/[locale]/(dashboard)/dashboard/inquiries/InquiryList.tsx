'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Inquiry, InquiryStatus } from '@/types'

interface InquiryWithListing extends Inquiry {
  listings: { name: string } | null
}

interface InquiryListProps {
  inquiries: InquiryWithListing[]
}

const statusColors: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
}

const statusLabels: Record<InquiryStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
}

export function InquiryList({ inquiries }: InquiryListProps) {
  const router = useRouter()
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithListing | null>(null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')

  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries.filter((i) => i.status === filter)

  const updateStatus = async (id: string, status: InquiryStatus) => {
    const supabase = createClient()

    await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)

    router.refresh()

    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status })
    }
  }

  const handleSelect = async (inquiry: InquiryWithListing) => {
    setSelectedInquiry(inquiry)

    // Mark as read if new
    if (inquiry.status === 'new') {
      await updateStatus(inquiry.id, 'read')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return 'Today'
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* List */}
      <div className="md:col-span-1 space-y-4">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
              {status === 'new' && inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="ml-1.5 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Inquiry list */}
        <div className="space-y-2">
          {filteredInquiries.map((inquiry) => (
            <button
              key={inquiry.id}
              onClick={() => handleSelect(inquiry)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedInquiry?.id === inquiry.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`font-medium truncate ${inquiry.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>
                    {inquiry.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{inquiry.listings?.name}</p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${statusColors[inquiry.status]}`}>
                  {statusLabels[inquiry.status]}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">{inquiry.message}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(inquiry.created_at)}</p>
            </button>
          ))}

          {filteredInquiries.length === 0 && (
            <p className="text-center text-gray-500 py-8">No inquiries found</p>
          )}
        </div>
      </div>

      {/* Detail view */}
      <div className="md:col-span-2">
        {selectedInquiry ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedInquiry.name}</h2>
                  <p className="text-sm text-gray-500">
                    Inquiry for {selectedInquiry.listings?.name}
                  </p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${statusColors[selectedInquiry.status]}`}>
                  {statusLabels[selectedInquiry.status]}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Received {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 border-t pt-4">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry about ${selectedInquiry.listings?.name}`}
                  onClick={() => updateStatus(selectedInquiry.id, 'replied')}
                >
                  <Button variant="primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reply via Email
                  </Button>
                </a>
                {selectedInquiry.phone && (
                  <a href={`tel:${selectedInquiry.phone}`}>
                    <Button variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </Button>
                  </a>
                )}
                {selectedInquiry.status !== 'archived' && (
                  <Button
                    variant="ghost"
                    onClick={() => updateStatus(selectedInquiry.id, 'archived')}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Select an inquiry to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
