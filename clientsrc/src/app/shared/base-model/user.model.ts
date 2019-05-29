export class User {
    constructor(user?: any) {
        if (!user) {
            return;
        }
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.fullName = `${user.firstName} ${user.lastName}`;
        this.role = user.role;
        this.sub = user.sub;
    }
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    sub: string;
}
