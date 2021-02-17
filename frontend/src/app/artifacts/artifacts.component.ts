import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.scss']
})
export class ArtifactsComponent implements OnInit {
  programId: string;

  constructor(private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.route.params.pipe(map(d => d.programId)).subscribe(programId => {
      this.programId = programId;
    });
  }

}
