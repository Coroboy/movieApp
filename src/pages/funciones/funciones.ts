import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-funciones',
  imports: [],
  templateUrl: './funciones.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Funciones { 
  
  
  message=""
  usuarios=['Migue', 'Karol', 'Malagon']
  usuarios_resp = this.usuarios

  saludar(){
    console.log("Hola mundo")
    this.message="Hola mundo!"
  }

  eliminar(){
    this.usuarios=[]
  }

  mostrar(){
    console.log(this.usuarios)
  }

  recuperar(){
    this.usuarios=this.usuarios_resp
  }

  estadoAlumno = "";

  verificar(calificacion: number){
    if(calificacion<6){
      this.estadoAlumno = "Reprobado"
    }else{
      this.estadoAlumno = "Aprobado"
    }
    return this.estadoAlumno;
  }

  numeroMayor = 0
  numeroMenor = 0

  verificarNum(num1: number, num2: number){
    if(num1>num2){
      this.numeroMayor = num1
      this.numeroMenor = num2
    }else{
      this.numeroMayor = num2
      this.numeroMenor = num1
    }
  }

  precio = 0
  descuento = 0
  precioConDescuento = 0
  precioFinal(precio: number, descuento: number){
    this.precio = precio
    this.descuento = descuento
    this.precioConDescuento = precio - (precio * (descuento/100))
  }

  saludo = ""
  enviarSaludo(nombre?: string){
    if(nombre){
      this.saludo = "Hola " + nombre
    }else{
      this.saludo = "Hola, bienvenido maestro"
    }
  }

  resultadoSuma = 0
  calculaSuma(n1: number, n2?: number){ //parametros opcionales siempre al final
    //si el numero 2 existe, se suman, si no, solo mostrar el 1
    if(n2){
      this.resultadoSuma = n1 + n2
      return //esto termina la funcion
    }
    this.resultadoSuma = n1
  }

  //funcion que necesita dos parametros, descuento es opcional, si no viene descuento, el precio se queda igual
  price = 0
  discount = 0
  finalPriceProduct = 0
  finalPrice(precio: number, descuento?: number){
    if(descuento){
      this.finalPriceProduct =  precio - (precio * (descuento/100))
      this.price = precio
      this. discount = descuento
      this.finalPriceProduct
      return
    }
    this.price = precio
    this.discount = 0
    this.finalPriceProduct = precio
  }

  mensaje = '';

  mostrarMensaje(texto: string = 'Mensaje por defecto') {
    this.mensaje = texto;
  }

  mostrar2 = false;

  toggleMostrar(valor: boolean = true) {
    this.mostrar2 = valor;
  }

}