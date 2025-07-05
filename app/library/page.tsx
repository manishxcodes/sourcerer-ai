'use client'

import { useEffect, useState } from "react"
import { supabase } from "../services/supabase";
import { useUserContext } from "../context/userContext";
import { PostgrestError } from "@supabase/supabase-js";

export default function Library() {
    const [previousChat, setPreviousChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<PostgrestError>();
    const { userDetail } = useUserContext();
    const emailAddress = userDetail?.email;

    useEffect(() => {
        if(emailAddress) {
            console.log("go email")
            getPrevChats();
        }
        
    }, [emailAddress]);

    const getPrevChats = async () => {
        try {
            setLoading(true);
            const {data: chat, error: chatError} = await supabase
            .from('Library')
            .select('*')
            .eq('userEmail', emailAddress)

            if(chat) {
                console.log("chat: ", chat);
                setPreviousChat(chat);
            }


            if(chatError) {
                console.log("chat error");
                setError(chatError);
            }

        } catch(err) {
            console.log("something went wrong. try again");
        } finally {
            setLoading(false);
        }

    }

        if(loading) {
            return (
                <div>
                    loading
                </div>
            )
        }

        if(error) {
            return (
                <div className="w-full flex items-center justify-center h-full">
                    <h2>Something went wrong try again</h2>
                </div>
            )
        }

        if(previousChat.length === 0 && !loading) {
            return (
                <div className="w-full flex items-center justify-center h-full">
                    <h2>No chat records</h2>
                </div>
            )
        }

    return (
        <div className="w-full h-full">
            <div className="px-12 py-6">
                <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Previous Chats</h3>
                <div className="mt-4">
                {
                    previousChat.map((chat, index) => {
                        const date = new Date(chat.created_at);
                        const datePart = date.toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        });
                        const timePart = date.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <a key={index}  href={`/search/${chat.id}`}>
                            <div className=" cursor-pointer flex items-center mb-2 gap-x-4">
                                <p className="hover:underline">{chat.searchInput}</p>  
                                <p className="text-neutral-500 text-[12px]">{`${datePart}, ${timePart}`}</p>
                            </div>
                            </a>
                        )
                    })
                }
                </div>
            </div>
        </div>
    )

}