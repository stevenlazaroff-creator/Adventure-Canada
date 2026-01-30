import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Adventure Canada',
  description: 'Read the terms and conditions for using Adventure Canada platform and services.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'January 1, 2024'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <p className="lead text-lg text-gray-600">
              Welcome to Adventure Canada. By accessing or using our website and services, you
              agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Adventure Canada (&ldquo;the Service&rdquo;), you agree to be
              bound by these Terms of Service and all applicable laws and regulations. If you do
              not agree with any of these terms, you are prohibited from using the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Adventure Canada is an online directory platform that connects adventure seekers with
              tour operators across Canada. We provide:
            </p>
            <ul>
              <li>A searchable directory of adventure tour operators</li>
              <li>Listing services for tour operators</li>
              <li>Inquiry forms to connect users with operators</li>
              <li>Related services and features</li>
            </ul>
            <p>
              <strong>Important:</strong> Adventure Canada is a directory service. We do not
              operate tours, provide adventure activities, or act as a travel agent. All tours and
              activities are provided by independent tour operators.
            </p>

            <h2>3. User Accounts</h2>

            <h3>Account Creation</h3>
            <p>
              To access certain features, you may need to create an account. You agree to provide
              accurate, current, and complete information during registration and to update such
              information to keep it accurate.
            </p>

            <h3>Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use.
            </p>

            <h2>4. Tour Operator Terms</h2>
            <p>If you are a tour operator using our platform, you additionally agree to:</p>
            <ul>
              <li>Provide accurate and truthful information about your business and services</li>
              <li>Maintain all necessary licenses, permits, and insurance for your operations</li>
              <li>Respond promptly to inquiries from potential customers</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the platform for any fraudulent or deceptive purposes</li>
            </ul>

            <h3>Listing Content</h3>
            <p>
              You retain ownership of the content you submit to your listing. By submitting
              content, you grant Adventure Canada a non-exclusive, worldwide, royalty-free license
              to use, display, and distribute the content in connection with the Service.
            </p>

            <h3>Subscription and Payments</h3>
            <p>
              Paid subscription plans are billed according to the plan selected. You authorize us
              to charge your payment method for all fees. Subscriptions automatically renew unless
              cancelled before the renewal date.
            </p>

            <h2>5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Collect or harvest user data without consent</li>
              <li>Post spam, advertisements, or promotional materials</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by
              Adventure Canada and are protected by copyright, trademark, and other intellectual
              property laws. Our trademarks may not be used without prior written permission.
            </p>

            <h2>7. Third-Party Services</h2>
            <p>
              The Service may contain links to third-party websites or services. We are not
              responsible for the content, privacy policies, or practices of third-party sites.
              Your interactions with tour operators listed on our platform are solely between you
              and the operator.
            </p>

            <h2>8. Disclaimers</h2>

            <h3>Service Provided &ldquo;As Is&rdquo;</h3>
            <p>
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              basis without warranties of any kind, either express or implied, including but not
              limited to implied warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>

            <h3>No Endorsement</h3>
            <p>
              Listing on Adventure Canada does not constitute an endorsement or recommendation of
              any tour operator. We do not verify, endorse, or guarantee the quality, safety, or
              legality of any tours or services offered by operators on our platform.
            </p>

            <h3>Assumption of Risk</h3>
            <p>
              Adventure activities involve inherent risks. Users acknowledge that they participate
              in any activities at their own risk and should conduct their own due diligence before
              booking with any operator.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Adventure Canada shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or any loss of data,
              use, goodwill, or other intangible losses resulting from:
            </p>
            <ul>
              <li>Your use or inability to use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Any tours, activities, or services provided by tour operators</li>
            </ul>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Adventure Canada and its officers,
              directors, employees, and agents from any claims, damages, losses, or expenses
              (including reasonable attorney&apos;s fees) arising out of your use of the Service or
              violation of these Terms.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately,
              without prior notice, for any reason, including breach of these Terms. Upon
              termination, your right to use the Service will immediately cease.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of
              significant changes by posting a notice on our website or sending an email.
              Continued use of the Service after changes constitutes acceptance of the modified
              Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              Province of British Columbia, Canada, without regard to its conflict of law
              provisions.
            </p>

            <h2>14. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or the Service shall first be attempted to be
              resolved through good faith negotiation. If unsuccessful, disputes shall be submitted
              to binding arbitration in Vancouver, British Columbia, Canada.
            </p>

            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining
              provisions will continue in full force and effect.
            </p>

            <h2>16. Contact Information</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <ul>
              <li>
                Email: <a href="mailto:legal@adventurecanada.com">legal@adventurecanada.com</a>
              </li>
              <li>
                Mail: Adventure Canada, 123 Adventure Way, Vancouver, BC V6B 1A1, Canada
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-4">
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
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
