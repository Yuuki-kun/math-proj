//this is a helper function to save and get data from local storage

export const LocalStorage = {
  save: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
