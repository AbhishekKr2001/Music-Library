import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UpdateSongForm = ({ songId }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [formVisible, setFormVisible] = useState(false); // State to toggle form visibility

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        singer: Yup.string(),
        musicDirector: Yup.string(),
        albumName: Yup.string(),
        restricted: Yup.string()
    });

    useEffect(() => {
        // Fetch song details when component mounts
        const fetchSongDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/songs/${songId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch song details');
                }

                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.message);
                console.error(error);
            }
        };

        fetchSongDetails();
    }, [songId]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`http://localhost:5000/songs/${songId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update song');
            }

            alert('Song updated successfully');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error(error);
        }
        setSubmitting(false);
    };

    const toggleFormVisibility = () => {
        setFormVisible(!formVisible);
    };

    const formStyle = {
        display: formVisible ? 'flex' : 'none', // Change display based on formVisible state
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px'
    };

    return (
        <div>

            {!formVisible && (
                <button className='btn btn-info' onClick={toggleFormVisibility}>Show Update Form</button>
            )}
            {formVisible && (
                <Formik
                    initialValues={{
                        name: '',
                        singer: '',
                        musicDirector: '',
                        albumName: '',
                        restricted: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form style={formStyle}>
                            <div className='my-1'>
                                <label htmlFor="name">Song:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                            </div>
                            <div className='my-1'>
                                <label htmlFor="singer">Singer:</label>
                                <Field type="text" id="singer" name="singer" />
                                <ErrorMessage name="singer" component="div" />
                            </div>
                            <div className='my-1'>
                                <label htmlFor="musicDirector">Music Director:</label>
                                <Field type="text" id="musicDirector" name="musicDirector" />
                                <ErrorMessage name="musicDirector" component="div" />
                            </div>
                            <div className='my-1'>
                                <label htmlFor="albumName">Album Name:</label>
                                <Field type="text" id="albumName" name="albumName" />
                                <ErrorMessage name="albumName" component="div" />
                            </div>
                            <div className='my-1'>
                                <label htmlFor="restricted">Restricted:</label>
                                <Field as="select" id="restricted" name="restricted">
                                    <option value="">Select</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Field>
                                <ErrorMessage name="restricted" component="div" />
                            </div>
                            <button className='btn btn-warning my-1' type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Song'}
                            </button>
                            <button className='btn btn-info' onClick={toggleFormVisibility}>Hide Update Form</button>
                        </Form>
                    )}
                </Formik>
            )}
            {/* {errorMessage && <div>Error: {errorMessage}</div>} */}
        </div>
    );
};

export default UpdateSongForm;
