import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddSongForm = () => {
    const initialValues = {
        name: '',
        singer: '',
        musicDirector: '',
        albumName: '',
        restricted: '' // No default value
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        singer: Yup.string().required('Singer is required'),
        musicDirector: Yup.string().required('Music Director is required'),
        albumName: Yup.string().required('Album Name is required'),
        restricted: Yup.string().required('Restricted is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
            const response = await fetch('http://localhost:5000/songs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add song');
            }

            alert('Song added successfully');
            resetForm();
        } catch (error) {
            setErrors({ submit: error.message });
            console.error(error);
        }
        setSubmitting(false);
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center', // Changed to space-between
        padding: '10px',
        height: '360px'

    };

    return (
        <div >
            <h2>Add Song</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form style={formStyle}>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <Field type="text" id="name" name="name" />
                            <ErrorMessage name="name" component="div" />
                        </div>
                        <div>
                            <label htmlFor="singer">Singer:</label>
                            <Field type="text" id="singer" name="singer" />
                            <ErrorMessage name="singer" component="div" />
                        </div>
                        <div>
                            <label htmlFor="musicDirector">Music Director:</label>
                            <Field type="text" id="musicDirector" name="musicDirector" />
                            <ErrorMessage name="musicDirector" component="div" />
                        </div>
                        <div>
                            <label htmlFor="albumName">Album Name:</label>
                            <Field type="text" id="albumName" name="albumName" />
                            <ErrorMessage name="albumName" component="div" />
                        </div>
                        <div>
                            <label htmlFor="restricted">Restricted:</label>
                            <Field as="select" id="restricted" name="restricted">
                                <option value="">Select</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </Field>
                            <ErrorMessage name="restricted" component="div" />
                        </div>
                        <button className='btn btn-primary' type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Song'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddSongForm;
