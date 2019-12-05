import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mudancas',
  templateUrl: './mudancas.page.html',
  styleUrls: ['./mudancas.page.scss'],
})
export class MudancasPage implements OnInit {
  public collection: AngularFirestoreCollection<MudancasPage>;
  public porte: any;
  public modelo: any;
  public placa: any;
  public agendamento: any;
  public user: any = {};
  public loading: any;
  public nome: any;


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private LoadingCtrl: LoadingController,
    private toastCtrl: ToastController

  ) {
    this.collection = this.afs.collection<MudancasPage>('Mudancas');
  }

  ngOnInit() {

    this.getAll();

  }

  async getAll() {
    
    this.afa.authState.subscribe(user => {
      if (user) {
       this.afs.collection('Mudancas').doc(user.uid).get().subscribe(doc => {
          this.porte = doc.data().porte;
          this.placa = doc.data().placa;
          this.modelo = doc.data().modelo;
          this.agendamento = doc.data().agendamento;
          this.nome = doc.data().nome;

          return;
        });
     
      }
    });

  }
 

}
