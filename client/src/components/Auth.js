import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signinUser, signupUser } from '../reducers/authReducer'
function Auth() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [auth, setauth] = useState('signin')


    const dispatch = useDispatch()
    
    //destructuring the state
    const {error, loading} = useSelector(state => state.user)
    
    //signup and signin process
    const authenticate = (auth) => {
        console.log(auth);
        if(auth === 'signin'){
            dispatch(signinUser({email, password}))
        }else{
            dispatch(signupUser({email, password}))
        }
    }
    console.log(error);
    return (
        <div className="container">
            <h2>Please {auth}</h2>
            <p>{error && error}</p>
            <input type="email" placeholder="Enter email..." value={email} onChange={(e) => setemail(e.target.value)} />
            
            <input type="password" placeholder="Enter password..." value={password} onChange={(e) => setpassword(e.target.value)} />

            {
                auth === 'signin' ? 
                <h6 style={{cursor: 'pointer'}} onClick={() => setauth('signup')}>Don't have an accout?</h6>
                :
                <h6 style={{cursor: 'pointer'}} onClick={() => setauth('signin')}>Already have an accout?</h6>
            }

            <button onClick={() => authenticate(auth) } className='btn'>{auth}</button>

            {loading && (
                <div class="progress">
                    <div class="indeterminate"></div>
                </div>
            )}
        </div>
    )
}

export default Auth
