import { Component, OnInit } from '@angular/core';
//Importar servicio
import { EjemploApiService } from '../services/ejemplo-api.service';

//Routing
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular'; 

//Cámara y Scanner
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  alumnos=[];
  id!:string;
  seccion!:string;

  //Para la cámara y scanner
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private api:EjemploApiService, private router: Router, private navCtrl: NavController, private alertController: AlertController) {
  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

/*
  async ngOnInit(){
    //this.api.getPosts();
  }
*/
  getAlumnos(seccion:string){
    console.log("Home: Inicio");
    this.api.getAlumnos(seccion).subscribe((res)=>{
    console.log("Home: CORRECTO");
    //CAMBIO IMPORTANTE
    this.alumnos = res["items"];
    console.log("Home: ASIGNACION");
    console.log(res);
    },(error)=>{
      console.log("Home: ERROR");
      console.log(error);
    });
    console.log("Home: Fin");
  };

  editAlumno(id:string, seccion:string){
    const data = id;
    console.log("Home: Ingreso, Variable : " + id)

    let navigationExtras: NavigationExtras ={
      state:{data: data, seccion: seccion}
    };

    this.router.navigate(['editar-alumno'], navigationExtras);
  }

  salir(){
    //Funcionalidades sólo para utilizar con guard
    localStorage.setItem('ingresado','false');
    this.navCtrl.navigateRoot('login');
  }

  getSelected(seccion:string)
  {
    console.log("Selector: ", seccion);
  }

  //Para el scanner
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  //Acá termina el scanner
}

