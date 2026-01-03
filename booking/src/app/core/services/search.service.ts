import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { SearchRequest, SearchResult } from '../../shared/models/search.model';
import { PagedResult } from '../../shared/models/paged.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private readonly baseUrl = ApiConfig.searchService;

    constructor(private http: HttpClient) { }

    search(request: SearchRequest): Observable<PagedResult<SearchResult>> {
        return this.http.post<PagedResult<SearchResult>>(`${this.baseUrl}/search`, request);
    }
}
