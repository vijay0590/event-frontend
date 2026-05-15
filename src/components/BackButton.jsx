import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={3} 
          stroke="currentColor" 
          className="w-3 h-3 transition-transform group-hover:-translate-x-0.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </div>
      <span>Go Back</span>
    </button>
  );
};

export default BackButton;