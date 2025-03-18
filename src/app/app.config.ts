import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-15c98',
        appId: '1:139234515109:web:5a78c0fe67df2837a7954c',
        storageBucket: 'ring-of-fire-15c98.firebasestorage.app',
        apiKey: 'AIzaSyAfYtB09_s-rlepT00m3BFDfxrH33fWTQk',
        authDomain: 'ring-of-fire-15c98.firebaseapp.com',
        messagingSenderId: '139234515109',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
