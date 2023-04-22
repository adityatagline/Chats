import * as Yup from 'yup';

export const emailValidationRule = Yup.string()
  .trim()
  .email('Enter valid e-mail address !!')
  .required('Enter e-mail address !!');

export const phoneValidationRule = Yup.string()
  .trim()
  .required('Enter phone number !!')
  .matches(/[\d]{10}/, 'Enter 10 digit mobile number !!')
  .min(10)
  .max(10);

export const passwordValidationRule = Yup.string()
  .trim()
  .min(8, 'Password must have atleast 8 characters !!')
  .max(20, 'Password must be less than 20 characters !!')
  .required('Enter password !!')
  .matches(/[a-z]/, 'Password must have atleast one lowercase alphabet')
  .matches(/[A-Z]/, 'Password must have atleast one uppercase alphabet')
  .matches(/[\d]/, 'Password must have atleast one digit');

export const otpValidationRule = Yup.string()
  .trim()
  .required('Enter otp !!')
  .matches(/[\d]{6}/, 'Enter 6 digit otp number !!')
  .max(6);

export const confirmPasswordValidationRule = Yup.string()
  .trim()
  .required('Enter password !!');

const fnameValidationRule = Yup.string()
  .trim()
  .required('Enter First Name !!')
  .matches(
    /^\S*$/,
    'First Name not contain any special characters or whitespace !!',
  )
  .matches(/^\D*$/, 'Name sould not contain any number !!')
  .min(3)
  .max(15);

const lnameValidationRule = Yup.string()
  .trim()
  .required('Enter Last Name !!')
  .matches(
    /^\S*$/,
    'First Name not contain any special characters or whitespace !!',
  )
  .matches(/^\D*$/, 'Name sould not contain any number !!')
  .min(3)
  .max(15);

const unameValidationRule = Yup.string()
  .trim()
  .required('Enter username !!')
  .min(6, 'Minimum 6 charachters are required')
  .max(20, 'Maximum 20 characters are allowed');

export const groupNameValidation = Yup.object({
  groupName: Yup.string()
    .trim()
    .required('Enter group name !!')
    .min(6, 'Minimum 6 charachters are required')
    .max(20, 'Maximum 20 characters are allowed'),
});

const ageValidationRule = Yup.string()
  .trim()
  .required('Enter age !!')
  .matches(/^\d*$/, 'Enter your age !!')
  .min(1)
  .max(3);

export const LoginValidationSchema = Yup.object({
  email: emailValidationRule,
  password: passwordValidationRule,
});

export const LoginValidationSchemaWithPhone = Yup.object({
  phone: phoneValidationRule,
  password: passwordValidationRule,
});

export const SignupValidationSchema = Yup.object({
  phone: phoneValidationRule,
  email: emailValidationRule,
  password: passwordValidationRule,
  password2: confirmPasswordValidationRule,
});

export const otpSchema = Yup.object({
  otp: otpValidationRule,
});

export const newUserDetails = Yup.object({
  firstName: fnameValidationRule,
  lastName: lnameValidationRule,
  age: ageValidationRule,
  userName: unameValidationRule,
});

export const EditProfileValidationSchema = Yup.object({
  firstName: fnameValidationRule,
  lastName: lnameValidationRule,
  age: ageValidationRule,
  email: emailValidationRule,
});
