import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

// Services notaryApi
export const notaryApi = createApi({
  reducerPath: 'notaryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASEURL + '/api/v1',

    prepareHeaders: (headers, { getState }) => {
      const jwtToken = getState().auth.jwt;

      console.log('right now my token is', jwtToken);
      if (jwtToken) {
        headers.set('authorization', `Bearer ${jwtToken}`);
      }
      return headers;
    },
  }),

  endpoints: builder => ({
    notarySignup: builder.mutation({
      query: user => ({
        url: '/auth/notary/signup',
        method: 'POST',
        body: user,
      }),
    }),
    notaryLogin: builder.mutation({
      query: userInfo => ({
        url: '/login',
        method: 'POST',
        body: { userInfo },
      }),
    }),
    notaryAdditionalSignup: builder.mutation({
      query: user => ({
        url: '/users/notary/me',
        method: 'PUT',
        body: user,
      }),
    }),
  }),
});

export const {
  useNotarySignupMutation,
  useNotaryLoginMutation,
  useNotaryAdditionalSignupMutation,
} = notaryApi;
