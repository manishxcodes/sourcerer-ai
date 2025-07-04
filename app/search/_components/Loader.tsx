import { Loader } from "lucide-react";

export function LoadingScreen () {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <Loader className="animate-spin" />
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Searching...</h4>
        </div>
    )
}