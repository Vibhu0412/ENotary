import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

// Services notaryApi
export const organizationApi = createApi({
  reducerPath: 'organizationApi',
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
    organizationSignup: builder.mutation({
      query: user => ({
        url: '/auth/organization/signup',
        method: 'POST',
        body: user,
      }),
    }),
    organizationId: builder.mutation({
      query: user => ({
        url: '/organization/me',
        method: 'PUT',
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
  }),
});

export const {
  useOrganizationSignupMutation,
  useOrganizationLoginMutation,
  useOrganizationIdMutation,
} = organizationApi;
