'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, MapPin, Phone, Clock, MessageSquare, HelpCircle, Building } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@adventurecanada.com',
    href: 'mailto:hello@adventurecanada.com',
    description: 'We typically respond within 24 hours',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (800) 555-ADVENTURE',
    href: 'tel:+18005553838',
    description: 'Mon-Fri 9am-5pm PST',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Vancouver, BC, Canada',
    href: null,
    description: 'Remote-first company',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Monday - Friday',
    href: null,
    description: '9:00 AM - 5:00 PM PST',
  },
]

const topics = [
  {
    icon: MessageSquare,
    title: 'General Inquiries',
    description: 'Questions about Adventure Canada or our platform',
    email: 'hello@adventurecanada.com',
  },
  {
    icon: Building,
    title: 'Operator Support',
    description: 'Help with your listing, billing, or account',
    email: 'operators@adventurecanada.com',
  },
  {
    icon: HelpCircle,
    title: 'Partnership Opportunities',
    description: 'Business development and partnerships',
    email: 'partnerships@adventurecanada.com',
  },
]

export default function ContactPage() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Adventure Canada</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Questions about listing your tour company or finding an adventure outfitter? Our team
            is here to help travelers and operators connect.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.label}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.label}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-900">{info.value}</p>
                        )}
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Topic-specific Contacts */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Contact by Topic</h3>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {topics.map((topic) => (
                  <div key={topic.title} className="flex items-start gap-3">
                    <topic.icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">{topic.title}</h4>
                      <p className="text-sm text-gray-500">{topic.description}</p>
                      <a
                        href={`mailto:${topic.email}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {topic.email}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="py-6">
                <h3 className="font-semibold text-gray-900 mb-2">Looking for quick answers?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check out our pricing page FAQ section for answers to common questions.
                </p>
                <Link href={`/${locale}/pricing#faq`}>
                  <Button variant="outline" size="sm">
                    View FAQs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a topic...</option>
                        <option value="general">General Inquiry</option>
                        <option value="operator">Operator Support</option>
                        <option value="listing">Listing Question</option>
                        <option value="billing">Billing Issue</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="px-8"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                      <p className="text-sm text-gray-500">* Required fields</p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gray-100 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Are you a tour operator?</h3>
              <p className="text-gray-600 mb-4">
                If you&apos;re interested in listing your adventure tours on our platform, check out
                our pricing page to learn more about our plans and get started.
              </p>
              <Link href={`/${locale}/pricing`}>
                <Button variant="outline">View Pricing Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
