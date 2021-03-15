const errors = {};
exports.validateAdvisorRegister = (data) => {
  if (
    !data.name ||
    !data.photo_url ||
    data.name === "" ||
    data.photo_url === ""
  ) {
    errors["inputError"] = "Fields not provided";
  }
  return Object.keys(errors).length === 0;
};

exports.validateUserInputRegister = (data) => {
  if (
    !data.name ||
    !data.email ||
    !data.password ||
    data.name === "" ||
    data.email === ""
  ) {
    errors["inputError"] = "Fields not provided";
  }
  return Object.keys(errors).length === 0;
};

exports.validateUserInputLogin = (data) => {
  if (!data.email || !data.password || data.email === "") {
    errors["inputError"] = "Fields not provided";
  }
  return Object.keys(errors).length === 0;
};
