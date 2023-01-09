import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  constructor(public http:HttpClient) { }
  url='https://localhost:7224/api/';
  httpOptions = {
    headers: new HttpHeaders({
      'token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    })
  };
  public login(form:any){
    return this.http.post(this.url+'USUARIO_/login',form);
  }
  public getInfo(){
    return this.http.get(this.url+'AAA_',this.httpOptions);
  }
  public crearAdquiriente(form){
    return this.http.post(this.url+'AAA_',form,this.httpOptions)
  }
  public crearTransportista(form){
    return this.http.post(this.url+'AAA_/transportista',form,this.httpOptions)
  }
  public crearChofer(form){
    return this.http.post(this.url+'AAA_/chofer',form,this.httpOptions)
  }
  public getDestinos(form){
    return this.http.post(this.url+'AAA_/GetDestino',form,this.httpOptions);
  }
  public getProductos(){
    return this.http.get(this.url+'Producto',this.httpOptions);
  }
  public getOrigenes(id){
    return this.http.get(this.url+'AAA_/GetOrigen?id='+id,this.httpOptions);
  }
  public declararGuia(form){
    return this.http.post(this.url+'SPE_DESPATCH/declarar',form,this.httpOptions);
  }
  public getSpe_despatch(){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH',this.httpOptions);
  }
  public getSpe_despatch_item(serie){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH_ITEM?serie='+serie,this.httpOptions)
  }
}
