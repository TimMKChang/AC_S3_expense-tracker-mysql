function hasSpecialCharacters(formInput) {

  // avoid special characters
  const specialCharacters = /[\\^$*+?.():=![\]{}<>'"-/%]/
  if (specialCharacters.test(formInput)) {
    return true
  }

  return false

}

module.exports = hasSpecialCharacters
