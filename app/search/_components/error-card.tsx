import { Button } from "@/components/ui/button";
import {  Plus } from "lucide-react";
import Link from "next/link";

export function ErrorCard () {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center ">
            <div className="flex items-center justify-center flex-col gap-y-6 border border-neutral-500 rounded-md p-6">
                <p className="text-center">No result. Try again</p>
                <div>
                    <Link href={'/'} >
                        <Button className=" flex items-center justify-center "> 
                            new chat
                            <Plus />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}