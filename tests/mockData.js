const userRegData = {
  firstName: "Test",
  lastName: "Name",
  username: "testuser",
  email: "test@mail.com",
  password: "testpassword",
  password2: "testpassword",
};

const incorrectRegData = {
  lastName: "Ikechukwu",
  email: "testEmail@gmail.com",
  password: "testpassword",
  password2: "testpassword",
};

const userLoginData = {
  username: "testuser",
  password: "testpassword",
};

const postCreateData = {
  title: "Test Post",
  description: "This is post is only for testing purposes",
  body: "This is the test post body",
};

const incorrectPostCreateData = {
  description: "This test is going to fail by design",
};

module.exports = {
  userRegData,
  incorrectRegData,
  userLoginData,
  postCreateData,
  incorrectPostCreateData,
};
