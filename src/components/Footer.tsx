import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const resourceLinks = [
    { label: 'Interview Tips', to: '/dashboard' },
    { label: 'Technical Questions', to: '/dashboard' },
    { label: 'FAQ', to: '/dashboard' },
    { label: 'Blog', to: '/dashboard' },
  ];

  const topicLinks = [
    { label: 'Frontend', to: '/interview?topic=frontend' },
    { label: 'Backend', to: '/interview?topic=backend' },
    { label: 'SQL', to: '/interview?topic=database' },
    { label: 'Data Structures', to: '/interview?topic=dsa' },
    { label: 'Algorithms', to: '/interview?topic=algorithms' }
  ];

  const policyLinks = [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy-policy' }
  ];

  const socialIcons = [
    { icon: faLinkedin, href: '#' },
    { icon: faGithub, href: '#' },
    { icon: faTwitter, href: '#' },
  ];

  return (
    <footer className="w-full bg-white pb-7">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-black mb-4">
              <FontAwesomeIcon icon={faCircleNotch} className="text-xl" />
              <p>Untitled AI</p>
            </div>
            <p className="text-black text-sm">
              Practice your interview skills with our AI-powered mock interviewer. Get instant feedback and improve your chances of landing your dream job.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-black mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-black font-medium text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold text-black mb-6">Topics</h4>
            <ul className="space-y-3">
              {topicLinks.map((topic, i) => (
                <li key={i}>
                  <Link
                    to={topic.to}
                    className="text-black font-medium text-sm"
                  >
                    {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-black mb-6">Join our community</h4>
            <div className="flex space-x-5">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-black"
                >
                  <FontAwesomeIcon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-black">
            <FontAwesomeIcon icon={faCopyright} className="text-xs" />
            <p className='text-md font-medium'>{new Date().getFullYear()} Untitled AI. All rights reserved.</p>
          </div>
          <div className="flex space-x-8 mt-6 md:mt-0">
            {policyLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="text-sm text-black font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
