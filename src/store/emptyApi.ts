// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers) => {
            const authToken = localStorage.getItem("authToken");
            if (authToken) {
                headers.set("Authorization", `Token ${authToken}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});
