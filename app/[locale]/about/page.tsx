import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Mountain, Users, MapPin, Heart, Target, Compass } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Adventure Canada',
  description:
    'Learn about Adventure Canada - connecting adventure seekers with the best outdoor tour operators across Canada since 2024.',
}

const stats = [
  { label: 'Tour Operators', value: '500+', icon: Users },
  { label: 'Adventures Listed', value: '2,000+', icon: Mountain },
  { label: 'Regions Covered', value: '13', icon: MapPin },
  { label: 'Happy Adventurers', value: '50,000+', icon: Heart },
]

const values = [
  {
    icon: Compass,
    title: 'Adventure First',
    description:
      'We believe that outdoor adventures are transformative experiences that connect people with nature and create lasting memories.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'We support local tour operators and help them reach adventure seekers who are looking for authentic Canadian experiences.',
  },
  {
    icon: Target,
    title: 'Quality Focused',
    description:
      'Every listing is verified to ensure our users connect with reputable operators who prioritize safety and customer satisfaction.',
  },
  {
    icon: Heart,
    title: 'Passion for Canada',
    description:
      'From coast to coast to coast, we celebrate the incredible natural beauty and adventure opportunities that Canada offers.',
  },
]

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    bio: 'Former outdoor guide with 15 years of experience leading adventures across Canada.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  },
  {
    name: 'James Chen',
    role: 'Head of Operations',
    bio: 'Previously managed partnerships for a major outdoor retailer. Avid mountaineer.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    name: 'Marie Dubois',
    role: 'Marketing Director',
    bio: 'Tourism marketing expert passionate about sustainable adventure travel.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  },
  {
    name: 'David Thompson',
    role: 'Head of Partnerships',
    bio: 'Works directly with tour operators to help them grow their businesses.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Adventurers with Canada&apos;s Best Outdoor Experiences
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Adventure Canada is the premier directory for outdoor adventure tours across Canada.
              We help travelers discover incredible experiences and support local tour operators in
              growing their businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/adventures">
                <Button variant="secondary" size="lg">
                  Explore Adventures
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Adventure Canada was founded in 2024 with a simple mission: make it easier for
                  people to discover and book incredible outdoor adventures across Canada.
                </p>
                <p>
                  Our founders, experienced outdoor enthusiasts themselves, recognized that while
                  Canada offers some of the world&apos;s most spectacular adventure opportunities,
                  finding and connecting with quality tour operators was often difficult.
                </p>
                <p>
                  Today, we&apos;re proud to partner with hundreds of tour operators across all 13
                  provinces and territories, from whale watching in Newfoundland to heli-skiing in
                  British Columbia, and everything in between.
                </p>
                <p>
                  Whether you&apos;re seeking a peaceful kayaking trip, an adrenaline-pumping white
                  water rafting adventure, or a once-in-a-lifetime northern lights experience,
                  Adventure Canada helps you find the perfect operator for your next Canadian
                  adventure.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800"
                alt="Canadian mountain landscape"
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs">
                <p className="text-gray-600 italic">
                  &ldquo;We believe every Canadian adventure should be unforgettable.&rdquo;
                </p>
                <p className="mt-2 font-semibold text-gray-900">- The Adventure Canada Team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Adventure Canada.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re a passionate team of outdoor enthusiasts dedicated to helping you discover
              Canada&apos;s best adventures.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Join thousands of adventurers who have discovered their perfect Canadian outdoor
            experience through our platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/adventures">
              <Button variant="secondary" size="lg">
                Browse Adventures
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
