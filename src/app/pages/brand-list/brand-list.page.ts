import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {BrandsService} from '../../services/brands.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.page.html',
  styleUrls: ['./brand-list.page.scss'],
})
export class BrandListPage implements OnInit {
  brandList: Observable<any>;
  userid: string;
  isLogged: boolean;
  searchTerm = '';
  searchControl: FormControl;
  searchForm: FormGroup;
  items: any;
  searching: any = false;

  constructor(private router: Router, private authService: AuthService,
              private route: ActivatedRoute,
              private brandservice: BrandsService,
              private menuCtrl: MenuController, public navCtrl: NavController) {
                this.userid = this.route.snapshot.paramMap.get('userid');
                this.brandList = this.brandservice.getBrandList(this.userid).valueChanges();
                this.searchControl = new FormControl();

               }

  ngOnInit() {
   this.searchControl.valueChanges.debounceTime(400).subscribe(search => {
        this.searching = false;
        if (search.length > 3) {
        this.brandList = this.brandList.map(docs => docs.map(doc => doc)
        .filter(item => {
          return item.Name.toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
      })
   );
    }
        if (search.length === 0) {
          this.brandList = this.brandservice.getBrandList(this.userid).valueChanges();
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
openDashBoard(brandid: string) {
  this.navCtrl.navigateForward(['/brand-dashboard', {userid: this.userid, brandid}]);
}
filterbrands(searchTerm: string) {
    return this.brandList
    .subscribe(item => {
      return item.brand.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
}

  logOut(): void {
    this.authService.userLogout().then( () => {
    this.router.navigateByUrl('/login');
    });
    }
}

