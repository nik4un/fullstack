import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Question } from '../../interfaces';

@Injectable({
  'providedIn': 'root'
}) export class ConfirmService {

  private subject = new Subject<any>();

  constructor() { }

  confirmThis(question: Question, yesFn: () => void, noFn: () => void) {
    this.subject.next(
      {question: question,
        yesFn: () => yesFn(),
        noFn: () => noFn()
      });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
