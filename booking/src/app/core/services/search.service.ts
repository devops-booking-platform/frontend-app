import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { SearchRequest, SearchResult } from '../../shared/models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private readonly baseUrl = ApiConfig.searchService;

    constructor(private http: HttpClient) { }

    search(request: SearchRequest): Observable<SearchResult[]> {
        return this.http.post<SearchResult[]>(`${this.baseUrl}/search`, request);
    }
}
