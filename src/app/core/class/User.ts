export class User {
    mail: string | null = null;
    firstname: string | null = null;
    lastname: string | null = null;
    username: string | null = null;
    identification: string | null = null;
    id: number | null =null;
    profileid: number | null =null;
    agencyid: number | null =null;
    companyid: number | null = null;
    workdepartmentid: number | null = null;

    constructor(mail: string, firstname: string, lastname: string,
        username: string, identification: string, id: number, profileid: number,
        agencyid: number, companyid: number, workdepartmentid: number){
        this.mail = mail;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.identification = identification;
        this.id = id;
        this.profileid = profileid;
        this.agencyid = agencyid;
        this.companyid = companyid
        this.workdepartmentid = workdepartmentid;
    }
}
