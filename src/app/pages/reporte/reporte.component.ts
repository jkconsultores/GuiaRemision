import { ApiRestService } from './../../service/api-rest.service';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent {
  spe_despatch = [];
  spe_despatch_item = [];
  modalRef: NgbModalRef;
  constructor(private api: ApiRestService, private modalService: NgbModal) {
    this.getSpe_despatch();
  }
  getSpe_despatch() {
    this.api.getSpe_despatch().subscribe((res: any) => {
      this.spe_despatch = res;
    });
  }
  abrirModal(modal, serie) {
  Swal.showLoading();
    this.api.getSpe_despatch_item(serie).subscribe((res: any) => {
      this.spe_despatch_item = res;
      Swal.close();
      this.modalRef = this.modalService.open(modal, { size: 'lg' });
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
    })

  }
}
