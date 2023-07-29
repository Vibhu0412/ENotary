import { axiosInstance } from './common/api';

export const getAllUsers = ({ filters, status, page, size, sort, orderBy }) => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('status', status);
  urlSearchParams.append('page', page);
  urlSearchParams.append('size', size);

  if (sort) {
    urlSearchParams.append('sort', sort);
    urlSearchParams.append('orderBy', orderBy);
  }

  if (filters) {
    Object.keys(filters).forEach(key => {
      urlSearchParams.append(key, filters[key]);
    });
  }

  const url = '/users';

  return new Promise((resolve, reject) => {
    axiosInstance
      .get(url, {
        params: urlSearchParams,
      })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
};
export const getUserById = userId => {
  const url = `/users/${userId}`;
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(url)
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
export const approveUserDetails = (data, userType) => {
  const url = `/approve/${userType}`;
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(url, data)
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
