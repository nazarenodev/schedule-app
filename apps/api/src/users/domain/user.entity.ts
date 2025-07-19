import {v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export class User {
  private id: string;
  private email: string;
  private passwordHash: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(id: string, email: string, passwordHash: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(email: string, passwordHash: string): User {
    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    let hashedPassword;
    // Only hash if the password is not already hashed (i.e., when creating a new user)
    // This is a simplification; a more robust solution would involve checking for a specific hash format
    // or having separate factory methods for creating from raw password and from stored hash.
    if (passwordHash.length < 60) { // Assuming bcrypt hash is always longer than a raw password
      if (!User.isStrongPassword(passwordHash)) {
        throw new Error('Password is not strong enough');
      }
      hashedPassword = bcrypt.hashSync(passwordHash, 10);
    }
    return new User(uuidv4(), email, hashedPassword || passwordHash, new Date(), new Date());
  }

  updateEmail(newEmail: string): void {
    if (!User.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
    this.updatedAt = new Date();
  }

  updatePassword(newPasswordHash: string): void {
    if (!User.isStrongPassword(newPasswordHash)) {
      throw new Error('Password is not strong enough');
    }
    this.passwordHash = bcrypt.hashSync(newPasswordHash, 10);
    this.updatedAt = new Date();
  }

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }


  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isStrongPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }
}
