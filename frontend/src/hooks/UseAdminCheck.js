const useAdminCheck = (user) => {
  const admins = ['theboilerplatelife@gmail.com'];

  return admins.find(admin => admin === user.email);
}

export default useAdminCheck;
