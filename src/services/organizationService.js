import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASEURL } from '../envVariables';

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: API_BASEURL + '/api/v1/',

    prepareHeaders: (headers, { getState }) => {
        const jwtToken = getState().auth.jwt;
        if (jwtToken) {
            headers.set('authorization', `Bearer ${jwtToken}`);
        }
        return headers;
    },
});

export const organizationApi = createApi({
    reducerPath: 'organizationApi',

    baseQuery: baseQueryWithAuth,
    endpoints: builder => ({
        inviteUsers: builder.mutation({
            query: (userData) => ({
                url: 'users/invite-user',
                method: 'POST',
                body: userData
            }),
        }),
    }),
});

export const { useInviteUsersMutation } = organizationApi;