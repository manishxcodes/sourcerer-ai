"use client"

import { createContext, ReactNode, useContext, useState } from "react";
import { searchResponseArray } from "../types/database.types"

interface searchResultData {
    searchResults: searchResponseArray;
}

interface SearchResultContextType {
    searchResults: searchResultData | null;
    setSearchResults: (data: searchResultData) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const SearchResultsContext = createContext<SearchResultContextType | undefined>(undefined);

export function SearchResultsProvider({ children }: {children: ReactNode}) {
    const [searchResults, setSearchResults] = useState<searchResultData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <SearchResultsContext.Provider value={{
            searchResults,
            setSearchResults,
            isLoading,
            setIsLoading
        }}>
            {children}
        </SearchResultsContext.Provider>
    )
}

// hook

export function useSearchResults() {
    const context = useContext(SearchResultsContext);
    
    if(context === undefined) {
        throw new Error("useSeachResutls must be used within the provider");
    }

    return context;
}
