import { createContext, useState } from "react";

export const AppConText = createContext();

export const AppConTextProvider = (props) =>{

    const {children} = props;
    const [isLogin, setisLogin] = useState(false);
    const [inforUser, setinforUser] = useState({});
    return(
        <AppConText.Provider value={{isLogin, setisLogin, inforUser, setinforUser}}>
            {children}
        </AppConText.Provider>
    )

}