import {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';

// البيانات الأولية من cities.json
const DEFAULT_CITIES = [
  {
    "id": "93a9",
    "cityName": "Zouerate",
    "country": "Mauritania",
    "emoji": "🇲🇷",
    "date": "2026-02-17T13:25:51.805Z",
    "notes": "",
    "position": {
      "lat": "22.370396344320053",
      "lng": "-10.173339843750002"
    }
  },
  {
    "id": "5002",
    "cityName": "Malem Hodar",
    "country": "Senegal",
    "emoji": "🇸🇳",
    "date": "2026-02-17T13:27:04.239Z",
    "notes": "",
    "position": {
      "lat": "14.200488387358346",
      "lng": "-15.249023437500002"
    }
  }
];

// تحميل البيانات من localStorage أو استخدام البيانات الأولية
function loadCities() {
  const stored = localStorage.getItem('worldwise-cities');
  return stored ? JSON.parse(stored) : DEFAULT_CITIES;
}

// حفظ البيانات في localStorage
function saveCities(cities) {
  localStorage.setItem('worldwise-cities', JSON.stringify(cities));
}

const CitiesContext = createContext(null);

const initialState = {
  cities: loadCities(),
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(
          (city) => city.id !== action.payload
        ),
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [
    { cities, isLoading, currentCity, error },
    dispatch,
  ] = useReducer(reducer, initialState);

  const getCity = useCallback(
    function getCity(id) {
      if (String(id) === String(currentCity.id)) return;

      dispatch({ type: 'loading' });
      try {
        const city = cities.find((c) => String(c.id) === String(id));
        if (city) {
          dispatch({ type: 'city/loaded', payload: city });
        } else {
          dispatch({
            type: 'rejected',
            payload: 'City not found',
          });
        }
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading the city',
        });
      }
    },
    [currentCity.id, cities]
  );

  function createCity(newCityObject) {
    dispatch({ type: 'loading' });
    try {
      const newCity = {
        ...newCityObject,
        id: Date.now().toString(16),
      };
      const updatedCities = [...cities, newCity];
      saveCities(updatedCities);
      dispatch({ type: 'city/created', payload: newCity });
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating the city',
      });
    }
  }

  function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      const updatedCities = cities.filter((c) => c.id !== id);
      saveCities(updatedCities);
      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      'CitiesContext was used outside the CitiesProvider'
    );
  return context;
}

export { CitiesProvider, useCities };
