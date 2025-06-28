"use client"

import { searchQueryData, searchResponseArray } from "@/app/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Loader, LucideImages, LucideList, LucideSparkles, LucideVideo } from "lucide-react";
import AnswerPage from "./answer-page";
import ImagesPage from "./images-page";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchResults } from "../../context/searchResultContext";

interface DisplayResultProps {
    searchQueryData?: searchQueryData,
}

export function DisplayResult({searchQueryData}: DisplayResultProps) {
    const [activeTab, setActiveTab] = useState<tabType>("Answer");
    const hasSearchedRef = useRef(false);
    const [searchResult, setSearchResult] = useState<searchResponseArray>([]);
    const {setSearchResults, setIsLoading, isLoading} = useSearchResults();

    useEffect(() => {
        if(searchQueryData && !hasSearchedRef.current) {
            hasSearchedRef.current = true;
            getSearchResult();
        }
        
    }, [searchQueryData])
    const getSearchResult = async() => {
        console.log("called")
        console.log("searchInput",searchQueryData?.searchInput)
        try {
            setIsLoading(true);
            console.log('dispaly is loading, context')
            const result = await axios.post('/api/search', {
                searchInput: searchQueryData?.searchInput, 
                searchType: searchQueryData?.type,
                library_id: searchQueryData?.id
            });
            setSearchResult(result.data);
            console.log(result.data);
            // storing results data in context
            setSearchResults({searchResults: result.data.data});

        } catch(err) {
            console.log("error while getting serch result", {details: err});
        } finally {
            setIsLoading(false);
        }
        
    }

    // if(isLoading) {
    //     return (
    //         <div className="w-full h-screen flex flex-col justify-center items-center">
    //             <Loader className="animate-spin" />
    //             <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Searching...</h4>
    //         </div>
    //     )
    // }

    return (
        <div className="w-full pt-16 px-8">
            <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">
                {searchQueryData?.searchInput}
            </h2>

            <Tabs defaultValue="Answer" className="w-full">
                <TabsList className="flex gap-x-4 border-b pb-2">
                    {tabs.map(({label, icon: Icon}) => (
                        <TabsTrigger key={label} value={label} 
                            className={`flex items-center gap-x-1 cursor-pointer hover:text-accent ${(activeTab === label) ? 'text-primary font-semibold ' : ''}`}
                            onClick={() => (setActiveTab(label))}>
                            <Icon height={10} width={10} className="mt-0.5"/>
                            <span className="text-sm font-mono leading-none">{label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="Answer">
                    <AnswerPage />
                </TabsContent>
                <TabsContent value="Images">
                    <ImagesPage />
                </TabsContent>
                <TabsContent value="Videos">

                </TabsContent>
                <TabsContent value="Source">

                </TabsContent>
            </Tabs>
        </div>
    )
}

type tabType = "Answer" | "Images" | "Videos" | "Source";

const tabs: Array<{label: tabType, icon: typeof LucideSparkles}> = [
    {label: "Answer", icon: LucideSparkles},
    {label: "Images", icon: LucideImages},
    {label: "Videos", icon: LucideVideo},
    {label: "Source", icon: LucideList},
]

// <script async src="https://cse.google.com/cse.js?cx=">
// </script>
// <div class="gcse-search"></div>

//