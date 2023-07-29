import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASEURL + '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const jwtToken = getState().auth.jwt;
    if (jwtToken) {
      headers.set('authorization', `Bearer ${jwtToken}`);
    }
    return headers;
  },
});

export const adminApi = createApi({
  reducerPath: 'adminApi',

  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    addAdmin: builder.mutation({
      query: userData => ({
        url: 'users/admin/',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useAddAdminMutation } = adminApi;
