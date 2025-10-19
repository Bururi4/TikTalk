import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { DataInterface } from '../interfaces/data.interface';

@Injectable({
   providedIn: 'root',
})
export class DataService {
   #apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
   #http = inject(HttpClient);
   #TOKEN = 'eee3af3a1f791165399a68e603a58ee549d3370b';

   getSuggestion(query: string) {
      return this.#http.post<{ suggestions: DataInterface[] }>(
            this.#apiUrl,
            { query },
            {
               headers: {
                  Authorization: `Token ${this.#TOKEN}`,
               },
            }
         )
         .pipe(
            map((res) => {
               return Array.from(
                  new Set(
                     res.suggestions.map((suggestion: DataInterface) => {
                        return suggestion.data.city;
                     })
                  )
               );
            })
         );
   }
}
