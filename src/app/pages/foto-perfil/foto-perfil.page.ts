import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/interfaces/user';
import { LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-foto-perfil',
  templateUrl: './foto-perfil.page.html',
  styleUrls: ['./foto-perfil.page.scss'],
})
export class FotoPerfilPage implements OnInit {
  private collection: AngularFirestoreCollection<User>;
  private picture: any;
  public user: any = {};
  public loading: any;


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private LoadingCtrl: LoadingController,
    private toastCtrl: ToastController

  ) {
  }

  ngOnInit() {

  }

  async update() {
    await this.presentLoading();

    try {
      this.afa.authState.subscribe(user => {
        if (user) {
        this.afs.collection('Users').doc(user.uid).update({
          picture: this.user.picture
        });
        console.log("Foto do perfil atualizada com sucesso");
          return;
          
        }
      });
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
