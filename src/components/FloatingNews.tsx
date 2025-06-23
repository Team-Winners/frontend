const FloatingNews = () => {
  return (
    <div className="w-full overflow-hidden bg-white relative py-8 flex items-center border-y border-gray-900">
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .scrolling-text {
            display: inline-block;
            white-space: nowrap;
            animation: scroll 30s linear infinite;
            animation-fill-mode: forwards;
          }
        `}
      </style>
      <p className="text-black text-sm md:text-base absolute scrolling-text px-4 font-semibold tracking-wider">
        Transforming career development with our AI-powered platform — Master interviews. Learn smarter. Connect meaningfully. Express creatively. Stand out professionally.
      </p>
    </div>
  );
};

export default FloatingNews;
