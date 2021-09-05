import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch2point0, fetch3point0 } from "../helpers/fetch2";


const initialState = []

//Create todo req to server and response back by createAsyncThunk
export const createtodo = createAsyncThunk(
    'addtodo',
    async (body) => {
        const result = await fetch2point0('/createtodo', body)
        return result
    }
)

//Action creator = Fetch todos req to server
export const fetchtodos = createAsyncThunk(
    'fetchtodos',
    async () => {
        const res = await fetch3point0('/gettodos', 'get')
        return res
    }
)

//Action creator = Delete todo req to server
export const deltetodo = createAsyncThunk(
    'deltetodo',
    async (id) => {
        const result = await fetch3point0(`/deletetodo/${id}`, 'delete')

        return result
    }
)

const todoReducer =  createSlice({
    name: 'todo',
    initialState,
    reducer:{

    },
    extraReducers: {
        [createtodo.fulfilled]: (state, { payload: { message }}) => {
            if ( message )
                state.push(message)
        },
        [fetchtodos.fulfilled]: (state, { payload: {message }}) => {
            // CHANGE THE WHOLE STATE by 'return'   
            return message
        },
        [deltetodo.fulfilled]:(state, { payload: {message }}) => {
            const filterTodos = state.filter( item => item._id !== message._id)

            //CHANGE THE WHOLE STATE by 'return'
            return filterTodos
        }
    }
})


export default todoReducer.reducer