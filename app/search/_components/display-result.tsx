"use client"

import { searchQueryData } from "@/app/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { LucideImages, LucideList, LucideSparkles, LucideVideo } from "lucide-react";
import AnswerPage from "./answer-page";
import ImagesPage from "./images-page";
import { useState } from "react";

interface DisplayResultProps {
    searchQueryData?: searchQueryData
}

export function DisplayResult({searchQueryData}: DisplayResultProps) {
    const [activeTab, setActiveTab] = useState<tabType>("Answer")

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

// <script async src="https://cse.google.com/cse.js?cx=2232bf0465c634983">
// </script>
// <div class="gcse-search"></div>

//AIzaSyAFW329Y3KAj1lWafmAovVjf62EaC3mjkk