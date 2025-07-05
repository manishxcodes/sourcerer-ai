"use client"

import { searchQueryData, searchResponseArray } from "@/app/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { LucideImages, LucideList, LucideSparkles } from "lucide-react";
import AnswerPage from "./answer-page";
import ImagesPage from "./images-page";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchResults } from "../../context/searchResultContext";
import { supabase } from "@/app/services/supabase";
import { LinksPage } from "./links-page";
import { LoadingScreen } from "./Loader";

interface DisplayResultProps {
    searchQueryData?: searchQueryData,
}

export function DisplayResult({searchQueryData}: DisplayResultProps) {
    const [activeTab, setActiveTab] = useState<tabType>("Answer");
    const hasSearchedRef = useRef(false);
    const {setSearchResults, setIsLoading, isLoading} = useSearchResults();
    const [aiMarkdownResponse, setAiMarkdownResponse] = useState();

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
            console.log("chat: ", result.data.chatId)
            console.log("reslt: ",result.data);
            console.log("airspon", result.data.ai_response);
            // storing results data in context
            setSearchResults({searchResults: result.data.data});

            if(result.data.ai_response)  {
                setAiMarkdownResponse(result.data.ai_response);
            } else {
                // pass to llm
                await generateAiResponse(result.data.data, result.data.chatData)
            }



        } catch(err) {
            console.log("error while getting serch result", {details: err});
        } finally {
            setIsLoading(false);
        }   
    }

    const generateAiResponse = async(formattedSearchResult: searchResponseArray, chatId: string) => {
        const result = await axios.post('/api/llm-model', {
            searchInput: searchQueryData?.searchInput,
            searchResult: formattedSearchResult,
            chatId: chatId 
        })

        const runId = result.data;

        const interval = setInterval(async ()=> {
            const runResponse = await axios.post('/api/get-inngest-status',{runId: runId});
            console.log(runResponse.data);

            if(runResponse?.data?.data?.[0]?.status === "Completed"
) {
                clearInterval(interval);
                console.log("completed");

            // get updated data from db
                const {data: aiResponseMarkdown, error: fetchError} = await supabase
                .from("Chats")
                .select("ai_response")
                .eq('id', chatId);

                if(fetchError) {
                    console.log('something went wrong', {details: fetchError});
                    // taosst error
                }

                setAiMarkdownResponse(aiResponseMarkdown?.[0].ai_response)
            }
        }, 1000)


    }

    if(isLoading) {
        return (
            <LoadingScreen />
        )
    }

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
                    <AnswerPage value={aiMarkdownResponse}/>
                </TabsContent>
                <TabsContent value="Images">
                    <ImagesPage />
                </TabsContent>
                <TabsContent value="Source">
                    <LinksPage />
                </TabsContent>
            </Tabs>
        </div>
    )
}

type tabType = "Answer" | "Images" | "Source";

const tabs: Array<{label: tabType, icon: typeof LucideSparkles}> = [
    {label: "Answer", icon: LucideSparkles},
    {label: "Images", icon: LucideImages},
    {label: "Source", icon: LucideList},
]
