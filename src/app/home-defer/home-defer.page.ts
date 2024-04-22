import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonItem, IonList, IonAvatar, IonSkeletonText, IonAlert, IonImg, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { MovieResult } from '../services/interfaces';
import { catchError, delay, finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home-defer.page.html',
  styleUrls: ['home-defer.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonBadge, IonLabel, IonImg, IonAlert, IonSkeletonText, IonAvatar, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, RouterModule, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class HomeDeferPage {
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

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
   }
}
