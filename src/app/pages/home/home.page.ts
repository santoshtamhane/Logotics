import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {EventService} from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  eventList: Observable<any>;
  userid: string;
  isLogged: boolean;
  searchTerm = '';
  searchControl: FormControl;
  searchForm: FormGroup;
  items: any;
  searching: any = false;

  constructor(private router: Router, private authService: AuthService,
              private route: ActivatedRoute,
              private eventservice: EventService,
              private menuCtrl: MenuController, public navCtrl: NavController) {
                this.userid = this.route.snapshot.paramMap.get('userid');
                this.eventList = this.eventservice.getEventList(this.userid).valueChanges();
                this.searchControl = new FormControl();

               }

  ngOnInit() {
   this.searchControl.valueChanges.debounceTime(400).subscribe(search => {
        this.searching = false;
        if (search.length > 3) {
        this.eventList = this.eventList.map(docs => docs.map(doc => doc)
        .filter(item => {
          return item.Event.toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
      })
   );
    }
        if (search.length === 0) {
          this.eventList = this.eventservice.getEventList(this.userid).valueChanges();
    }
    });

  }


  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.isLogged = this.authService.isLoggedIn();
  }

onSearchInput() {
    this.searching = true;
}
openDashBoard(eventid: string, event: string, Date: string, ikey: string) {
  // this.navCtrl.navigateForward(['/dashboard-a', {eventid, event, Date, ikey}]);
  this.navCtrl.navigateForward(['/event-dashboard', {userid: this.userid, eventid, event, Date, ikey}]);
}
filterEvents(searchTerm: string) {
    return this.eventList
    .subscribe(item => {
      return item.Event.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
}

  logOut(): void {
    this.authService.userLogout().then( () => {
    this.router.navigateByUrl('/login');
    });
    }
}
