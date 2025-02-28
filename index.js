/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const defaultPokemon = {
    id: '249',
    name: 'lugia',
    url: 'https://pokeapi.co/api/v2/pokemon/249',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png',
};

AppRegistry.registerComponent(appName, () => props => (
  <App {...defaultPokemon} {...props}/>
));
