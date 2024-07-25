import React from 'react';
import AddSongForm from './AddSong';
import SongsByAdmin from './SongByAdmin';

export default function AdminHome() {
    return (
        <div className='container'>
            <div className='row justify-content-center my-5'>
                <div className='col-md-6'>
                    <div className='p-3  rounded'>
                        <SongsByAdmin />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='p-3 bg-white rounded'>
                        <AddSongForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
