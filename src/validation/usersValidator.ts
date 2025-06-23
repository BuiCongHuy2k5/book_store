import { User } from "@Entities/User";

export class UserValidator {
  static isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhoneValid(phoneNumber: string): boolean {
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    return phoneRegex.test(phoneNumber);
  }

  static isBirthDateValid(date: Date): boolean {
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime()) && parsed < new Date();
}

  static validate(user: User): string[] {
    const errors: string[] = [];

    if (!user.name || user.name.trim() === '') {
      errors.push('Tên không được để trống.');
    }

    if (!this.isEmailValid(user.email)) {
      errors.push('Email không hợp lệ.');
    }

    if (!this.isPhoneValid(user.phoneNumber)) {
      errors.push('Số điện thoại không hợp lệ.');
    }

    if (!this.isBirthDateValid(user.birtDate)) {
      errors.push('Ngày sinh không hợp lệ.');
    }

    return errors;
  }
}
