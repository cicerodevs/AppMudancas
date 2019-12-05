import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Mudanca } from '../interfaces/mudanca';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MudancaService {
  private mudancaCollection: AngularFirestoreCollection<Mudanca>;

  constructor( private afs: AngularFirestore) { 
    this.mudancaCollection = this.afs.collection<Mudanca>('Mudanca');
  }

  getPrestadores(){
    return this.mudancaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    )
  }

  addPrestador(mudanca: Mudanca){
    return this.mudancaCollection.add(mudanca);
  }

  getPrestador(id: string){
    return this.mudancaCollection.doc<Mudanca>(id).valueChanges();
  }

  updatePrestador(id: string, prestador: Mudanca){
    return this.mudancaCollection.doc<Mudanca>(id).update(prestador);
  }
  deletePrestador(id: string){
    return this.mudancaCollection.doc(id).delete();
  }
 

}