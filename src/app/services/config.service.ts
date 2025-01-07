import { Injectable } from '@angular/core';
import { DataSource } from '../enums/data-source.enum';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configChangedSubject = new Subject<void>();

  private _source: DataSource = DataSource.JSON_SERVER;
  public get source(): DataSource {
    return this._source;
  }
  public set source(value: DataSource) {
    this._source = value;
    this.configChangedSubject.next();
  }

  private _doctorId: string = '1';
  public get doctorId(): string {
    return this._doctorId;
  }
  public set doctorId(value: string) {
    this._doctorId = value;
    this.configChangedSubject.next();
  }

  subscribeForChange(): Subject<void> {
    return this.configChangedSubject;
  }
}
