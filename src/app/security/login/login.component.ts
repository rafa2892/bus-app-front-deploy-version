import { Component } from '@angular/core';
import { UserAuth } from '../user-auth';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userLogin:UserAuth;

  
  constructor(private authServicio:AuthService){}

  // constructor(
  //   private viajeServicio:ViajeServicioService,private router:Router, private carroServicio:CarroService,
  //   private _snackBar: MatSnackBar,public dialog: MatDialog, private conductorService:ConductorServiceService,
  //   private rutaServicio:RutasService, private cdr: ChangeDetectorRef){}


  ngOnInit(): void {
    this.userLogin = new UserAuth();
  }

  onSubmit(){

    this.authServicio.login(this.userLogin);
        this.authServicio.login(this.userLogin).subscribe(dato => {
        });



      }
  }

