import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookDto, BookService, bookTypeOptions } from '@proxy/books';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
  ],
})
export class BookComponent implements OnInit {

  book = { item: [], totalCount: 0 } as PagedResultDto<BookDto>;

  selectedBook = {} as BookDto;
  form: FormGroup;
  bookTypes = bookTypeOptions;

  isModalOpen = false;

  constructor(public readonly list: ListService,
    private bookService: BookService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const bookStreamCreator = (query) => this.bookService.getList(query);

    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }

  createBook(): void {

    this.selectedBook = {} as BookDto;

    this.buildForm();
    this.isModalOpen = true;
  }

  editBook(id: string): void {
    this.bookService.get(id).subscribe(book => {
      this.selectedBook = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [this.selectedBook.name || '', Validators.required],
      type: [this.selectedBook.type || null, Validators.required],
      publishDate: [this.selectedBook.publishDate ? new Date(this.selectedBook.publishDate) : null, Validators.required],
      price: [this.selectedBook.price, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedBook.id
      ? this.bookService.update(this.selectedBook.id, this.form.value)
      : this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });

  }



}
