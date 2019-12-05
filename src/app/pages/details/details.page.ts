import { Component, OnInit } from '@angular/core';
import { Prestador } from 'src/app/interfaces/prestador';
import { Subscription } from 'rxjs';
import { PrestadorService } from 'src/app/services/prestador.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public prestadorId: string = null;
  public prestadores: Prestador = {};
  public loading: any;
  public prestadorSubscription: Subscription;
  public nome: any;


  constructor(
    private prestadorService: PrestadorService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private afs: AngularFirestore,
    private afMessaging: AngularFireMessaging
  ) {
    this.prestadorId = this.activatedRoute.snapshot.params['id'];

    if (this.prestadorId) this.loadPrestador();
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.prestadorSubscription) this.prestadorSubscription.unsubscribe();
  }

  loadPrestador() {
    this.prestadorSubscription = this.prestadorService.getPrestador(this.prestadorId).subscribe(data => {
      this.prestadores = data;
      let array = data.userId;
      
      this.afs.collection('Users').doc(array).get().subscribe(dados => {
       this.nome = dados.data().nome;
        console.log(this.nome);
      });
    });
  }

  async saveMudanca() {
    await this.presentLoading();

    try {
      this.prestadorSubscription = this.prestadorService.getPrestador(this.prestadorId).subscribe(data => {
        this.prestadores = data;
        let array = data.userId;
        
        this.afs.collection('Users').doc(array).get().subscribe(dados => {
         this.nome = dados.data().nome;
          console.log(this.nome);
        });
      });
      var user = firebase.auth().currentUser;
      var ref = this.afs.collection('Prestador').doc(this.prestadorId).get().subscribe(doc => {
        const agendamento = {agendamento: 'AGEND-000'+1};
        const userId = { userId: user.uid };
        const prestadorId = { prestadorId: this.prestadorId };
        const placa = {placa: doc.data().placa};
        const modelo = {modelo: doc.data().modelo_veiculo};
        const porte = {porte: doc.data().porte};
        const nome = {nome: this.nome}
        const newUserObject = Object.assign({},agendamento, nome, placa, modelo, porte, userId, prestadorId);
  
         this.afs.collection('Mudancas').doc(user.uid).set(newUserObject);
        console.log("Cadastro realizado com sucesso");
        console.log(this.prestadorId);
      });
      this.navCtrl.navigateBack('/mudancas');
      await this.loading.dismiss();

      
    } catch (error) {
      console.error(error);
    }
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
