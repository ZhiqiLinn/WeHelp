const LOAD_API_KEY = 'maps/LOAD_API_KEY';

const loadApiKey = (key) => ({
    type: LOAD_API_KEY,
    payload: key,
});

export const getKey = () => async (dispatch) => {
    const res = await fetch('/api/businesses/googlemapapi', {
        method: 'GET',
    });
    const data = await res.json();
    console.log(`from reducer line13 ${data}`);
    dispatch(loadApiKey(data.googleMapsAPIKey));
};

const initialState = { key: null };

const mapsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_API_KEY:
            return { key: action.payload };
        default:
            return state;
    }
};

export default mapsReducer;