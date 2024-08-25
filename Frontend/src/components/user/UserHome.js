import React from 'react';
import SongList from './AllSongs';
import SearchSongs from './SearchSong';
import PlaylistSongs from './PlaylistsByUser';
import AddPlaylistForm from './AddPlaylist';
import AddSongToPlaylistForm from './AddSongToPlaylist';
import { useLocation } from 'react-router-dom';

const UserHome = () => {
    const location = useLocation();
    const userId = location.state ? location.state.userId : null;

    return (
        <div className='container'>
            <div className='row justify-content-around my-5'>
                <div className='col-md-4 my-3'>
                    <SongList />
                </div>
                <div className='col-md-4 my-3'>
                    <SearchSongs />
                </div>
                <div className='col-md-4 my-3'>
                    <PlaylistSongs userId={userId} />
                </div>
            </div>
            <div className='row justify-content-around my-5'>
                <div className='col-md-6 my-3'>
                    <AddPlaylistForm />
                </div>
                <div className='col-md-6 my-3'>
                    <AddSongToPlaylistForm />
                </div>
            </div>
        </div>
    );
};

export default UserHome;
