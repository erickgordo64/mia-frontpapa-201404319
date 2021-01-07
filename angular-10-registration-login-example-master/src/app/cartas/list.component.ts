import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;
    user=null;
    loading = false;
    estado="true";

    constructor(private accountService: AccountService, private alertService: AlertService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.accountService.geCartasHijosByID(this.user[0].idpadre)
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    confirmar(id: string){
        this.accountService.updateEstadoCarta(id,this.estado)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                window.location.reload();
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }
}