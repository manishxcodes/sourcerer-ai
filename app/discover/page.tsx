'use client'

import axios from "axios"
import { useEffect, useState } from "react";
import { searchResponseArray } from "../types/database.types";

export default function DiscoverPage() {
    const [news, setNews] = useState<searchResponseArray>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNews();
    }, [])

    const getNews = async() => {
        try {
            setLoading(true);
            const result = await axios.get('/api/search');
            console.log(result.data)
            setNews(result.data)
        } catch(err) {
            console.log("erro news", {details: err});
        } finally {
            setLoading(false)
        }
    }

    if(loading) {
        console.log("isiloaidng ans page")
        return (
            <div>
                Loaidng ans
            </div>
        )
    }

    if(!news) {
        return (
            <div>
                Somethhing went wrong. try again/refresh
            </div>
        )  
    }


    return (
        <div className="w-full h-full flex-col max-w-4xl">
            <div className="px-12 py-6">
                <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Discover
                </h3>
                <div className="mt-2">
                    {
                        news && news.map((news, index) => {
                            const imageUrl = news.cseImage || news.ogImage || '';
                            return (
                                <div key={index} className="px-2 py-2 rounded-md flex  group hover:scale-102 transition-all cursor-pointer shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] mt-2">
                                    <a className="flex gap-x-4 " href={news.link} target="blank">
                                        <div className="flex-1/12  items-center w-full h-full ">
                                            {
                                                imageUrl 
                                                ? <img src={imageUrl} className="w-full h-full object-contain" alt="" />
                                                : <div></div>
                                            }
                                        </div>
                                        <div className="flex-11/12 gap-y-2">
                                            <p className="text-[10px] text-neutral-500 hover:underline">{news.displayLink}</p>
                                            <p className="text-[12px]">{news.snippet}</p>
                                        </div>
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}