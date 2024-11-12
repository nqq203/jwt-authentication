import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { useState, useEffect } from "react";
import { register } from "../api/user";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogin } from "../redux/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.auth.isLogin);
  const token = localStorage.getItem('accessToken');

  if (token && !isLogin) {
    dispatch(setIsLogin(true));
  }

  useEffect(() => {
    if (token) {
      dispatch(setIsLogin(true));
      navigate("/home");
    } else {
      dispatch(setIsLogin(false));
    }
  }, [dispatch]);
  
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    bgColor: "green",
  });
  const [account, setAccount] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  async function onSubmitRegistration(e) {
    e.preventDefault();
    if (!account.username || !account.email || !account.password || !account.fullName) {
      setNotification({
        message: "Please fill in all fields",
        visible: true,
        bgColor: "red",
      });
      return;
    }
    const accountRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account.email)) {
      setNotification({
        message: "Invalid email format",
        visible: true,
        bgColor: "red",
      });
      return;
    }
    if (!accountRegex.test(account.password)) {
      setNotification({
        message: "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
        visible: true,
        bgColor: "red",
      });
      return;
    }
    if (account.password.length < 8) {
      setNotification({
        message: "Password must be at least 8 characters long",
        visible: true,
        bgColor: "red",
      });
      return;
    }

    try {
      const data = await register(account);
      if (data?.statusCode === 201) {
        setNotification({
          message: data?.message,
          visible: true,
          bgColor: "green",
        });
        setAccount({
          username: "",
          password: "",
          email: "",
        });
      }
      else {
        setNotification({
          message: data?.message,
          visible: true,
          bgColor: "red",
        });
      }
    } catch (error) {
      console.log(error);
      setNotification({
        message: "An error occurred while registering",
        visible: true,
        bgColor: "red",
      })
    }
  }

  return (
    <div className="flex justify-center items-center h-[100vh] px-4 relative">
      <Notification
        message={notification?.message}
        visible={notification?.visible}
        bgColor={notification?.bgColor}
        onClose={() => setNotification({ message: '', visible: false, bgColor: 'green' })}/>
      <div
        className="flex flex-col items-center rounded-[20px] bg-transparent w-full sm:w-2/3 md:w-1/2 lg:w-1/3 justify-center bg-white shadow-lg shadow-black-500/50 p-8 min-h-[50vh]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-blue-500 mb-10 md:mb-20">Register</h1>
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full sm:w-3/4 p-3 mb-5 rounded-md border border-gray-300 text-lg focus:outline-none focus:border-blue-500"
            value={account.username}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full sm:w-3/4 p-3 mb-5 rounded-md border border-gray-300 text-lg focus:outline-none focus:border-blue-500"
            value={account.email}
            onChange={handleInputChange}
          />
           <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full sm:w-3/4 p-3 mb-5 rounded-md border border-gray-300 text-lg focus:outline-none focus:border-blue-500"
            value={account.fullName}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full sm:w-3/4 p-3 mb-8 rounded-md border border-gray-300 text-lg focus:outline-none focus:border-blue-500"
            value={account.password}
            onChange={handleInputChange}
          />
          <button
            className="w-full sm:w-3/4 p-3 mt-4 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600"
            onClick={onSubmitRegistration}>
            Register
          </button>
          <p className="mt-4 text-gray-600">
            Have account yet?,{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
