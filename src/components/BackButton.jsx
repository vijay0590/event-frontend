import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-4 text-sm text-indigo-600 hover:underline"
    >
      ← Back
    </button>
  );
};

export default BackButton;