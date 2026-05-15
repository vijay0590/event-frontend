import BackButton from "./BackButton";

const PageLayout = ({ children, showBack = true, maxWidth = "max-w-6xl" }) => {
  return (
    <main className={`min-h-[80vh] mx-auto px-6 py-8 ${maxWidth} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
      
      {/* CONDITIONAL BACK BUTTON */}
      {showBack && (
        <div className="mb-2">
          <BackButton />
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="relative">
        {children}
      </div>

    </main>
  );
};

export default PageLayout;