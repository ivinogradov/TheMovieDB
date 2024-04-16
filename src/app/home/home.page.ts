import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonItem, IonList, IonAvatar, IonSkeletonText, IonAlert, IonImg, IonLabel } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { MovieResult } from '../services/interfaces';
import { catchError, finalize } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonImg, IonAlert, IonSkeletonText, IonAvatar, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, DatePipe],
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public dummyArray = new Array(5);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }
    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        console.log(err);
        this.error = err.error.status_message;
        return [];
      })
    ).subscribe({
      next: (result) => {
        console.log(result);
        this.movies.push(...result.results);

        if (event) {
          event.target.disabled = result.total_pages === this.currentPage;
        }
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) { }
}
