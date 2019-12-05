import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController } from '@ionic/angular';
import { User } from 'firebase';
import * as firebase from 'firebase';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.page.html',
  styleUrls: ['./senha.page.scss'],
})
export class SenhaPage implements OnInit {
  private collection: AngularFirestoreCollection<User>;
  private senha: any;
  public user: any = {};
  public loading: any;


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private LoadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  async updateSenha(){
    await this.presentLoading();
    var user = firebase.auth().currentUser;

    try {
     user.updatePassword(this.user.senha);
      console.log("Senha atualizada com sucesso");
      
    } catch (error) {
      
     this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.LoadingCtrl.create({
      message: 'Por favor, aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


}
