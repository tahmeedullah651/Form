import { Link, useNavigate } from "react-router-dom";
import { TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import Text from "../components/Text";
const SingUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields");
    }
    try {
      console.log("try");
      setLoading(true);
      setErrorMessage(null);
      const response = await axios.post("/api/auth/signup", formData);
      console.log(response);
      setLoading(false);
      setErrorMessage(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full pt-14 bg-gray-100">
      <div className="max-w-3xl flex flex-col mx-auto bg-white">
        <Text text=" WelCome to WedBook" />
        <div className="w-[40rem] mx-auto flex flex-col pt-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div className="item-center w-[10rem] mx-auto flex">
              <Button
                className="bg-white text-[#05C7AA] hover:bg-sky-700 border-2 border-[#05C7AA]"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </div>
          </form>
          <div className="mt-3 flex gap-2 text-sm items-center w-[14rem] mx-auto pb-6">
            <span className="text-[#05C7AA]">Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              SignIn
            </Link>
          </div>
          {errorMessage && (
            <Alert className="my-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingUp;
