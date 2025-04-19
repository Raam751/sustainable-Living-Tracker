// UserDataContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const UserDataContext = createContext();

const initialState = {
  profile: null,
  carbonFootprint: null,
  habits: [],
  challenges: [],
  isLoading: false,
  error: null
};

function userDataReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_CARBON_FOOTPRINT':
      return { ...state, carbonFootprint: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    // Additional cases...
    default:
      return state;
  }
}

export function UserDataProvider({ children }) {
  const [state, dispatch] = useReducer(userDataReducer, initialState);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'INITIALIZE', payload: parsedData });
    }
  }, []);
  
  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify({
      profile: state.profile,
      carbonFootprint: state.carbonFootprint,
      habits: state.habits,
      challenges: state.challenges
    }));
  }, [state.profile, state.carbonFootprint, state.habits, state.challenges]);
  
  return (
    <UserDataContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);