import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Contacto{
  nombre: string;
  telefono: string;
  email: string;
  redesSociales : string[];
  visualizarNumero: boolean;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home { 
  showContent = false;
  rol = 'user';
  diasSemana = ['Lunes', 'Martes','Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  contactos: Contacto[] = [
    {nombre: 'Jose Luis', telefono: '9513462874', email: 'cheluisojeda@gmail.com', redesSociales:['Facebook', 'Instagram'], visualizarNumero: false},
    {nombre: 'Angel Obed', telefono: '9514180455', email: 'angelobed@gmail.com', redesSociales:['Instagram'], visualizarNumero: false},
    {nombre: 'Tania Judith', telefono: '9511979804', email: 'taniajudith@gmail.com', redesSociales:['Facebook', 'Instagram', 'X'], visualizarNumero: false}
  ];
  

  verSpoiler(){
    this.showContent = !this.showContent
  }
  
  serAdmin(){
    this.rol = 'admin'
  }

  verNumero(contacto: Contacto) {
  contacto.visualizarNumero = !contacto.visualizarNumero;
  }

  estadoEnvio: string = 'pendiente';
  cambiarEstado(nuevoEstado: string) {
    this.estadoEnvio = nuevoEstado;
  }
}