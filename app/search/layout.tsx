import { SearchResultsProvider } from "../context/searchResultContext";

export default function SeachLayout({ children }: {children: React.ReactNode}) {
    return (
        <SearchResultsProvider>
            {children}
        </SearchResultsProvider>
    )
}