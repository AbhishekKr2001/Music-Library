import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddPlaylistForm = () => {
    const initialValues = {
        playlistName: ''
    };

    const validationSchema = Yup.object().shape({
        playlistName: Yup.string()
            .min(3, 'Playlist name must be at least 3 characters')
            .max(50, 'Playlist name must be at most 50 characters')
            .required('Playlist name is required')
    });

    const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: values.playlistName }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ submit: errorData.message });
            } else {
                resetForm();
            }
        } catch (error) {
            setErrors({ submit: 'An error occurred while adding the playlist' });
        } finally {
            setSubmitting(false);
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Changed to space-between
        padding: '10px'
    };

    const songsStyle = {
        padding: '10px',
        backgroundColor: 'red', // Changed background color to red
        borderRadius: '10px',
        width: '100%',
        height: '300px'
    };

    return (
        <div style={songsStyle}>
            <h2>Add New Playlist</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form style={formStyle}>
                        <div style={{ padding: '10px' }}>
                            <label htmlFor="playlistName">Playlist Name:</label>
                            <Field
                                type="text"
                                id="playlistName"
                                name="playlistName"
                                required
                            />
                            <ErrorMessage name="playlistName" component="div" style={{ color: 'white' }} />
                        </div>
                        <button className="btn btn-warning" type="submit" disabled={isSubmitting}>Add Playlist</button>
                        <ErrorMessage name="submit" component="div" style={{ color: 'white' }} />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddPlaylistForm;
