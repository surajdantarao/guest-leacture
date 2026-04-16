export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const getUser = () => {
  return getFromLocalStorage('user');
};

export const saveUser = (user) => {
  saveToLocalStorage('user', user);
};

export const removeUser = () => {
  localStorage.removeItem('user');
};
