'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [city, setCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const savedCity = localStorage.getItem('brickAndBoltCity');
    if (savedCity) {
      setCity(savedCity);
    } else {
      // If no city is saved, open the modal
      setIsModalOpen(true);
    }
    setIsLoaded(true);
  }, []);

  const handleSetCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('brickAndBoltCity', newCity);
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider value={{ city, setCity: handleSetCity, isModalOpen, setIsModalOpen, isLoaded }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
