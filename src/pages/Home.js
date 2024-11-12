import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profile, logout } from "../api/user";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogin, setUser } from "../redux/authSlice";
import moment from "moment";

export default function Home() {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.auth.isLogin);
  const user = useSelector(state => state.auth.user);
  const token = localStorage.getItem('accessToken');

  if (token && !isLogin) {
    fetchUserData();
    dispatch(setIsLogin(true));
  }

  useEffect(() => {
    if (token && !isLogin) {
      dispatch(setIsLogin(true));
      fetchUserData();
    } else {
      dispatch(setIsLogin(false));
    }
  }, [dispatch]);

  async function fetchUserData() {
    try {
      const data = await profile();
      dispatch(setUser(data?.data));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      dispatch(setIsLogin(false)); // Handle error by resetting login state
    }
  }

  async function handleLogout() {
    try {
      await logout();
      dispatch(setIsLogin(false));
      dispatch(setUser(null));
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error("Error logging out:", error);
    }
    window.location.reload();
  }

  return (
    <Fragment>
      {isLogin ?
        <div className="flex justify-center items-center min-h-screen px-4 relative">
          <div
            className="flex flex-col items-center rounded-lg bg-white shadow-xl p-10 max-w-4xl w-full space-y-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
          >
            <div className="text-center">
              <img className="mx-auto h-[300px] w-50" src={user?.avatar || "../assets/avt.png"} alt="Avatar" />
              <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
                Account Information
              </h2>
            </div>
            <form className="mt-8 space-y-8 w-full">
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                    placeholder="Username"
                    defaultValue={user?.username}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                    placeholder="Email"
                    defaultValue={user?.email}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Full Name</label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                    placeholder="Full Name"
                    defaultValue={user?.fullName}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Created At</label>
                  <input
                    id="createdat"
                    name="createdat"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                    placeholder="Date Create"
                    defaultValue={moment(user?.createdAt).format('DD-MM-YYYY')}
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="py-3 px-6 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
        :
        <div className="flex flex-col gap-[10px] justify-center items-center h-screen">
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[300px] p-8 h-[60px] text-xl">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[300px] p-8 h-[60px] text-xl">
              Register
            </button>
          </Link>
        </div>}
    </Fragment>
  );
}
