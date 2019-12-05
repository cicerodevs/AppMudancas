import { Component, OnInit, NgZone } from '@angular/core';
import { Prestador } from 'src/app/interfaces/prestador';
import { Subscription } from 'rxjs';
import { PrestadorService } from 'src/app/services/prestador.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {

  public prestadores = new Array<Prestador>();
  private prestadorSubscrition: Subscription;
  public nome: any;
 

  constructor(
    private prestadorService: PrestadorService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private afs: AngularFirestore
  ) {
    this.prestadorSubscrition = this.prestadorService.getPrestadores().subscribe(data => {
      this.prestadores = data;


      
    });

  }

  ngOnInit() {
   
   }

  ngOnDestroy() {
    this.prestadorSubscrition.unsubscribe();
  }
}