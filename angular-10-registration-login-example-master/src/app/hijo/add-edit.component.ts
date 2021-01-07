import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    masculino = "masculino";
    femenino = "femenino";
    hijo=null;
    user=null;

    // City Names
    City = ['guatemala', 'alta verapaz', 'baja verapaz', 'chimaltenando', 'peten', 'el progreso', 'quiche','escuintla','huehuetenando','izabal','jalapa','jutiapa','quetzaltenando','retalhuleu','sacatepequez','san marcos','santa rosa','solola','suchitepequez','totonicapan','zacapa']
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.user = this.accountService.userValue;
     }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(4)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            nickname: ['', Validators.required],
            password: ['', passwordValidators],
            nombre: ['', Validators.required],
            sexo: ['', Validators.required],
            fecha: ['', Validators.required],
            edad: ['', Validators.required],
            bastones: ['', Validators.required],
            departamento: ['', Validators.required],
            municipio: ['', Validators.required],
            direccion: ['', Validators.required],
            longitud: ['', Validators.required],
            latitud: ['', Validators.required],
            idpadre: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.accountService.getHijoById(this.id)
                .pipe(first())
                .subscribe(hijo => this.hijo = hijo);
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    verdatos() {
        this.f.nickname.setValue(this.hijo[0].nickname);
        this.f.password.setValue(this.hijo[0].contrasena);
        this.f.nombre.setValue(this.hijo[0].nombre);
        this.f.edad.setValue(this.hijo[0].edad);
        this.f.bastones.setValue(this.hijo[0].bastones);
        this.f.municipio.setValue(this.hijo[0].municipio);
        this.f.direccion.setValue(this.hijo[0].direccion);
        this.f.longitud.setValue(this.hijo[0].longitud);
        this.f.latitud.setValue(this.hijo[0].latitud);
        this.f.idpadre.setValue(this.hijo[0].idpadre);
    }

    private createUser() {
        this.accountService.addHijo(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });

            this.accountService.addChat(this.f.nickname.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });


    }

    private updateUser() {
        this.accountService.updateHijo(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}