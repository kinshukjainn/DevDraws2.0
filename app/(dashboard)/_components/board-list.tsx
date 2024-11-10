"use client"

import EmptyBoards from "./empty-boards";
import EmptyFavourite from "./empty-favourites";
import EmptySearch from "./empty-search";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favourites?: string;

    }
}

const BoardList = ({
    orgId,
    query
}: BoardListProps) => {

    // TODO: Change to API Call
    const data = []

    // User searched for something that doesnot exist
    if (!data.length && query.search) {
        return (
            <EmptySearch />
        )
    }

    if (!data.length && query.favourites) {
        return (
            <EmptyFavourite />
        )
    }

    if (!data.length) {
        return (
            <EmptyBoards />
        )
    }

    return (
        <div>
            {JSON.stringify(query)}
        </div>
    )
}

export default BoardList