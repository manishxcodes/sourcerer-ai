'use client'

import { useEffect, useState } from "react"
import { supabase } from "../services/supabase";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "../context/userContext";

export default function Library() {
    const [previousChat, setPreviousChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false)
    const { userDetail } = useUserContext();
    const emailAddress = userDetail?.email;
    useEffect(() => {
        if(emailAddress) {
            getPrevChats();
        }
        
    }, []);

    const getPrevChats = async () => {
        try {
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
                return (
                    <div className="w-full flex items-center justify-center h-full">
                        <h2>Something went wrong try again</h2>
                    </div>
                )
            }

            if(chat.length === 0) {
                return (
                    <div className="w-full flex items-center justify-center h-full">
                        <h2>No chat records</h2>
                    </div>
                )
            }
        } catch(err) {
            console.log("something went wrong. try again");
        } finally {
            setLoading(false);
        }

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
                            <div key={index} className=" cursor-pointer flex justify-between mb-2">
                                <p className="hover:underline">{chat.searchInput}</p>  
                                <p className="text-muted text-sm">{`${datePart}, ${timePart}`}</p>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
    )

}