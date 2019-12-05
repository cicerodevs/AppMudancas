import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'contact'
    }, {
      title: 'Minhas mudanças',
      url: '/mudancas',
      icon: 'list'
    },
    {
      title: 'Seja um Prestador',
      url: '/prestador-details',
      icon: 'car'
    },
    {
      title: 'Sobre',
      url: '/sobre',
      icon: 'information-circle-outline'
    },
    {
      title: 'Sair',
      url: '/sair',
      icon: 'log-out'
    }
  ];
  private collection: AngularFirestoreCollection<User>;

  telefone: any;
  uid: any;
  email: string
  user: any;
  nome: any;
  foto: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private afs: AngularFirestore,
    private afa: AngularFireAuth
  ) {
    this.initializeApp();
    this.collection = this.afs.collection<User>('Users');
    this.userLogado() ;
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  userLogado() {
    this.afa.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.uid = user.uid;
        this.telefone = "(61)98299-3551";

        this.afs.collection('Users').doc(user.uid).get().subscribe(dados => {
          this.telefone = dados.data().telefone;
          this.nome = dados.data().nome;
          this.foto = dados.data().picture;

          console.log(this.foto);
          return;
        });
        return;
      }
    });
  }

}
