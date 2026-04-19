import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AmbientBackground from "../components/AmbientBackground";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState({
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
      await login(values);
      toast.success("Welcome back to Smart Home Cloud V2.");
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <AmbientBackground />
      <AuthCard
        title="Sign in"
        description="Access your premium smart-home workspace with live rooms, schedules, charts, and automation alerts."
        submitLabel="Login"
        footerLabel="Need an account?"
        footerLinkLabel="Create one"
        footerLinkTo="/register"
        values={values}
        loading={loading}
        error={error}
        showNameField={false}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default LoginPage;
