import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddSongToPlaylistForm = () => {
    const initialValues = {
        songName: '',
        playlistName: ''
    };

    const validationSchema = Yup.object().shape({
        songName: Yup.string().required('Song name is required'),
        playlistName: Yup.string().required('Playlist name is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/playlist/addsong', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            resetForm();
            alert('Song added to playlist successfully');
        } catch (error) {
            alert(error.message);
        }
        setSubmitting(false);
    };
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Changed to space-between
        padding: '10px',
        backgroundColor: 'red'
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
            <h2>Add Song to Playlist</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form style={formStyle}>
                        <div style={{ padding: '10px' }}>
                            <label htmlFor="songName">Song Name:</label>
                            <Field type="text" id="songName" name="songName" />
                            <ErrorMessage name="songName" component="div" />
                        </div>
                        <div style={{ padding: '10px' }}>
                            <label htmlFor="playlistName">Playlist Name:</label>
                            <Field type="text" id="playlistName" name="playlistName" />
                            <ErrorMessage name="playlistName" component="div" />
                        </div>
                        <button className="btn btn-warning" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Song to Playlist'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddSongToPlaylistForm;
