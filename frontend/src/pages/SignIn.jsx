import { Link, useNavigate } from "react-router-dom";
import {
  TextInput,
  Label,
  Button,
  Alert,
  Spinner,
  Checkbox,
} from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  signinFailure,
  signinStart,
  signinSucccess,
} from "../redux/user/userSlice";
import Text from "../components/Text";
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signinStart("Please fill out all fields"));
    }
    try {
      dispatch(signinStart());
      const response = await axios.post("/api/auth/signin", formData);
      dispatch(signinSucccess(response.data));

      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(signinFailure(error.response.data.message));
    }
  };
  return (
    <div className="min-h-screen w-full pt-14 bg-gray-100">
      <div className="max-w-3xl flex flex-col mx-auto bg-white">
        <Text text="  WelCome to Login" />

        <div className="w-[40rem] mx-auto flex flex-col pt-6">
          <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
            <div className="">
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2 mt-[-25px]">
              <Checkbox
                id="show"
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <Label htmlFor="show">Show password</Label>
            </div>
            <div className="item-center w-[10rem] mx-auto flex">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-[#05C7AA] border-2 border-[#05C7AA]"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
          <div className="mt-3 flex gap-2 text-sm items-center w-[20rem] mx-auto pb-6">
            <span className="text-[#05C7AA]">Dont Have an account?</span>
            <Link to="/signup" className="text-blue-500">
              SignUp
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

export default SignIn;
