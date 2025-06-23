import React from 'react';
import HeaderHomePage from './HeaderHomePage';
import Footer from './Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-4xl py-20 px-4 mt-16">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by the terms of this agreement, please do not use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-gray-300">
              Our platform provides AI-powered mock interview practice sessions for technical and non-technical roles. 
              We offer personalized feedback, scoring, and improvement suggestions based on your responses.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-gray-300">
              Some features of the service require registration for an account. You agree to provide accurate, current, and complete 
              information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Privacy Policy</h2>
            <p className="text-gray-300">
              Your use of the service is also governed by our Privacy Policy, which can be found at <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Content Usage</h2>
            <p className="text-gray-300">
              All content generated during interview sessions may be used anonymously to improve our service. 
              Your personal information will never be shared with third parties without your explicit consent.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Modifications to the Service</h2>
            <p className="text-gray-300">
              We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. 
              You agree that we shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
            <p className="text-gray-300">
              We reserve the right to terminate your access to the service, without cause or notice, which may result in the forfeiture 
              and destruction of all information associated with your account.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
