import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { createtodo, deltetodo, fetchtodos } from '../reducers/todoReducer';

function Todo() {
    //dispatch add todo to server
    const dispatch = useDispatch()

    //SET THE INPUT
    const [value, setvalue] = useState(' ')
    
    //get todos from state
    const todos = useSelector(state => state.todos)
    
    //WHEN ADD TODO BUTTON FIRED
    const addTodo = () => {
        dispatch(createtodo({todo: value}))
    }

    //Fetch Ones
    useEffect(() => {
        dispatch(fetchtodos())
    }, [dispatch])
    
    return (
        <div>
            <input type="text" placeholder='Enter todo...' value={value} onChange={(e) => setvalue(e.target.value)}/>
            <button  className='btn' onClick={addTodo}>Add todo</button>

            {/* Display todos */}
            <ul className="collection">
                {todos.map((individualtodo) => 
                    <li style={{ cursor: 'pointer' }} className="collection-item" key={individualtodo._id}
                    onClick={() => dispatch( deltetodo(individualtodo._id))}
                    >
                        {individualtodo.todo}
                    </li>
                )}
                
            </ul>

            <button className='btn'  onClick={() => { dispatch(logout()) }}>Logout</button>
            
        </div>
    )
}

export default Todo
