// Spotify API
const { SPOTIFY } = require ('../config');

const axios = require('axios');


module.exports = class Spotify {

    constructor() {
        this.axios = axios.create({
            baseURL: SPOTIFY.BASE_URL
        });
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${SPOTIFY.ACCESS_TOKEN}`;
        this.axios.defaults.headers.common['Accept'] = 'application/json';
        this.axios.defaults.headers.common['Content-Type'] = 'application/json';
    }

    setToken(token) {
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    /**
     * add a song to the queue
     * @param {string} userInput
     * @returns {Promise}
     * @memberof Spotify
     */
    addSongToQueue(userInput) {
        return new Promise((resolve, reject) => {
            let id = this.parseInput(userInput); // parse user input
            if(id !== null){
                this.axios.post(`/me/player/queue?uri=spotify:track:${id}`)
                    .then(res => {
                        console.log(`Added ${id} to queue`);
                        resolve(id);
                    })
                    .catch(err => {
                        console.log(`Error adding ${id} to queue`);
                        reject(err);
                    });
            }else {
                reject("Unable to find song")
            }  
        })
    }

    /**
     * Add a song to the playlist
     * @param {string} userInput
     * @returns {Promise}
     * @memberof Spotify
     */
    addSongToPlaylist(userInput) {
        return new Promise((resolve, reject) => {
            let id = this.parseInput(userInput); // parse user input

            if(id !== null){
                this.axios.post(`/playlists/${SPOTIFY.PLAYLIST_ID}/tracks?uris=spotify:track:${id}`)
                    .then(res => {
                        console.log(`Added ${id} to playlist`);
                        resolve(res);
                    })
                    .catch(err => {
                        console.log(`Error adding ${id} to playlist`);
                        reject(err);
                    });
            } else {
                reject("Unable to find song")
            }  
        })
    }

    /**
     * Check if song is real
     * @param {string} userInput
     * @returns {Promise}
     * @memberof Spotify
    */
    checkSong(userInput) {
        return new Promise((resolve, reject) => {
            let id = this.parseInput(userInput); // parse user input
            if(id !== null){
                this.axios.get(`/tracks/${id}`)
                    .then(res => {
                        console.log(`Checked ${id}`);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log(`Error checking ${id}`);
                        resolve(false);
                    });
            } else {
                reject("Unable to find song")
            }  
        })
    }

    /**
     * Set the volume (input in percentage)
     * @param  {number} volume
     * @returns {Promise}
     * @memberof Spotify
     */
    setVolume(volume) {
        return new Promise((resolve, reject) => {
            this.axios.put(`/me/player/volume?volume_percent=${volume}`)
                .then(res => {
                    console.log(`Set volume to ${volume}`);	
                    resolve(res);
                })
                .catch(err => {
                    console.log(`Error setting volume to ${volume}`);
                    reject(err);
                });
        })
    }


    /**
     * Parse user input
     * @param {string} userInput
     * @returns {string}
     * @memberof Spotify
     */
    parseInput(userInput) {
        let regex = /https:\/\/open\.spotify\.com\/track\/.*/g;
        let matched = userInput.match(regex)
        let id
        if(matched !== null)
            id = matched.pop()
            .split('/').pop()
            .split('?').shift();
        console.log(`Parsed ${userInput} to ${id}`);
        if(id)
            return id;
        else
            return null
    }

    
}