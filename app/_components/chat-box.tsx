import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Cpu, SendHorizonal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { AIModelsOption } from "../services/shared"

export function ChatBox() {
    return (
        <div className="w-full px-16 md:px-16 lg:px-48">
            <div className="w-full border border-muted p-2  rounded-lg">
            <Tabs defaultValue="search" className="w-full">
                <div>
                    <TabsContent value="search">
                        <input className="w-full rounded-md placeholder-gray-400 outline-none h-8" type="text" placeholder="Ask anything..." />
                    </TabsContent>
                </div>
                <div className="flex justify-between pt-8">
                    <div>
                        <TabsContent value="research"><input className="w-full rounded-md placeholder-gray-400 outline-none h-8" type="text" placeholder="Research anything..." /></TabsContent>
                        <TabsList className="bg-gray-100 ">
                            <TabsTrigger className="text-accent" value="search">Search</TabsTrigger>
                            <TabsTrigger className="text-accent" value="research">Research</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex gap-x-2">
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
                        <Button>
                            <SendHorizonal />
                        </Button>
                    </div>
                </div>
            </Tabs>
            </div>
        </div>
    )
}
