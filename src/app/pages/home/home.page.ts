import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { Platform, LoadingController, NavController } from '@ionic/angular';
import { Environment, GoogleMap, GoogleMaps, GoogleMapOptions, GoogleMapsEvent, MyLocation, GoogleMapsAnimation, Marker, Geocoder, ILatLng } from '@ionic-native/google-maps';
import { AngularFireAuth } from '@angular/fire/auth';
import { BuscaPage } from '../busca/busca.page';

declare let google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;
  private loading: any;
  private map: GoogleMap;
  public search: string = '';
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  public searchResults = new Array<any>();
  private originMarker: Marker;
  public destination: any;
  private googleDirectionsService = new google.maps.DirectionsService();


  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    private afa: AngularFireAuth,
    public navCtrl: NavController

  ) { }

  ngOnInit() {

    this.mapElement = this.mapElement.nativeElement;

    this.mapElement.style.width = this.platform.width() + 'px';
    this.mapElement.style.height = this.platform.height() + 'px';

      this.loadMap();
  }


  async loadMap() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    await this.loading.present();

    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCxv8TlekFH6-XmU64pPnK_b771mjkgnAo',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCxv8TlekFH6-XmU64pPnK_b771mjkgnAo'
    });

    const mapOptions: GoogleMapOptions = {
      controls: {
        zoom: false
      }
    };

    this.map = GoogleMaps.create(this.mapElement, mapOptions);

    try {
      await this.map.one(GoogleMapsEvent.MAP_READY);

      this.addOriginMarker();
    } catch (error) {
      console.error(error);
    }
  }

  async addOriginMarker() {
    try {
      const myLocation: MyLocation = await this.map.getMyLocation();

      await this.map.moveCamera({
        target: myLocation.latLng,
        zoom: 18
      });

      this.originMarker = this.map.addMarkerSync({
        title: 'Origem',
        icon: '#FF0000',
        animation: GoogleMapsAnimation.DROP,
        position: myLocation.latLng,

      });
      console.log("Origem: ", this.originMarker.getPosition());

    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }

  }
  searchChange() {
    if (!this.search.trim().length) return;

    this.googleAutocomplete.getPlacePredictions({ input: this.search }, predictions => {
      this.ngZone.run(() => {
        this.searchResults = predictions;
      });
    });
  }

  async calcRoute(item: any) {
    this.search = '';
    this.destination = item;

    const info: any = await Geocoder.geocode({ address: this.destination.description });

    let markerDestination: Marker = this.map.addMarkerSync({
      title: this.destination.description,
      icon: "#000",
      Animation: GoogleMapsAnimation.DROP,
      position: info[0].position
    });
    console.log("Destino: ", markerDestination.getPosition());
    //Find the distance
    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
      origins: [this.originMarker.getPosition()],
      destinations: [markerDestination.getPosition()],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false
    },
      function (response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          console.log('Error:', status);
        } else {
          // console.log(response);
          let results = response.rows[0].elements[0].distance.value;
          let result = response.rows[0].elements[0].distance.text;
          console.log("Para uma distancia de", result, " a um preco de R$9,00 o valor final é : ", ((results / 1000) * 9).toFixed(2));

        }

      });
  }

}