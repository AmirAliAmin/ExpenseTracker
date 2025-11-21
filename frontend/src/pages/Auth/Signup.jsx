import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

export default function Signup() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser}= useContext(UserContext)

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name")
      return;
    }
   if (!email) {
    setError("Please enter your email")
      return;
   }
    if (!validateEmail(email)) {
      setError("Please enter valid email address.")
      return;
    }
    if (!password) {
      setError("Please enter the password")
      return;
    }

    setError("");

    //signUp API call
    try {

      //upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });
      const {token, user} = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/login")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      }else{
        setError("SomeThing went Wrong. Please try again")
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h1 className="text-xl font-semibold text-black">Create an Account</h1>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          join us today by entering your detail below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Enter your FullName"
              placeholder="jhon"
              name="fullName"
            />
            <Input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="jhon@email.com"
              name="email"
            />
            <div className="col-span-2">
              <Input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 Characters"
                name="password"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button className="uppercase btn-primary">Sign Up</button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to={"/login"}>
              login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
