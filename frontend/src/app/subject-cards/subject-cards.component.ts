import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Link } from '../models/link';
import { SubjectCardService } from '../services/subject-card.service';

@Component({
  selector: 'app-subject-cards',
  templateUrl: './subject-cards.component.html',
  styleUrls: ['./subject-cards.component.scss']
})
export class SubjectCardsComponent implements OnInit {
  searchText;
  links: Link[] = [];
  environment = environment;

  constructor(private route: ActivatedRoute, private subjectCardService: SubjectCardService) {
  }

  ngOnInit(): void {
    this.route.params.pipe(map(d => d.programId)).subscribe(programId => {
      this.subjectCardService.getAllFor(programId).subscribe(
        data => this.links = data,
        error => console.log(error)
      );
    });
  }

  clearField()
  {
    this.searchText = '';
  }
}
