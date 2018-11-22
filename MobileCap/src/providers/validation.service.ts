export class ValidationService {
    static getValidationErrorMessage(validatorName: string) {
        let config = {
            'required': 'Không để trống!',
            'invalidUsername': 'Tên đăng nhập phải có chữ, không có ký tự đặc biệt!',
            'invalidPassword': 'Mật khẩu tối thiểu 6 ký tự, tối đa 12 ký tự!',
            'invalidMatchedPassword': 'Mật khẩu không trùng khớp!',
            'invalidFullName': 'Họ tên không có số, không có ký tự đặc biệt!',
            'invalidEmailFormat': 'Email không hợp lệ!'
        };
        return config[validatorName];
    }

    static usernameValidator(control) {
        if (control.value.match(/^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,50}$/)) {
            return null;
        } else {
            return { 'invalidUsername': true };
        }
    }

    static passwordValidator(control) {
        if (control.value.match(/^[a-zA-Z0-9!@#$%^&*]{6,12}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    // static rePasswordValidator(control1, control2) {
    //     if (control1.value === control2.value) {
    //         return null;
    //     } else {
    //         return { 'invalidMatchedPassword': true };
    //     }
    // }

    static fullNameValidator(control) {
        if (control.value.match(/^(?=.*[a-zA-Z])[a-zA-Z]{1,50}$/)) {
            return null;
        } else {
            return { 'invalidFullName': true };
        }
    }

    static emailFormatValidator(control) {
        if (control.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            return null;
        } else {
            return { 'invalidEmailFormat': true };
        }
    }
}