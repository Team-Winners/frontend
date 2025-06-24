import { motion } from "framer-motion";
import heroImg from "../assets/ihor-dvoretskyi-GCFuprAvC6A-unsplash.jpg";
import side1 from "../assets/matthew-manuel-BhLSBX-0rnM-unsplash.jpg";
import side2 from "../assets/tadas-sar-T01GZhBSyMQ-unsplash.jpg";

const InterviewFeatureGrid = () => {
  return (
    <section className="bg-black py-15 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-5xl font-bold text-white mb-16"
        >
          The future of interview is personalized.
        </motion.h2>

        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="relative w-full md:w-2/3 h-[calc(100vw*0.405)] rounded-xl overflow-hidden">
            <img
              src={heroImg}
              alt="Main"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center px-6"
              >
                <h3 className="text-white text-3xl md:text-4xl font-semibold leading-tight">
                  Master Your Interview Skills
                </h3>
                <p className="mt-4 text-white text-lg max-w-xl mx-auto">
                  Our AI interviewer specializes in various technical domains to help you prepare.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <img
              src={side2}
              alt="Secondary 1"
              className="w-full h-[calc(100vw*0.2)] object-cover rounded-xl"
            />
            <img
              src={side1}
              alt="Secondary 2"
              className="w-full h-[calc(100vw*0.2)] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterviewFeatureGrid;
