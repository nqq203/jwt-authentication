import api from "./api"

export async function register({ username, email, password, fullName }) {
  const userInfo = {
    username,
    email,
    password,
    fullName,
  }
  console.log(userInfo);
  try {
    const { data } = await api.post('/user/register', userInfo);
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error registering user:", err.response || err);
    throw err;
  }
}

export async function login({ email, password }) {
  const userInfo = { email, password };
  try {
    const { data } = await api.post('/user/login', userInfo);
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error logging in user:", err.response || err);
    throw err;
  }
}

export async function logout() {
  try {
    const { data } = await api.post('/user/logout');
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error logging out user:", err.response || err);
    throw err;
  }
}

export async function profile() {
  try {
    const { data } = await api.get('/user/profile');
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error fetching user profile:", err.response || err);
    throw err;
  }
}