import { ArrowUpRight } from "lucide-react";
import { useSearchResults } from "../../context/searchResultContext";
import { LoadingScreen } from "./Loader";
import { ErrorCard } from "./error-card";

export default function ImagesPage() {
    const { searchResults, isLoading} = useSearchResults();

    if(isLoading) {
        //console.log("isiloaidng ans page")
        return (
            <LoadingScreen />
        )
    }

    if(!searchResults?.searchResults && isLoading) {
        //console.log("no asnwer anserpg")
        return (
            <ErrorCard />
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-6">
            {
                searchResults && searchResults.searchResults.map((result, index) => {
                    const imageUrl = result.ogImage || result.cseImage || "";
                    if(!imageUrl) return null;

                    return (
                            <div key={index} className="w-full h-64 overflow-hidden rounded-lg shadow-sm group relative">
                                <a href={result.link} target="blank">
                                <img
                                src={imageUrl}
                                alt={result.title || "Image result"} 
                                className=" object-contain w-full h-full"
                                loading="lazy"
                                />
                                <p className="absolute bottom-0 flex items-center left-0 px-2 py-4 bg-neutral-50 w-full text-black text-sm opacity-0 hover:underline  group-hover:opacity-100 transition-opacity duration-100">{result.displayLink}<ArrowUpRight height={10} width={10} /></p>
                                </a>
                            </div>
                        
                    );
                })
            }
        </div>
    )
}