import HeaderHomePage from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-4xl py-20 px-4 mt-16">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect information you provide directly to us when you create an account, complete your profile, 
              or participate in interview sessions. This includes your name, email address, skills, experience level, 
              and responses during practice interviews.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the information we collect to provide, maintain, and improve our services, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
              <li>Personalizing interview questions based on your profile</li>
              <li>Providing feedback on your interview performance</li>
              <li>Tracking your progress over time</li>
              <li>Improving our AI algorithms and question database</li>
              <li>Communicating with you about our services</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Sharing Your Information</h2>
            <p className="text-gray-300">
              We do not share your personal information with third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a business transfer or transaction</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to access, update, or delete your personal information. You can do this by accessing your 
              account settings or contacting us directly. You can also opt out of receiving promotional communications from us.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
              policy on this page and updating the effective date. You are advised to review this policy periodically for any changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this privacy policy, please contact us at support@untitledai.com.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
