import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import * as firebase from 'firebase';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private collection: AngularFirestoreCollection<User>;

  telefone: any;
  uid: any;
  email: string
  user: any;
  nome: any;
  foto: any;
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afa: AngularFireAuth

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
