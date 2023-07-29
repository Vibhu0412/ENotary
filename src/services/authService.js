import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASEURL + '/api/v1/auth/' }),
  endpoints: builder => ({
    signeeSignup: builder.mutation({
      query: user => ({
        url: 'signee/signup',
        method: 'POST',
        body: user,
      }),
    }),
    signeeLogin: builder.mutation({
      query: data => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return ({
          url: 'forgot-password/',
          method: 'POST',
          body: data
        })
      }
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: 'reset-password/',
        method: 'POST',
        body: data
      }),
    })
  }),
});

export const { useSigneeSignupMutation, useSigneeLoginMutation, useForgotPasswordMutation, useResetPasswordMutation
} = authApi;
