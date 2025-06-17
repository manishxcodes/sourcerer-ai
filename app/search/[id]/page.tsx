'use client'

import { supabase } from "@/app/services/supabase";
import { searchQueryData } from "@/app/types/database.types";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { DisplayResult } from "../_components/display-result";
import { Loader } from "lucide-react";

export default function SearchResultPage() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [searchQueryData, setSearchQueryData] = useState<searchQueryData>();
    console.log(id);
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

    if(loading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Loader className="animate-spin" />
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Loading...</h3>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex pr-6">
            <DisplayResult searchQueryData={searchQueryData} />
        </div>
    )
}