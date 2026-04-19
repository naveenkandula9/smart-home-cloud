import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AmbientBackground from "../components/AmbientBackground";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await register(values);
      toast.success("Account created. Your dashboard is ready.");
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <AmbientBackground />
      <AuthCard
        title="Create account"
        description="Launch your authenticated smart-home workspace with secure access, live socket sync, and automated routines."
        submitLabel="Register"
        footerLabel="Already have an account?"
        footerLinkLabel="Login"
        footerLinkTo="/login"
        values={values}
        loading={loading}
        error={error}
        showNameField
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default RegisterPage;
