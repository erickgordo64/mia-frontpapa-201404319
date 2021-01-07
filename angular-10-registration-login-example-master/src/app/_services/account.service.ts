import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(correo, contrasena) {
        return this.http.post<User>(`${environment.apiUrl}/loginPapa`, { correo, contrasena })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    addReparto(idhijo, idsanta, idcarta, estado) {
        return this.http.post(`${environment.apiUrl}/addReparto`, {idhijo,idsanta,idcarta,estado});
    }

    addHijo(user: User){
        return this.http.post(`${environment.apiUrl}/addHijo`, user);
    }

    addChat(nombre: string){
        return this.http.post(`${environment.apiUrl}/addChat`,{nombre});
    }

    addDetalleChat(idchat, contenido, idadmin, idhijo){
        return this.http.post(`${environment.apiUrl}/addDetalleChat`,{idchat, contenido, idadmin, idhijo});
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getChat(nickname: string) {
        return this.http.get<User[]>(`${environment.apiUrl}/getChats/?nickname=${nickname}`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getHijoByID(id:string){
        return this.http.get<User[]>(`${environment.apiUrl}/getHijoById/?id=${id}`);
    }

    getHijoById(id: string){
        return this.http.get<User>(`${environment.apiUrl}/getSon/?id=${id}`);
    }

    getChatById(id: string){
        return this.http.get<User[]>(`${environment.apiUrl}/getChatById/?id=${id}`);
    }

    getMensajeById(id: string){
        return this.http.get<User[]>(`${environment.apiUrl}/getMensaje/?id=${id}`);
    }

    getAccionByID(id:string){
        return this.http.get<User[]>(`${environment.apiUrl}/getAccionById/?id=${id}`);
    }

    geCartasHijosByID(id:string){
        return this.http.get<User[]>(`${environment.apiUrl}/getCartasHijosById/?id=${id}`);
    }

    geElementosCartaByID(id:string){
        return this.http.get<User[]>(`${environment.apiUrl}/getElementosCartaById/?id=${id}`);
    }

    updateDetalleAccion(id, estado){
        return this.http.put(`${environment.apiUrl}/updateDetalleAccion`,{id, estado});
    }

    updateBastonesHijo(id, bastones){
        return this.http.put(`${environment.apiUrl}/updateBastonesHijo`,{id, bastones});
    }

    updateEstadoCarta(id, estado){
        return this.http.put(`${environment.apiUrl}/updateEstadoCarta`,{id, estado});
    }

    updateHijo(id, params) {
        return this.http.put(`${environment.apiUrl}/updateHijo/?id=${id}`, params);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/deleteProductoDetalleCarta/?id=${id}`);
    }
}