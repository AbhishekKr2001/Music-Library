import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterForm = () => {
    const initialValues = {
        email: '',
        phone: '',
        password: '',
        role: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone is required'),
        password: Yup.string().required('Password is required'),
        role: Yup.string().required('Role is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const responseData = await response.json(); // Parse response body

            if (!response.ok) {
                if (response.status === 400 && responseData.message === 'User already exists') {
                    alert('User already exists');
                } else {
                    throw new Error('Failed to register user');
                }
            } else {
                alert('User registered successfully');
                resetForm();
            }
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
        setSubmitting(false);
    };

    return (
        <div className='div'>
            <div className='div1'>
                <h2>Register</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <Field type="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="error-message" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone:</label>
                                <Field type="text" name="phone" className="form-control" />
                                <ErrorMessage name="phone" component="div" className="error-message" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <Field type="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="error-message" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role:</label>
                                <Field as="select" name="role" className="form-control">
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="error-message" />
                            </div>
                            <button type="submit" className="btn btn-primary my-2" disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RegisterForm;
