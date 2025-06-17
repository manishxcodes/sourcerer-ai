"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Atom, Cpu, SearchCheck, SendHorizonal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { AIModelsOption } from "../services/shared"
import { useState } from "react"
import { supabase } from "../services/supabase"
import { useUserContext } from "../context/userContext"
import { useRouter } from "next/navigation"

export function ChatBox() {
    const [userInput, setUserInput] = useState("");
    const [searchType, setSearchType] = useState<"search" | "research">("search");
    const [loading, setLoading] = useState(false);
    const { userDetail } = useUserContext();
    const router = useRouter();
    let id: string;
    
    const onSearch = async () => {
        console.log(userInput, searchType, userDetail?.email);
        try {
            setLoading(true);
            id = crypto.randomUUID();
            const {data, error: insertError} = await supabase.from("Library").insert([{
                id: id,
                searchInput: userInput,
                type: searchType,
                userEmail: userDetail?.email
            }]).select();

            if(insertError) {
                console.log("error while saving search input: ", {details: insertError});
            }

            console.log("result: ", data);
        } catch(err) {
            console.log("something went wrong", {details: err});
            return;
        } finally {
            setLoading(false);
            console.log("searchId: ", id);
            router.push('/search/' + id);
        }
    }

    return (
        <div className="w-full px-16 md:px-16 lg:px-48">
            <div className="w-full border border-muted p-2  rounded-lg">
            <Tabs defaultValue="search" className="w-full">
                <div className="h-8">
                    <TabsContent value="search">
                        <input className="w-full rounded-md placeholder-gray-400 outline-none" type="text" placeholder="Ask anything..."
                        onChange={(e) => {setUserInput(e.target.value)}} />
                    </TabsContent>
                    <TabsContent value="research">
                        <input className="w-full rounded-md placeholder-gray-400 outline-none" type="text" placeholder="Research anything..."
                        onChange={(e) => {setUserInput(e.target.value)}} />
                    </TabsContent>
                </div>
                <div className="flex justify-between pt-8">
                    <div>
                        <TabsList className="bg-gray-100 ">
                            <TabsTrigger className="text-accent" value="search"
                                onClick={(e) => {setSearchType("search")}}> 
                                <SearchCheck />Search
                            </TabsTrigger>
                            <TabsTrigger className="text-accent" value="research"
                                onClick={(e) => {setSearchType("research")}}>
                                <Atom />Research 
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex justify-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-accent-foreground hover:text-primary hover:scale-105 transtion-all duration-100 pr-2" >
                                <Cpu height={20} width={20} className="text-neutral-500"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className="px-4">Choose Model</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {
                                    AIModelsOption.map((model) => (
                                        <DropdownMenuItem key={model.id} className="w-full  hover:bg-primary/10 rounded-xs cursor-pointer px-4 py-2">
                                            <h2 className="text-sm font-semibold">{model.name}</h2>
                                            <p className="text-xs">{model.description}</p>
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={onSearch} disabled={loading}>
                            <SendHorizonal/>
                        </Button>
                    </div>
                </div>
            </Tabs>
            </div>
        </div>
    )
}
