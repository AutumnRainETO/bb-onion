import axios from 'axios';

const EVENT_ENDPOINT = '/api/event';

const CreateEventAPI = {
    post: (body) => new Promise((resolve, reject) => {
        axios.post(EVENT_ENDPOINT, body)
        .then(resolve)
        .catch(reject);
    })
}

export default CreateEventAPI;