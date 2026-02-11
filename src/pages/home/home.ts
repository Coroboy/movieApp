import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Contacto {
  nombre: string;
  telefono: string;
  email: string;
  redesSociales: string[];
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
  diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  contactos: Contacto[] = [
    { nombre: 'Jose Luis', telefono: '0000000000', email: 'correo1@gmail.com', redesSociales: ['Facebook', 'Instagram'], visualizarNumero: false },
    { nombre: 'Angel Obed', telefono: '0000000000', email: 'correo2@gmail.com', redesSociales: ['Instagram'], visualizarNumero: false },
    { nombre: 'Josue Daniel', telefono: '0000000000', email: 'correo3@gmail.com', redesSociales: ['Facebook', 'Instagram', 'X'], visualizarNumero: false }
  ];


  verSpoiler() {
    this.showContent = !this.showContent
  }

  serAdmin() {
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