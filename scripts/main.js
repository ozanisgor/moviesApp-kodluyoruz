import data from "./data.js";
import { searchMovieByTitle, makeBgActive } from "./helpers.js";

class MoviesApp {
  constructor(options) {
    const {
      root,
      searchInput,
      searchForm,
      yearHandler,
      yearSubmitter,
      genreSubmitter,
    } = options;
    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector("tbody");

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);
    this.yearHandler = yearHandler;
    this.$yearSubmitter = document.getElementById(yearSubmitter);
    this.$genreSubmitter = document.getElementById(genreSubmitter);
  }

  createMovieEl(movie) {
    const { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }

  fillYear() {
    // to get unique years and their amount
    let years = data.map((obj) => `${obj.year}`);
    let uniqueYears = years.reduce(function (acc, year) {
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year]++;
      return acc;
    }, {});
    const yearKeys = Object.keys(uniqueYears);

    yearKeys.forEach((key, index) => {
      this.$yearSubmitter.insertAdjacentHTML(
        "beforebegin",
        `<div class="form-check">
          <input
              class="form-check-input"
              type="radio"
              name="year"
              id="year${index}"
              value="${key}"
            />
            <label class="form-check-label" for="year${key}"> ${key} (${uniqueYears[key]}) </label>
          </div>`
      );
    });
  }

  fillGenre() {
    // to get unique genres and their amount
    let genres = data.map((obj) => `${obj.genre}`);
    let uniqueGenres = genres.reduce(function (acc, genre) {
      if (!acc[genre]) {
        acc[genre] = 0;
      }
      acc[genre]++;
      return acc;
    }, {});
    const genreKeys = Object.keys(uniqueGenres);

    genreKeys.forEach((key, index) => {
      this.$genreSubmitter.insertAdjacentHTML(
        "beforebegin",
        `<div class="form-check">
        <input
          class="form-check-input genre"
          type="checkbox"
          value="${key}"
          id="genre${index}"
        />
        <label class="form-check-label" for="genre${index}">
          ${key} (${uniqueGenres[key]})
        </label>
      </div>`
      );
    });
  }

  fillTable() {
    /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
    const moviesArr = data
      .map((movie) => {
        return this.createMovieEl(movie);
      })
      .join("");
    this.$tbodyEl.innerHTML = moviesArr;
  }

  reset() {
    this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
      item.style.background = "transparent";
    });
  }

  handleSearch() {
    this.$searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.reset();
      const searchValue = this.$searchInput.value;
      const matchedMovies = data
        .filter((movie) => {
          return searchMovieByTitle(movie, searchValue);
        })
        .forEach(makeBgActive);
      // to clear search input
      this.$searchInput.value = "";
    });
  }

  handleYearFilter() {
    this.$yearSubmitter.addEventListener("click", () => {
      this.reset();
      const selectedYear = document.querySelector(
        `input[name='${this.yearHandler}']:checked`
      ).value;
      const matchedMovies = data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  handleGenreFilter() {
    this.$genreSubmitter.addEventListener("click", () => {
      this.reset();
      const selectedGenres = document
        .querySelectorAll(`input[type='checkbox']:checked`)
        .forEach((genre) => {
          const matchedMovies = data
            .filter((movie) => {
              return movie.genre === genre.value;
            })
            .forEach(makeBgActive);
        });
    });
  }

  init() {
    this.fillTable();
    this.fillYear();
    this.fillGenre();
    this.handleSearch();
    this.handleYearFilter();
    this.handleGenreFilter();
  }
}

let myMoviesApp = new MoviesApp({
  root: "movies-table",
  searchInput: "searchInput",
  searchForm: "searchForm",
  yearHandler: "year",
  yearSubmitter: "yearSubmitter",
  genreSubmitter: "genreSubmitter",
});

myMoviesApp.init();
