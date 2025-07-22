import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate();  

  return (
    <div className="relative min-h-screen w-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/homeWallpaper.png')" }}>
      <motion.div className="absolute w-full inset-0  flex flex-col justify-start pt-[10%] px-10 md:px-20 text-white transform "
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}>
        <h2 className="text-2xl md:text-4xl font-bold uppercase mb-2">Your Space</h2>
        <h1 className="text-5xl md:text-8xl text-gray-400 font-extrabold uppercase mb-2">Your Story</h1>
        <h1 className="text-5xl md:text-8xl font-extrabold uppercase text-white mb-4">With Insight</h1>
        <p className="text-xl md:text-2xl mb-6">Help you to understand your feelings, one entry at a time.</p>
        <button className="border border-white w-[300px] text-white text-2xl font-bold italic px-6 py-2 rounded hover:bg-white hover:text-black transition"
        onClick={() => navigate('/diary')}
        >  
          "Start journaling"
        </button>
      </motion.div>
    </div>
  );
}
