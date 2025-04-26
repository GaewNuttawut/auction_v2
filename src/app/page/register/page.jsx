'use client';
import React , {useState} from 'react';
import Navbar from "../../components/Navbar";
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const { data: session } = useSession();
  if (session) redirect("/page/homepage");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    
    try {
      if (!email || !email.includes("@")) {
        setError("Invalid email format.");
        return;
      }
      if (!name) {
        setError("Name is required.");
        return;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (!password || password !== confirmpassword) {
        setError("Passwords do not match.");
        return;
      }

      const res = await fetch(
        "http://localhost:3111/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "BusinessId": "1234567890",
          },
          body: JSON.stringify({
            name,
            email,
            password,  
            confirmpassword,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An error occurred during registration.");
        setSuccess('registration successfully ');
        return;
      }

      toast.success("You have successfully applied for membership. Please confirm your email.");
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  bg-cover bg-center"
     style={{ backgroundImage: "url('/images/bgr.jpg')" }}
    >
      <Navbar />
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8 bg-opacity-70 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
            {error && (
                <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
                {error}
                </div>
            )}
          <div onChange={(e)  => setName(e.target.value)} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              User name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="user name"
            />
          </div>
          <div onChange={(e)  => setEmail(e.target.value)} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="email"
            />
          </div>
          <div onChange={(e)  => setPhone(e.target.value)} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone number
            </label>
            <input
              type="phone"
              id="phone"
              name="phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="phone number"
              maxLength="10"
            />
          </div>

          {/*password //////////////////////////////////////////////////////////////////////////*/}
          <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="password"
          />
          <button
            type="button"
            className='absolute right-2 top-9 text-sm text-black flex items-center'
            onClick={() => setShowPassword(!showPassword)}
          >
             {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

          {/*confirmpassword //////////////////////////////////////////////////////////////////////////*/}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmpassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="confirm password"
            />
            <button
              type="button"
              className='absolute right-2 top-9 text-sm text-black '
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? '🙈' : '👁️'}
            </button>
        </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-gradient-to-tr from-red-500 to-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
            >
              Register
            </button>
            <a
              href="/page/login"
              className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-white hover:bg-green-800 py-2 px-4 rounded"
            >
              Login!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;