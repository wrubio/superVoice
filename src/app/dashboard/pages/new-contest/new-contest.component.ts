import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router  } from '@angular/router';
import { Contest } from '../../../models/contest.model';
import { ContestService } from 'src/app/services/services.index';

@Component({
  selector: 'app-new-contest',
  templateUrl: './new-contest.component.html',
  styleUrls: ['./new-contest.component.css']
})
export class NewContestComponent implements OnInit {

  userId: string;

  constructor(public contestService: ContestService, public router: Router) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userId = user.id;
  }

  ngOnInit() {
  }
  newContest(form: NgForm) {
    if (form.invalid) { return; }
    const contest = new Contest(
      form.value.nameContest,
      form.value.startDateContest,
      form.value.endDateContest,
      form.value.awardContest,
      form.value.guionContest,
      form.value.recomendContest,
      form.value.fileContest,
      form.value.urlContest,
      'publicado',
      this.userId
    );
    console.log(contest);
    this.contestService.createContest(contest).subscribe( (res: any) => {
      console.log(res);
    });
  }
}
