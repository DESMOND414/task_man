import { apiSlice } from "../apiSlice";
const GROUP_URL = "/api/groups";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => ({
        url: `${GROUP_URL}`,
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: `${GROUP_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    addGroupMember: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `${GROUP_URL}/${groupId}/add-member`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["Group"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `${GROUP_URL}/${groupId}/remove-member`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `${GROUP_URL}/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useAddGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useDeleteGroupMutation,
} = groupApiSlice;