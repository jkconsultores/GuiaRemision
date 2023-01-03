import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';

@Component({
  selector: 'app-facturacion-electronica',
  templateUrl: './facturacion-electronica.component.html',
  styleUrls: ['./facturacion-electronica.component.scss']
})
export class FacturacionElectronicaComponent {
  constructor(private modalService: NgbModal){

  }
  modalRef: NgbModalRef;
  salir() {
    this.modalRef.close();
  }
  abrirModal(modal){
    this.modalRef = this.modalService.open(modal, { size: 'lg' });
  }
}
