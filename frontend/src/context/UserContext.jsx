import { useState } from "react";
import { createContext } from "react";


export const UserContext = createContext();

const UserProvider = ({ children})=>{
    const [user ,setUser] = useState(null);

    //function to update data
    const updateUser = (userData)=>{
        setUser(userData)
    };

    //Function to clear user(e.g logout)
    const clearUser = ()=>{
        setUser(null)
    }
    const value = {
        user,
            updateUser,
            clearUser
    }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;