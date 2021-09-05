import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Auth from './components/Auth';
import Todo from './components/Todo';
import { addToken } from './reducers/authReducer';



function App() {
  const {token} = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addToken())
  }, [ dispatch ])
  
  return (
    <div className="App">
      {token ? <Todo /> : <Auth /> }
    </div>
  );
}

export default App;
