import React from 'react';
import { StatusBar } from 'react-native';
import Nav from './Screens/nav.js'; // This handles all screen navigation

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Nav />
    </>
  );
}
