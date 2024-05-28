class GetUserDto {
  constructor(user) {
    this.name = user.first_name;
    this.email = user.email;
    this.role = user.role;
    this.login = user.lastLogin;
  }
}

module.exports = GetUserDto;
