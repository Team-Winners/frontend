import HeaderHomePage from './HeaderHomePage';
import FloatingNews from './FloatingNews';
import { HeroHighlightDemo } from '../HeroHighlightDemo';
import Footer from './Footer';
import Hero from './Hero';
import ChatFeature from './ChatFeature';

const Homepage = () => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white">
      <HeaderHomePage />
      
      {/* Hero Section with HeroHighlight */}
      <HeroHighlightDemo />
      
      {/* Floating News Banner */}
      <FloatingNews />
      
      {/* Hero (formerly ResponsiveImageGrid) */}
      <Hero />
      
      {/* Chat Feature */}
      <ChatFeature />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
