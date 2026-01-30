import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Adventure Canada',
  description: 'Learn how Adventure Canada collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2024'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <p className="lead text-lg text-gray-600">
              Adventure Canada (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
              committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website
              adventurecanada.com.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide when you:</p>
            <ul>
              <li>Create an account or register on our platform</li>
              <li>Submit an inquiry to a tour operator</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our contact form</li>
              <li>List your business as a tour operator</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Business information (for tour operators)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information,
              including:
            </p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li>
                <strong>With Tour Operators:</strong> When you submit an inquiry, your contact
                information is shared with the relevant tour operator.
              </li>
              <li>
                <strong>Service Providers:</strong> We work with third-party service providers
                (payment processors, analytics, hosting) who need access to your information to
                perform services on our behalf.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information when required by
                law or to protect our rights.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets.
              </li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and track information
              about your browsing activities. You can control cookies through your browser settings.
            </p>
            <p>We use cookies for:</p>
            <ul>
              <li>Essential website functionality</li>
              <li>Analytics and performance monitoring</li>
              <li>Remembering your preferences</li>
              <li>Marketing and advertising (with consent)</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect
              your personal information. However, no method of transmission over the Internet or
              electronic storage is 100% secure.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal
              information:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@adventurecanada.com.</p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to children under 16. We do not knowingly collect
              personal information from children under 16. If you believe we have collected
              information from a child, please contact us.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than Canada.
              We ensure appropriate safeguards are in place to protect your information in
              accordance with this Privacy Policy.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices of these websites. We encourage you to review their privacy
              policies.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the &ldquo;Last
              Updated&rdquo; date.
            </p>

            <h2>12. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>
                Email:{' '}
                <a href="mailto:privacy@adventurecanada.com">privacy@adventurecanada.com</a>
              </li>
              <li>
                Mail: Adventure Canada, 123 Adventure Way, Vancouver, BC V6B 1A1, Canada
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-4">
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
