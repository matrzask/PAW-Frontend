import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataSource } from '../enums/data-source.enum';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configChangedSubject = new Subject<void>();

  constructor() {
    this.loadSettings();
  }

  private _source: DataSource = DataSource.SERVER;
  public get source(): DataSource {
    return this._source;
  }
  public set source(value: DataSource) {
    this._source = value;
    this.saveSettings();
    this.configChangedSubject.next();
  }

  private _doctorId: string = '';
  public get doctorId(): string {
    return this._doctorId;
  }
  public set doctorId(value: string) {
    this._doctorId = value;
    this.saveSettings();
    this.configChangedSubject.next();
  }

  private saveSettings() {
    localStorage.setItem(
      'configService',
      JSON.stringify({
        source: this._source,
        doctorId: this._doctorId,
      })
    );
  }

  private loadSettings() {
    const settings = localStorage.getItem('configService');
    if (settings) {
      const { source, doctorId } = JSON.parse(settings);
      this._source = source;
      this._doctorId = doctorId;
    }
  }

  subscribeForChange(): Subject<void> {
    return this.configChangedSubject;
  }
}
