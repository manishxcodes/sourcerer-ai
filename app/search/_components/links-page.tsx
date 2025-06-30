'use client'

import { useSearchResults } from "@/app/context/searchResultContext"

export function LinksPage() {
    const { searchResults, isLoading} = useSearchResults();

    if(!searchResults?.searchResults) {
        return (
            <div className="w-full h-full">
                loading.. 
            </div>
        )
    }

    console.log(searchResults);

    return (
        <div className="w-full h-full flex-col flex gap-y-2 tracking-wide ">
            {
                searchResults.searchResults.map((result, index) => {
                    const imageUrl = result.cseImage || result.ogImage || '';
                    return (
                        <div key={index} className="px-2 py-2 rounded-md flex  group hover:scale-102 transition-all cursor-pointer hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                            <a className="flex gap-x-4 " href={result.link} target="blank">
                                <div className="flex-1/12 object-cover items-center">
                                    {
                                        imageUrl 
                                        ? <img src={imageUrl} className="object-cover" alt="" />
                                        : <div></div>
                                    }
                                </div>
                                <div className="flex-11/12 gap-y-2">
                                    <p className="text-[10px] text-neutral-500 hover:underline">{result.displayLink}</p>
                                    <p className="text-[12px]">{result.snippet}</p>
                                </div>
                            </a>
                        </div>
                    )
                })
            }
        </div>
    )

}