import { NgForm } from '@angular/forms';
import { ApiRestService } from './../../service/api-rest.service';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  vmotivo = '';
  vmodalidad = '01';
  fecha_emision = this.fechaActual();
  horaEmision = new Date(this.fecha_emision).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  fecha_traslado = this.fechaActual().substring(0, 10);
  empresas = [];
  empresa = '';
  modalidad = [{ id: '01', text: 'PUBLICO', }, { id: '02', text: 'PRIVADO' }];
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  motivos = [];
  destinatarios = [];
  transportista = [];
  chofer = [];
  destino = [];
  origen = [];
  modalRef: NgbModalRef;
  //producto modal -----------------------------------------
  selectedRow: number;
  objetoProducto: any = {};
  //destino modal-------------------------------------------
  destinos = [];
  ubigeoDestino = '';
  direccionDestino = '';
  contador = 0;
  //select destino------------------------------------------
  vdestino = '';
  destinoArray = [];
  //select origen-------------------------------------------
  vorigen = '';
  origenArray = []
  //producto modal------------------------------------------
  descripcion = '';
  //Guia de remision----------------------------------------
  empresaid = '';
  destinatario_input = '';
  chofer_input = '';
  transportista_input = '';
  productos = [];//todos los productos del modal
  listadoProductoDetalles = [];//todos los detalles de la guia de remision
  cantidad = '1';
  placaChofer = '';
  brevete = '';
  serieNumero = '';
  observaciones = '';
  correoDestinatario = '';
  numeroDocDestinatario = '';
  tipodocumentoadquiriente = '';
  motivoArray = [];
  pesoBruto = '';
  medidaGRE = 'KGM';
  modalidadTraslado = '';
  numeroRucTransportista = '';
  mtcTransportista = '';
  tipoDocumentoTransportista = '';
  razonSocialTransportista = '';
  numeroDocumentoConductor: '';
  tipoDocumentoConductor: '';
  Nrobultos = '';
  constructor(public api: ApiRestService, private modalService: NgbModal,public rout:Router) {
    console.log()
    this.obtenerInfo();
  }

  obtenerInfo() {
    this.api.getInfo().subscribe((res: any) => {
      this.empresas = res.empresas;
      this.motivos = res.motivos;
      this.chofer = res.chofer;
      this.transportista = res.transportista;
      this.destinatarios = res.adquiriente;
      this.destino = res.destino;
      this.origen = res.origen;
    });
  }
  fechaActual() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours() - 5;
    const isoString = new Date(year, month, day, hours).toISOString().slice(0, -8);
    return (isoString);
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  crearAdquiriente(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      form.value.destino = this.destinos;
      this.api.crearAdquiriente(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  crearTransportista(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      this.api.crearTransportista(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  crearChofer(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      this.api.crearChofer(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  crearFilas() {
    if (this.ubigeoDestino == '' || this.direccionDestino == '') {
      return Swal.fire({ icon: 'error', title: 'Complete los campos' });
    }
    var obj = { id: this.contador, ubigeodestino: this.ubigeoDestino, direcciondestino: this.direccionDestino }
    this.destinos.push(obj);
    this.ubigeoDestino = '';
    this.direccionDestino = '';
    this.contador++;
  }
  borrarDestinoArray(id) {
    const indice = this.destinos.findIndex((elemento) => elemento.id === id);
    this.destinos.splice(indice, 1);
  }
  asignarDestinatario(nombre, ndoc, correo, tipoDoc) {
    this.destinatario_input = nombre;
    this.correoDestinatario = correo;
    this.numeroDocDestinatario = ndoc;
    this.tipodocumentoadquiriente = tipoDoc;
    this.modalService.dismissAll();
    Swal.showLoading();
    this.api.getDestinos({ NUMERODOCUMENTOADQUIRIENTE: ndoc }).subscribe((res: any) => {
      this.destino = res;
      Swal.close();
    });
  }
  asignarChofer(ndoc, nombre, apellido, placa, tipoDoc, brevete) {
    this.chofer_input = nombre + ' ' + apellido;
    this.tipoDocumentoConductor = tipoDoc;
    this.numeroDocumentoConductor = ndoc;
    this.brevete = brevete;
    this.modalService.dismissAll();
    this.placaChofer = placa;
  }
  asignarTransportista(ndoc, nombre, tipoDoc, mtc) {
    this.transportista_input = nombre;
    this.numeroRucTransportista = ndoc;
    this.razonSocialTransportista = nombre;
    this.tipoDocumentoTransportista = tipoDoc;
    this.mtcTransportista = mtc;
    this.modalService.dismissAll();
  }
  salir() {
    this.destinos = []
    this.modalRef.close();
  }
  empresaChange(id: string) {
    if (id) {
      Swal.showLoading();
      var num = id.split('-');
      this.empresaid = id
      this.api.getOrigenes(num[0]).subscribe((res: any) => {
        Swal.close();
        this.origen = res;
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
      })
    }
  }
  DestinoChange(valor) {
    this.destinoArray = valor.split('-')
  }
  medidaChange(valor) {
    console.log(valor + ' gre')
    this.medidaGRE = valor;
  }
  motivoChange(valor) {
    this.motivoArray = valor.split('-');
  }
  ModalidadChange(valor) {
    this.vmodalidad = valor;
    this.modalidadTraslado = valor;
  }
  origenChange(valor) {
    this.origenArray = valor.split('-');
  }
  seleccionarProducto(codigo, descripcion, unidadmedida, row: number) {
    this.selectedRow = row;
    this.objetoProducto = { codigo: codigo, descripcion: descripcion, unidadmedida: unidadmedida }
  }
  asignarProducto() {
    this.objetoProducto.cantidad = this.cantidad.toString();
    this.objetoProducto.descripcion = this.descripcion != '' ? this.objetoProducto.descripcion + ' ' + this.descripcion : this.objetoProducto.descripcion;
    var found = this.listadoProductoDetalles.find(object => object.codigo == this.objetoProducto.codigo && object.descripcion == this.objetoProducto.descripcion && object.unidadmedida == this.objetoProducto.unidadmedida);
    if (found) {
      return Swal.fire({ icon: 'error', title: 'El producto ya ha sido insertado' });
    }
    this.listadoProductoDetalles.push(this.objetoProducto);
    this.salirProducto();
  }
  salirProducto() {
    this.objetoProducto = {};
    this.descripcion = '';
    this.cantidad = '1';
    this.selectedRow = null;
    this.modalService.dismissAll();
  }
  obtenerProductos() {
    Swal.showLoading();
    this.api.getProductos().subscribe((res: any) => {
      Swal.close();
      if (res && res.length > 0) {
        this.productos = res;
      }
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
    });
  }

  borrarListadoProductoDetalles(codigo, descripcion, cantidad, unidadmedida) {
    const indice = this.listadoProductoDetalles.findIndex((elemento) => elemento.codigo == codigo && elemento.descripcion == descripcion && elemento.cantidad == cantidad && elemento.unidadmedida == unidadmedida);
    this.listadoProductoDetalles.splice(indice, 1);
  }
  declararGuia() {
    var obj = this.llenarGuia();
    this.api.declararGuia(obj).subscribe((res: any) => {
      Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
    })
  }
  limpiarPantalla(){

    /* this.serieNumero='';
    this.fecha_emision=this.fechaActual();
    this.observaciones=''; */
  }
  llenarGuia() {

    var arrayRem = this.empresaid.split('-');
    var tipoDocRem = arrayRem[1];
    var numeroDocRem = arrayRem[0];
    var razonsocialemisorRem = arrayRem[2];
    var obj = {
      tipoDocumentoRemitente: tipoDocRem,
      numeroDocumentoRemitente: numeroDocRem,
      serieNumeroGuia: this.serieNumero,
      tipoDocumentoGuia: '09',
      bl_estadoRegistro: 'N',
      bl_reintento: 0,
      bl_origen: 'W',
      bl_hasFileResponse: 0,
      fechaEmisionGuia: this.fecha_emision.substring(0, 10), //solo date yyyy-mm-dd
      observaciones: this.observaciones,
      razonSocialRemitente: razonsocialemisorRem, //razonsocialemisor empresa
      correoRemitente: '-',
      correoDestinatario: this.correoDestinatario,
      serieGuiaBaja: '',
      codigoGuiaBaja: '',
      tipoGuiaBaja: '',
      numeroDocumentoRelacionado: '',
      codigoDocumentoRelacionado: '',
      numeroDocumentoDestinatario: this.numeroDocDestinatario,
      tipoDocumentoDestinatario: this.tipodocumentoadquiriente,
      razonSocialDestinatario: this.destinatario_input,
      numeroDocumentoEstablecimiento: '',
      tipoDocumentoEstablecimiento: '',
      razonSocialEstablecimiento: '',
      motivoTraslado: this.motivoArray[0],
      descripcionMotivoTraslado: this.motivoArray[1],
      indTransbordoProgramado: '',
      pesoBrutoTotalBienes: this.pesoBruto,
      unidadMedidaPesoBruto: this.medidaGRE,
      modalidadTraslado: this.modalidadTraslado, //01 publico 02 privado
      fechaInicioTraslado: this.fecha_traslado,
      numeroRucTransportista: this.numeroRucTransportista,
      tipoDocumentoTransportista: this.tipoDocumentoTransportista,
      razonSocialTransportista: this.razonSocialTransportista,
      numeroDocumentoConductor: this.numeroDocumentoConductor == null ? '' : this.numeroDocumentoConductor,
      tipoDocumentoConductor: this.tipoDocumentoConductor == null ? '' : this.tipoDocumentoConductor,
      numeroPlacaVehiculoPrin: this.placaChofer, //conductor chofer
      numeroBultos: this.Nrobultos,
      numeroContenedor1: '',
      ubigeoPtoLLegada: this.destinoArray[1], //destino
      direccionPtoLLegada: this.destinoArray[2], //destino
      ubigeoPtoPartida: this.origenArray[1], //origen
      direccionPtoPartida: this.origenArray[2], //origen
      codigoPuerto: '',
      idEntrega: '',
      horaEmisionGuia: this.horaEmision, //solo hora!! hh:mm:ss
      numeroPlacaVehiculoSec1: '',
      bL_SOURCEFILE: '',
      bl_createdAt: null,
      numeroAutorizacionRem: '',
      codigoAutorizadoRem: '',
      tipoDocumentoComprador: '',
      numeroDocumentoComprador: '',
      razonSocialComprador: '',
      pesoBrutoTotalItem: '',
      unidadMedidaPesoBrutoItem: '',
      sustentoPesoBrutoTotal: '',
      numeroPrecinto1: '',
      numeroContenedor2: '',
      numeroPrecinto2: '',
      fechaEntregaBienes: this.fecha_traslado, //fecha de entrega solo DATE
      indRetornoVehiculoEnvaseVacio: '',
      indTrasVehiculoCatM1L: '',
      indRegVehiculoyCond: '',
      indRetornoVehiculoVacio: '',
      indTrasladoTotalDAMoDS: '',
      tipoEvento: '',
      numeroRegistroMTC: this.mtcTransportista,//puede estar en blanco
      numeroAutorizacionTrans: '',
      codigoAutorizadoTrans: '',
      tarjetaUnicaCirculacionPrin: '',
      numeroAutorizacionVehPrin: '',
      codigoAutorizadoVehPrin: '',
      numeroPlacaVehiculoSec2: '',
      tarjetaUnicaCirculacionSec1: '',
      tarjetaUnicaCirculacionSec2: '',
      numeroAutorizacionVehSec1: '',
      numeroAutorizacionVehSec2: '',
      codigoAutorizadoVehSec1: '',
      codigoAutorizadoVehSec2: '',
      nombreConductor: '',
      apellidoConductor: '',
      numeroLicencia: this.brevete, //chofer
      numeroDocumentoConductorSec1: '',
      tipoDocumentoConductorSec1: '',
      nombreConductorSec1: '',
      apellidoConductorSec1: '',
      numeroLicenciaSec1: '',
      numeroDocumentoConductorSec2: '',
      tipoDocumentoConductorSec2: '',
      nombreConductorSec2: '',
      apellidoConductorSec2: '',
      numeroLicenciaSec2: '',
      numeroDocumentoPtoLlegada: '',
      codigoPtollegada: '',
      ptoLlegadaLongitud: '',
      ptoLlegadaLatitud: '',
      numeroDocumentoPtoPartida: '',
      codigoPtoPartida: '',
      ptoPartidaLongitud: '',
      ptoPartidaLatitud: '',
      tipoLocacion: '',
      codigoAeropuerto: '',
      nombrePuertoAeropuerto: '',
      spE_DESPATCH_ITEM: this.listadoProductoDetalles
    }
    return obj;
  }
}
