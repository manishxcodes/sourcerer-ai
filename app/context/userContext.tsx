import React, { createContext } from "react";
import { userData } from "../types/database.types";

type userContextType = {
    userDetail?: userData,
    setUserDetail: React.Dispatch<React.SetStateAction<userData | undefined>>
}

export const userContext = createContext<userContextType>({
    userDetail: undefined,
    setUserDetail: () => {}
});