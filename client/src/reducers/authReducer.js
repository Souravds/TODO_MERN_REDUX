import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

//initial user state 
const initialState = {
    token: '',
    loading: false,
    error: ''
}

//fetch function to fetch the server response
const fetch2point0 = async (api, body, token='') => {
    const res = await fetch(api,{
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    return await res.json()
} 

//signup action creator
export const signupUser = createAsyncThunk(
    'signupuser',
    async (body) => {
        const result = await fetch2point0('/signup', body)
        return result
    }   
)

//reducer function to check what should change into ""user"" state
const authReducer = createSlice({
    name: 'user',
    initialState,
    reducers:{
    },
    //asyncthunk function should be here
    extraReducers:{
        //OR action destructuring like -> {payload: {error, message}}
        [signupUser.pending]: (state, action) => {
            state.loading = true     
        },
        [signupUser.fulfilled]: (state, action) => {
            state.loading = false
            if (action.payload.error) {
                state.error = action.payload.error
            }else{
                state.error = action.payload.message
            }
        },
        // [signinUser.fulfilled]: () => {

        // }
    }

})


export default authReducer.reducer
