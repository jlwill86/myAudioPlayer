// play audio
export const play = async (playbackObj, uri) => {
    try {
        await playbackObj.loadAsync({ uri }, { shouldPlay: true });
        const status = await playbackObj.getStatusAsync();
        console.log("playback status after play:", status);
        return playbackObj;
    } catch (error) {
        console.log("error playing audio", error.message);
    }
};

// pause audio
export const pause = async playbackObj => {
    try {
        const status = await playbackObj.pauseAsync();
        console.log("playback status after pause:", await playbackObj.getStatusAsync());
        return status;
    } catch (error) {
        console.log("error inside pause helper method audio", error.message);
    }
};

// resume audio
export const resume = async playbackObj => {
    try {
        const status = await playbackObj.playAsync();
        console.log("playback status after resume:", await playbackObj.getStatusAsync());
        return status;
    } catch (error) {
        console.log("error inside resume helper method audio", error.message);
    }
};

// select another audio file
export const playNext = async (playbackObj, uri) => {
    try {
        // Ensure current audio is stopped and unloaded
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        console.log("playback status after stop and unload:", await playbackObj.getStatusAsync());

        // Play new audio only after previous operations complete
        const status = await play(playbackObj, uri);
        console.log("playback status after play next:", await playbackObj.getStatusAsync());
        return status;
    } catch (error) {
        console.log("error inside play next audio", error.message);
    }
};