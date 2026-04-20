import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const steps = [
  {
    title: "Welcome to Urban Pulse.",
    subtitle: "Your city is not just a map. It's alive.",
  },
  {
    title: "Rediscover familiar places.",
    subtitle: "See the places you walk past every day in a new light.",
  },
  {
    title: "Find new ones that feel like they were made for you.",
    subtitle: "Discover hidden corners that resonate with your spirit.",
  },
  {
    title: "And start seeing your city as something alive.",
    subtitle: "Every street, every bench has a quiet story to tell.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div 
      className="flex flex-col h-[100dvh] bg-gradient-to-b from-[#FAF9F7] to-[#F1F0E9] px-8 justify-center items-center relative overflow-hidden cursor-pointer"
      onClick={handleNext}
    >
      <span className="sr-only">Tap anywhere to continue to the next screen</span>

      {/* Background ambient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-rose-200/40 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Content wrapper centered perfectly in the viewport */}
      <div className="w-full max-w-[320px] z-10 flex flex-col items-start space-y-12">
        
        <div className="grid w-full items-center text-left">
          {/* Ghost elements to maintain consistent maximum height for perfect vertical centering across all steps */}
          {steps.map((s, i) => (
            <div key={`ghost-${i}`} className="col-start-1 row-start-1 space-y-6 opacity-0 pointer-events-none invisible" aria-hidden="true">
              <h1 className="text-3xl sm:text-4xl leading-[1.1] tracking-tight font-medium text-stone-800">
                {s.title}
              </h1>
              <p className="text-lg sm:text-xl text-stone-500 font-light leading-relaxed">
                {s.subtitle}
              </p>
            </div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="col-start-1 row-start-1 space-y-6 flex flex-col justify-center"
            >
              <h1 className="text-3xl sm:text-4xl leading-[1.1] tracking-tight font-medium text-stone-800">
                {steps[step].title}
              </h1>
              <p className="text-lg sm:text-xl text-stone-500 font-light leading-relaxed">
                {steps[step].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicators placed naturally under the text block */}
        <div className="flex space-x-2 w-full pt-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full ${i === step ? 'bg-stone-800' : 'bg-stone-300'}`}
              animate={{ width: i === step ? 24 : 6 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
