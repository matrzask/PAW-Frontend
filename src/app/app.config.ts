import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { apiKey } from './local.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'paw-projekt-aaea9',
        appId: '1:835096115182:web:e35ee55b798f8d834d40ff',
        storageBucket: 'paw-projekt-aaea9.firebasestorage.app',
        apiKey: apiKey,
        authDomain: 'paw-projekt-aaea9.firebaseapp.com',
        messagingSenderId: '835096115182',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
