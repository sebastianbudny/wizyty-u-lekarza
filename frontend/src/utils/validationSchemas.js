import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Nazwa użytkownika musi mieć minimum 3 znaki')
    .required('Nazwa użytkownika jest wymagana'),
  email: Yup.string()
    .email('Nieprawidłowy adres email')
    .required('Email jest wymagany'),
  password: Yup.string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .matches(/[a-z]/, 'Hasło musi zawierać małą literę')
    .matches(/[A-Z]/, 'Hasło musi zawierać dużą literę')
    .matches(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .matches(/[^a-zA-Z0-9]/, 'Hasło musi zawierać znak specjalny')
    .required('Hasło jest wymagane')
});