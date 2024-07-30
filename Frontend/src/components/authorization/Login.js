import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
        role: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
        role: Yup.string().required('Role is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.message === 'User not found') {
                    throw new Error('User not found');
                } else if (response.status === 400 && data.message === 'Invalid password') {
                    throw new Error('Invalid password');
                } else {
                    throw new Error('Failed to login');
                }
            }

            const { token, userId } = data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            if (values.role === 'user') {
                navigate("/userHome", { state: { userId } });
            } else if (values.role === 'admin') {
                navigate("/adminHome");
            }

            alert('User Login Successfully');
            resetForm();
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
        setSubmitting(false);
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px'
    };

    return (
        <div className='div'>
            <div className='div1'>
                <h2>Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form style={formStyle}>
                            <div style={{ padding: '10px' }}>
                                <label>Email:</label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component="div" />
                            </div>
                            <div style={{ padding: '10px' }}>
                                <label>Password:</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <div style={{ padding: '10px' }}>
                                <label>Role:</label>
                                <Field as="select" name="role">
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Field>
                                <ErrorMessage name="role" component="div" />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginForm;
