import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Enter valid e-mail address !!')
    .required('Enter e-mail address !!'),
  password: Yup.string()
    .min(8, 'Password must have atleast 8 characters !!')
    .max(20, 'Password must be less than 20 characters !!')
    .required('Enter password !!')
    .matches(/[a-z]/, 'Password must have atleast one lowercase alphabet')
    .matches(/[A-Z]/, 'Password must have atleast one uppercase alphabet')
    .matches(/[\d]/, 'Password must have atleast one digit'),
});

export const LoginValidationSchemaWithPhone = Yup.object({
  phone: Yup.string()
    .required('Enter phone number !!')
    .matches(/[\d]/, 'Enter mobile number !!')
    .min(10)
    .max(13),
  password: Yup.string()
    .min(8, 'Password must have atleast 8 characters !!')
    .max(20, 'Password must be less than 20 characters !!')
    .required('Enter password !!')
    .matches(/[a-z]/, 'Password must have atleast one lowercase alphabet')
    .matches(/[A-Z]/, 'Password must have atleast one uppercase alphabet')
    .matches(/[\d]/, 'Password must have atleast one digit'),
});

export const SignupValidationSchema = Yup.object({
  phone: Yup.string()
    .required('Enter phone number !!')
    .matches(/[\d]{10}/, 'Enter 10 digit mobile number !!')
    .min(10)
    .max(10),
  email: Yup.string()
    .email('Enter valid e-mail address !!')
    .required('Enter e-mail address !!'),
  password: Yup.string()
    .min(8, 'Password must have atleast 8 characters !!')
    .max(20, 'Password must be less than 20 characters !!')
    .required('Enter password !!')
    .matches(/[a-z]/, 'Password must have atleast one lowercase alphabet')
    .matches(/[A-Z]/, 'Password must have atleast one uppercase alphabet')
    .matches(/[\d]/, 'Password must have atleast one digit'),
  password2: Yup.string().required('Enter password !!'),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .required('Enter otp !!')
    .matches(/[\d]{6}/, 'Enter 6 digit otp number !!')
    .max(6),
});

export const newUserDetails = Yup.object({
  firstName: Yup.string()
    .required('Enter First Name !!')
    .matches(
      /^\S*$/,
      'First Name not contain any special characters or whitespace !!',
    )
    .matches(/^\D*$/, 'Name sould not contain any number !!')
    .min(3)
    .max(15),
  lastName: Yup.string()
    .required('Enter Last Name !!')
    .matches(
      /^\S*$/,
      'Last Name not contain any special characters or whitespace !!',
    )
    .matches(/^\D*$/, 'Name sould not contain any number !!')
    .min(3)
    .max(20),
  age: Yup.string()
    .required('Enter age !!')
    .matches(/^\d*$/, 'Enter your age !!')
    .min(1)
    .max(3),
});
