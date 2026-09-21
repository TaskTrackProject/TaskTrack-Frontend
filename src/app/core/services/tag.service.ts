import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Tag, TagRequest } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tags`;

  getAll(): Observable<Tag[]> {
    return this.http
      .get<Tag[]>(this.apiUrl)
      .pipe(map((tags) => tags.map((tag) => this.toTag(tag))));
  }

  create(request: TagRequest): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, request).pipe(map((tag) => this.toTag(tag)));
  }

  update(id: number, request: TagRequest): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, request).pipe(map((tag) => this.toTag(tag)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toTag(tag: Tag): Tag {
    const response = tag as Tag & { tagId?: number };
    return { ...tag, tagID: response.tagID ?? response.tagId! };
  }
}
