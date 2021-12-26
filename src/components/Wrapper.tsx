import React from 'react';
import "../App.css";

const Wrapper = ({children}:JSX.ElementChildrenAttribute) => {
    return (
        <div className='wrapper_container'>
            {children}
        </div>
    )
}

export default Wrapper;