import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const resources = [
    { label: 'Interview Tips', to: '/dashboard' },
    { label: 'Technical Questions', to: '/dashboard' },
    { label: 'FAQ', to: '/dashboard' },
    { label: 'Blog', to: '/dashboard' },
  ];

  const topics = [
    'Frontend', 'Backend', 'SQL', 'Data Structures', 'Algorithms'
  ];

  const socialLinks = [
    { icon: faLinkedin, href: 'https://www.linkedin.com/in/yashi-gupta-22785a2b0/' },
    { icon: faGithub, href: 'https://github.com/yashiigupta' },
    { icon: faTwitter, href: 'https://github.com/Team-Winners' },
  ];

  const legalLinks = [['Terms', 'terms'], ['Privacy', 'privacy-policy'], ['Cookies', '/']];

  const linkClasses = "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm";

  return (
    <footer className="w-full bg-black py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-black dark:text-white mb-4">
              <FontAwesomeIcon icon={faCircleNotch} className="text-xl" />
              <p>Untitled AI</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Practice your interview skills with our AI-powered mock interviewer. Get instant feedback and improve your chances of landing your dream job.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-black dark:text-white mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.to} className={linkClasses}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black dark:text-white mb-6">Topics</h4>
            <ul className="space-y-3">
              {topics.map((topic, idx) => (
                <li key={idx}>
                  <Link to="/interview" className={linkClasses}>{topic}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black dark:text-white mb-6">Join our community</h4>
            <div className="flex space-x-5">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <FontAwesomeIcon icon={faCopyright} className="text-xs" />
            <p>{new Date().getFullYear()} Untitled AI. All rights reserved.</p>
          </div>
          <div className="flex space-x-8 mt-6 md:mt-0">
            {legalLinks.map((item, idx) => (
              <Link key={idx} to={item[1]} className={linkClasses}>{item[0]}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
