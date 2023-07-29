import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASEURL + '/api/v1',

  prepareHeaders: (headers, { getState }) => {
    const jwtToken = getState().auth.jwt;

    console.log('right now my token is', jwtToken);
    if (jwtToken) {
      headers.set('authorization', `Bearer ${jwtToken}`);
    }
    return headers;
  },
});

export const commonApi = createApi({
  reducerPath: 'commonApi',

  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    userInfo: builder.mutation({
      query: () => ({
        url: 'users/me',
        method: 'GET',
      }),
    }),
    signeeStatus: builder.mutation({
      query: user => ({
        url: 'users/signee/me',
        method: 'PUT',
        body: user,
      })
    })
  }),
});

export const { useUserInfoMutation, useSigneeStatusMutation } = commonApi;
