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

//signin action creator
export const signinUser = createAsyncThunk(
    'signinuser',
    async (body) => {
        const result = await fetch2point0('/signin', body)
        return result
    }
)

//reducer function to check what should change into ""user"" state
const authReducer = createSlice({
    name: 'user',
    initialState,
    //reducers are usually set of actions
    reducers:{
        //token fetch from localstorage
        addToken: (state, action) => {
            state.token = localStorage.getItem('token')
        }
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
                state.token = action.payload.token
            }
        },
        [signinUser.pending]: (state, action) => {
            state.loading = true
        },
        [signinUser.fulfilled]: (state, {payload:{error, token}}) => {
            state.loading = false
            if (error) {
                state.error = error
            } else {
                state.token = token
                //token set to localstorage
                localStorage.setItem('token', token)
            }
        },
        [signinUser.rejected]: (state, action) => {
            state.loading = false
            state.error = 'Try Again Please...'
        }
    }

})

export const { addToken } = authReducer.actions
export default authReducer.reducer
