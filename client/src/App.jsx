import { useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // INPUT HANDLER
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    console.log("LOGIN RESPONSE:", res.data); // 🔥 IMPORTANT

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful");
    } else {
      setMessage("No token received from backend");
    }

  } catch (error) {
    console.log(error);
    setMessage(error.response?.data?.message || "Login failed");
  }
};

  // PROFILE
  const getProfile = async () => {
  const token = localStorage.getItem("token");

  console.log("TOKEN BEING SENT:", token); // 🔥 DEBUG

  if (!token) {
    setMessage("Please login first");
    return;
  }

  try {
    const res = await axios.get(
      "http://localhost:5000/api/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ MUST BE EXACT
        },
      }
    );

    setProfile(res.data.user);
    setMessage("Profile loaded successfully");

  } catch (error) {
    console.log(error.response);

    setMessage(
      error.response?.data?.message || "Access denied"
    );
  }
};

  // RESUME UPLOAD
  const handleResumeUpload = async () => {
    if (!resume) {
      setMessage("Please select a resume file");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("resume", resume);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setAnalysis(res.data.analysis);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Resume upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setAnalysis(null);
    setMessage("Logged out");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          AI Career Copilot 🚀
        </h1>

        <p className="text-gray-400 text-center mb-6">
          AI-powered resume analysis & career guidance
        </p>

        {/* TOGGLE */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full bg-blue-600 p-3 rounded-lg mb-6"
        >
          {isLogin ? "Switch to Signup" : "Switch to Login"}
        </button>

        {/* FORM */}
        <form onSubmit={isLogin ? handleLogin : handleSignup}>

          {!isLogin && (
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 mb-4 rounded"
            />
          )}

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 mb-4 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 mb-4 rounded"
          />

          <button className="w-full bg-green-600 p-3 rounded">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* RESUME UPLOAD */}
        <div className="mt-6">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full p-3 bg-gray-800 mb-4 rounded"
          />

          <button
            onClick={handleResumeUpload}
            disabled={loading}
            className="w-full bg-yellow-500 text-black p-3 rounded font-bold"
          >
            {loading ? "Analyzing Resume..." : "Upload Resume"}
          </button>
        </div>

        {/* PROFILE */}
        <button
          onClick={getProfile}
          className="w-full bg-purple-600 p-3 rounded mt-4"
        >
          Get Profile
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 p-3 rounded mt-4"
        >
          Logout
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="text-center mt-4 text-yellow-400">
            {message}
          </p>
        )}

        {/* PROFILE */}
        {profile && (
          <div className="mt-6 bg-gray-800 p-4 rounded">
            <p className="text-sm">ID: {profile.id}</p>
            <p className="text-sm">Email: {profile.email}</p>
          </div>
        )}

        {/* ANALYSIS */}
        {analysis && (
          <div className="mt-6 bg-gray-800 p-4 rounded space-y-4">

            <h2 className="text-lg font-bold">
              Resume Analysis
            </h2>

            {/* SKILLS */}
            <div className="flex flex-wrap gap-2">
              {analysis.skills?.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-600 px-2 py-1 rounded text-sm"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* AI RESULT */}
            {analysis?.aiResult && (
              <div className="space-y-3">

                <p className="text-blue-400 font-semibold">
                  Role: {analysis.aiResult.role}
                </p>

                <p className="text-3xl font-bold text-green-400">
                  ATS Score: {analysis.aiResult.score}/100
                </p>

                {/* STRENGTHS */}
                <div>
                  <h3 className="text-green-300 font-semibold">
                    Strengths
                  </h3>
                  <ul className="list-disc ml-5 text-gray-300">
                    {analysis.aiResult.strengths?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div>
                  <h3 className="text-red-300 font-semibold">
                    Weaknesses
                  </h3>
                  <ul className="list-disc ml-5 text-gray-300">
                    {analysis.aiResult.weaknesses?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* IMPROVEMENTS */}
                <div>
                  <h3 className="text-yellow-300 font-semibold">
                    Improvement Plan
                  </h3>
                  <ul className="list-disc ml-5 text-gray-300">
                    {analysis.aiResult.missing?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;