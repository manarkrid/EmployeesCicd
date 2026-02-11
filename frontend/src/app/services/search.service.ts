import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private searchSource = new BehaviorSubject<string>('');
    currentSearch = this.searchSource.asObservable();

    constructor() { }

    changeSearch(searchTerm: string) {
        this.searchSource.next(searchTerm);
    }
}
