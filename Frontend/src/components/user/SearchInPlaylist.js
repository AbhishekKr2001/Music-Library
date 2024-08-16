import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SearchSongForm = ({ playlistId }) => {
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch('http://localhost:5000/playlist/searchPlaylist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playlistId: playlistId,
                    songName: values.songName
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred while searching for the song.');
            }

            setSearchResult(data.song);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            setSearchResult(null);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        songName: Yup.string().required('Song name is required')
    });

    const eachSongStyle = {
        padding: '10px',
        backgroundColor: 'white', // Changed background color to red
        borderRadius: '10px',
        margin: '10px',
        color: 'black'
    };

    return (
        <div>
            <Formik
                initialValues={{ songName: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label>
                            Song Name:
                            <Field type="text" name="songName" />
                        </label>
                        <ErrorMessage name="songName" component="div" className="error-message" />
                        <button className="btn btn-primary mx-1" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Searching...' : 'Search'}
                        </button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </Form>
                )}
            </Formik>

            {searchResult && (
                <div style={eachSongStyle}>
                    <h2>Song found in playlist:</h2>
                    <p>Name: {searchResult.name}</p>
                    {/* Add other properties of the song as needed */}
                </div>
            )}
        </div>
    );
};

export default SearchSongForm;
