import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/interfaces/user';
import { LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.page.html',
  styleUrls: ['./telefone.page.scss'],
})
export class TelefonePage implements OnInit {
  private collection: AngularFirestoreCollection<User>;
  public telefone: any;
  public user: any = {};
  public loading: any;


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private LoadingCtrl: LoadingController,
    private toastCtrl: ToastController

  ) {
    this.collection = this.afs.collection<User>('Users');


  }

  ngOnInit() {

    this.updateTelefone();

  }

  async updateTelefone() {
    await this.presentLoading();

    try {
      this.afa.authState.subscribe(user => {
        if (user) {
        this.afs.collection('Users').doc(user.uid).get().subscribe(dados => {
            this.telefone = dados.data().telefone;
            return;
          });
        this.afs.collection('Users').doc(user.uid).update({
          telefone: this.user.telefone
        });
        console.log("Telefone atualizado com sucesso");
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
