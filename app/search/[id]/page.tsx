'use client'

import { supabase } from "@/app/services/supabase";
import { searchQueryData } from "@/app/types/database.types";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { DisplayResult } from "../_components/display-result";
import { Loader, Search } from "lucide-react";
import { SearchResultsProvider, useSearchResults } from "@/app/context/searchResultContext";
import { PostgrestError } from "@supabase/supabase-js";
import { ErrorCard } from "../_components/error-card";

export default function SearchResultPage() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [searchQueryData, setSearchQueryData] = useState<searchQueryData>();
    const [error, setError] = useState<PostgrestError>()
    
    useEffect(() => {
        getSearchQueryData();
    }, [])

    const getSearchQueryData = async () => {
        try {
            setLoading(true);
            let {data: searchQuery, error: selectError} = await supabase
                .from('Library')
                .select('*')
                .eq('id', id);

            if(selectError) {
                console.log("Error while fetching searchQuery", {details: selectError});
                setError(selectError);
            }

            if(searchQuery && searchQuery?.length > 0) {
                console.log("searchQuery: ",searchQuery[0])
                setSearchQueryData(searchQuery[0]);
            }
        } catch(err) {
            console.error("Something went wrong", {details: err});
        } finally {
            setLoading(false);
        }
    }

    if(error) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ErrorCard />
            </div>
        )
    }

    return (
        <SearchResultsProvider>
            <div className="w-full h-screen flex pr-6">
                <DisplayResult searchQueryData={searchQueryData} />
            </div>
        </SearchResultsProvider>
    )
}