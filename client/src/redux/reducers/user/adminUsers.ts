//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit"
import { getAdmin } from "./asnycCalls"

interface adminState {
    list: Array<any> | null
    loading: boolean | null
    limit: number | null
    offset: number | null
    sort: string | null
    filter: Array<any> | null
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
        addOffset: (state, action) => {
            state.offset = action.payload
        },
        addLimit: (state, action) => {
            state.limit = action.payload
        },
       
        addSort: (state, action) => {
            state.sort = action.payload
        },
        addFilter: (state, action) => {
            state.filter = action.payload
        }
    },
    extraReducers: (b) => {
        b.addCase(getAdmin.fulfilled, state => {
            state.loading = false
      
        });
        b.addCase(getAdmin.pending, state => {
            state.loading = true
            state.list = []
        })
    }
})


export const { addList,
    addOffset,
    addLimit,
    addCount,
    addSort,
    addFilter, } = adminSlice.actions
export default adminSlice.reducer
