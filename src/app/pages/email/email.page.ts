import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/interfaces/user';
import * as firebase from 'firebase';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {
  private collection: AngularFirestoreCollection<User>;
  email: string;
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

    this.userLogado();

  }

  userLogado() {
    this.afa.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.afs.collection('Users').doc(user.uid).get().subscribe(dados => {
      
          return;
        });
        return;
      }
    });
  }
  async update(){
    
    await this.presentLoading();
    var user = firebase.auth().currentUser;

    try {
     user.updateEmail(this.user.email);
      console.log("Email atualizado com sucesso");
      
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
