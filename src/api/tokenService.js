export const localStorageServices = {
  setToken: (token) => {
    localStorage.setItem("token", token);
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  setUser: (user) => {
    const userStr = JSON.stringify(user);
    return localStorage.setItem("user", userStr);
  },
  getUser: () => {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  },
  deleteToken: () => {
    localStorage.removeItem("token");
  },
  deleteUser: () => {
    localStorage.removeItem("user");
  },
};
