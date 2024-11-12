import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { login } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setUser } from "../redux/authSlice";

export default function Login() {
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
    password: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  async function onSubmitLogin(e) {
    console.log("click")
    e.preventDefault();
    if (!account.email || !account.password) {
      setNotification({
        message: "Please fill in all fields",
        visible: true,
        bgColor: "red",
      });
      return;
    }
    try {
      const data = await login(account);
      if (data?.statusCode === 200) {
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
        localStorage.setItem("accessToken", data?.data?.token);
        dispatch(setIsLogin(true));
        dispatch(setUser(data?.data?.user));
        navigate("/home");
      }
      else if (data?.statusCode === 401) {
        setNotification({
          message: data?.message,
          visible: true,
          bgColor: "red",
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
        onClose={() => setNotification({ message: '', visible: false, bgColor: 'green' })} />
      <div
        className="flex flex-col items-center rounded-[20px] bg-transparent w-full sm:w-2/3 md:w-1/2 lg:w-1/3 justify-center bg-white shadow-lg shadow-black-500/50 p-8 min-h-[50vh]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-blue-500 mb-10 md:mb-20">Login</h1>
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full sm:w-3/4 p-3 mb-5 rounded-md border border-gray-300 text-lg focus:outline-none focus:border-blue-500"
            value={account.email}
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
            onClick={onSubmitLogin}>
            Login
          </button>
          <p className="mt-4 text-gray-600">
            Not have account?,{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
