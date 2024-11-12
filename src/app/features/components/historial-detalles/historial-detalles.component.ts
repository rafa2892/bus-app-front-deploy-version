import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historial-detalles',
  templateUrl: './historial-detalles.component.html',
  styleUrl: './historial-detalles.component.css'
})
export class HistorialDetallesComponent {

  constructor(private router:Router,private activatedRoute: ActivatedRoute) { }  
 
  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.paramMap.get('id')!;
    console.log("ID recibido en registrarViaje:", id);
      if(id) {
        console.log("detalles historial",id);
      }
 }

  
}
