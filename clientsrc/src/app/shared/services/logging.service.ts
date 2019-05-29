import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { LogEntry } from '../base-model/logging.model';

@Injectable({ providedIn: 'root' })
export class LoggingService extends ServiceBase {
    add(logEntry: LogEntry): Observable<LogEntry> {
        return this.post(`${environment.loggingApiUrl}/api/logs`, logEntry);
      }
}
