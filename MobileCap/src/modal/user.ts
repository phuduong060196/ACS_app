export class User {
    CustomerId: number;
    FullName: string;
    PhoneNumber: number;
    Email: string;
    Address: string;
    constructor(user?: User) {
        this.CustomerId = user && user.CustomerId ? user.CustomerId : -1;
        this.FullName = user && user.FullName ? user.FullName : '';
        this.PhoneNumber = user && user.PhoneNumber ? user.PhoneNumber : 0;
        this.Email = user && user.Email ? user.Email : '';
        this.Address = user && user.Address ? user.Address : '';
    }
}