import { apiUrl } from "../environment";
import type {SearchFilters} from "../components/searchBar.tsx";
import type {Conversation, Speaker, UtteranceDTO} from "./apiTypes.ts";

export async function getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${apiUrl}/conversations`);

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}

export async function getSpeakers(): Promise<Speaker[]> {
    const response = await fetch(`${apiUrl}/speakers`);

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}

export async function fullTextSearch(filters: SearchFilters): Promise<UtteranceDTO[]> {
    const urlParams = new URLSearchParams({ query: filters.query });

    if (filters.startDate !== "") {
        urlParams.append('start_date', filters.startDate);
    }

    if (filters.endDate !== "") {
        urlParams.append('end_date', filters.endDate);
    }

    if (filters.speakerId !== "") {
        urlParams.append('speaker_id', filters.speakerId);
    }

    if (filters.conversationId !== "") {
        urlParams.append('conversation_id', filters.conversationId);
    }

    let searchType = ""
    if (filters.searchType === 'hybrid-search') {
        searchType = 'hybrid-search';
    } else if (filters.searchType === 'full-text-search') {
        searchType = 'full-text';
    } else if (filters.searchType === 'semantic-search') {
        searchType = 'similarity-search';
    }

    const response = await fetch(`${apiUrl}/conversations/${searchType}?${urlParams.toString()}`);
    
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    
    return response.json();
}