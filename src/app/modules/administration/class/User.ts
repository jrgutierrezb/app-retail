import { IUser } from '../interfaces/IUser';

export class User implements IUser {
    agencyid: number;
    cellphone: string;
    firstname: string;
    id: number;
    identification: string;
    lastname: string;
    profileid: number;
    mail: string;
    telephone: string;
    username: string;
    companyid: number;
    workdepartmentid: number;
    

    constructor(id: number, cellphone: string, firstname: string, 
        identification: string, lastname: string, profileid: number,
        mail: string, telephone: string, username: string, agencyid: number,
        companyid: number, workdepartmentid: number) {
            this.cellphone = cellphone;
            this.firstname = firstname;
            this.id = id;
            this.identification = identification;
            this.lastname = lastname;
            this.profileid = profileid;
            this.mail = mail;
            this.telephone = telephone;
            this.username = username;
            this.agencyid = agencyid;
            this.companyid = companyid;
            this.workdepartmentid = workdepartmentid;
    }
    
    
}