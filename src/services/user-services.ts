import {UserService} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {repository} from "@loopback/repository";
import {HttpErrors} from "@loopback/rest";
import {securityId, UserProfile} from "@loopback/security";
import {PasswordHasherBindings} from "../keys";
import {User} from "../models";
import {Credentials, UserRepository} from "../repositories";
import {PasswordHasher} from "./hash.password.bcryptjs";

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {username: credentials.username},
    });


    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with email ${credentials.username} not found.`,
      );
    }

    if (foundUser.deletedAt) {
      throw new HttpErrors.Unauthorized('The user is deleted.');
    }

    if (!foundUser.password) {
      // devolver este usuario no tiene contraseña
      throw new HttpErrors.Unauthorized('The password is not exist.');
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('The credentials are not valid.');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    user.password = '';
    return {[securityId]: user.id ?? '', name: user.name, id: user.id};
  }
}
