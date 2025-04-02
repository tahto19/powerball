import { createSlice } from "@reduxjs/toolkit"
import { getAdmin } from "./asnycCalls"

interface adminState {
    list: Array<any> | null
    loading: boolean | null
    limit: number | null
    offset: number | null
    sort: string | null
    filter: string | null
    count: number | null
}

const initialState: adminState = {
    list: [],
    loading: true,
    limit: 10,
    offset: 0,
    sort: '[["id","ASC"]]',
    filter: null,
    count: null
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        addList: (state, action) => {
            state.list = action.payload.list
            state.count = action.payload.count
        },
        addoffset: (state, action) => {
            state.offset = action.payload.offset
        },
        addLimit: (state, action) => {
            state.limit = action.payload.limit
        },
        addCount: (state, action) => {
            state.count = action.payload.count
        },
        addSort: (state, action) => {
            state.sort = action.payload.sort
        },
        addFilter: (state, action) => {
            state.filter = action.payload.filter
        }
    },
    extraReducers: (b) => {
        b.addCase(getAdmin.fulfilled, state => {
            state.loading = false
            state.list = []
        });
        b.addCase(getAdmin.pending, state => {
            state.loading = true
            state.list = []
        })
    }
})


export const { addList,
    addoffset,
    addLimit,
    addCount,
    addSort,
    addFilter, } = adminSlice.actions
export default adminSlice.reducer
