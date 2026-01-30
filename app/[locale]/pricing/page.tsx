import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Check, X, Star, TrendingUp, Users, Globe, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing for Tour Operators | Adventure Canada',
  description:
    'List your adventure tours on Canada\'s premier outdoor adventure directory. Flexible pricing plans for tour operators of all sizes.',
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      { name: '1 listing', included: true },
      { name: 'Basic listing details', included: true },
      { name: 'Email contact display', included: true },
      { name: 'Activity & region tags', included: true },
      { name: 'Phone number display', included: false },
      { name: 'Website link', included: false },
      { name: 'Social media links', included: false },
      { name: 'Multiple images', included: false },
      { name: 'Analytics dashboard', included: false },
      { name: 'Inquiry form', included: false },
      { name: 'Featured placement', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    ctaLink: '/register',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    yearlyPrice: '$190',
    description: 'For operators ready to grow',
    features: [
      { name: '3 listings', included: true },
      { name: 'Enhanced listing details', included: true },
      { name: 'Email contact display', included: true },
      { name: 'Activity & region tags', included: true },
      { name: 'Phone number display', included: true },
      { name: 'Website link', included: true },
      { name: 'Social media links', included: false },
      { name: 'Up to 5 images per listing', included: true },
      { name: 'Analytics dashboard', included: false },
      { name: 'Inquiry form', included: false },
      { name: 'Featured placement', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Start Basic',
    ctaLink: '/register?plan=basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    yearlyPrice: '$490',
    description: 'Most popular for growing businesses',
    features: [
      { name: '10 listings', included: true },
      { name: 'Full listing details', included: true },
      { name: 'Email contact display', included: true },
      { name: 'Activity & region tags', included: true },
      { name: 'Phone number display', included: true },
      { name: 'Website link', included: true },
      { name: 'Social media links', included: true },
      { name: 'Up to 15 images per listing', included: true },
      { name: 'Analytics dashboard', included: true },
      { name: 'Inquiry form', included: true },
      { name: 'Featured placement', included: false },
      { name: 'Priority support', included: true },
    ],
    cta: 'Go Pro',
    ctaLink: '/register?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: '$99',
    period: '/month',
    yearlyPrice: '$990',
    description: 'For established operators',
    features: [
      { name: 'Unlimited listings', included: true },
      { name: 'Full listing details', included: true },
      { name: 'Email contact display', included: true },
      { name: 'Activity & region tags', included: true },
      { name: 'Phone number display', included: true },
      { name: 'Website link', included: true },
      { name: 'Social media links', included: true },
      { name: 'Unlimited images', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Inquiry form', included: true },
      { name: 'Featured placement', included: true },
      { name: 'Dedicated support', included: true },
    ],
    cta: 'Go Premium',
    ctaLink: '/register?plan=premium',
    highlighted: false,
  },
]

const benefits = [
  {
    icon: Globe,
    title: 'Reach More Customers',
    description:
      'Get discovered by thousands of adventure seekers looking for Canadian outdoor experiences.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description:
      'Track your performance with detailed analytics and optimize your listings for better results.',
  },
  {
    icon: Users,
    title: 'Direct Inquiries',
    description:
      'Receive inquiries directly from interested customers ready to book their next adventure.',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    description:
      'Build trust with customers through our verification badge for legitimate tour operators.',
  },
]

const testimonials = [
  {
    quote:
      "Adventure Canada has transformed how we reach new customers. Our bookings have increased by 40% since joining.",
    author: 'Sarah Mitchell',
    company: 'Rocky Mountain Adventures',
    location: 'Banff, Alberta',
  },
  {
    quote:
      "The analytics dashboard helps us understand what customers are looking for. It's been invaluable for our marketing.",
    author: 'Jean-Pierre Lavoie',
    company: 'Quebec Wilderness Tours',
    location: 'Quebec City, Quebec',
  },
  {
    quote:
      "We started with the free plan and upgraded to Pro within a month. The inquiry form alone paid for the subscription.",
    author: 'Mike Thompson',
    company: 'Pacific Coast Kayaking',
    location: 'Tofino, British Columbia',
  },
]

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.',
  },
  {
    question: 'Is there a contract or commitment?',
    answer:
      'No long-term contracts. All plans are billed monthly or annually. You can cancel anytime, and your listings will remain active until the end of your billing period.',
  },
  {
    question: 'What counts as a listing?',
    answer:
      'A listing is a single adventure, tour, or experience you offer. For example, if you offer both kayaking tours and hiking expeditions, those would be two separate listings.',
  },
  {
    question: 'How does the inquiry form work?',
    answer:
      'When enabled, an inquiry form appears on your listing pages. Customers can submit their contact information and questions, which are sent directly to your dashboard and email.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 14 days of your purchase for a full refund.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes! Annual plans include 2 months free compared to monthly billing. That\'s about 17% savings on any paid plan.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-6">
            For Tour Operators
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            List Your Adventures on Canada&apos;s Premier Directory
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Join hundreds of tour operators reaching thousands of adventure seekers every month.
            Choose a plan that fits your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Adventure Canada connects you with travelers actively searching for outdoor experiences
              across the country.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No hidden fees. No surprise charges. Choose the plan that works for you.
            </p>
          </div>

          {/* Annual savings note */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              Save 17% with annual billing
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? 'border-2 border-primary-500 shadow-lg scale-105'
                    : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  {plan.yearlyPrice && (
                    <p className="text-sm text-gray-500 mt-1">or {plan.yearlyPrice}/year</p>
                  )}
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={feature.included ? 'text-gray-700' : 'text-gray-400'}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaLink}>
                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Canadian Operators</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from tour operators who have grown their business with Adventure Canada.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-0">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions? We&apos;ve got answers.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Adventure Business?
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Join Adventure Canada today and start reaching more customers. Start with our free plan
            and upgrade when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/adventures">
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                Browse Adventures
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-primary-200 text-sm">
            No credit card required for free plan
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span className="text-sm">Canadian Owned</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <span className="text-sm">SSL Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              <span className="text-sm">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
