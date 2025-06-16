"use client"

import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "./services/supabase"
import { userData } from "./types/database.types";
import { userContext } from "./context/userContext";

export default function Provider({ children }: {children: React.ReactNode}) {
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [userDetail, setUserDetail] = useState<userData>();

    const createUser = useCallback(async() => {
        if(!user?.primaryEmailAddress?.emailAddress) {
            return;
        }

        setIsLoading(true);

        try {
            const { data: existingUser, error: err} = await supabase
            .from("Users")
            .select("*")
            .eq('email', user.primaryEmailAddress.emailAddress);

            if(err) {
                console.error("Error while checking for existing user", {details: err});
                return;
            }

            console.log("user: ", user);
            console.log("supabase-user: ", existingUser);

            // if user doesnot exist
            if(existingUser?.length === 0) {
                const {data, error: insertError} = await supabase
                .from("Users")
                .insert([{
                    name: user.fullName,
                    email: user.primaryEmailAddress.emailAddress
                }])
                .select();

                if(insertError) {
                    console.error("Error while saving user data", {detials: insertError});
                    return;
                }

                console.log("user created", data);
                setUserDetail(data[0]);
            }
            setUserDetail(existingUser[0]);

        } catch(err) {
            console.error("something went wrong", {details: err});
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if(isLoaded && user && !isLoading) {
            createUser();
        }
    }, [isLoaded, user])


    return (
        <userContext.Provider value={{userDetail, setUserDetail}}>
            <div className="w-full">
                {children}
            </div>
        </userContext.Provider>
    )
}