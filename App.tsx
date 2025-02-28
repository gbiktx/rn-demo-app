/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Button,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import NativePokemonModule from './specs/NativePokemonModule';

type Pokemon = {
  id: string;
  name: string;
  url: string;
  sprite: string;
  favorite: boolean;
};

type PokemonDetails = {
  name: string;
  weight: number;
  cries: {latest: string; legacy: string};
  stats: {base_stat: number; stat: Item}[];
  types: {type: Item}[];
  sprites: {front_default: string; front_shiny: string};
  abilities: {ability: Item}[];
};

type Item = {
  name: string;
  url: string;
};

function App(pokemon: Pokemon): React.JSX.Element {
  const [isFavorite, setFavorite] = useState(pokemon.favorite);
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(pokemon.url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white}}>
      <StatusBar />
      <ScrollView automaticallyAdjustContentInsets>
        <AppBar />
        <View style={styles.divider} />
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <View style={styles.pokemonTitle}>
            <Text style={styles.sectionTitle}># {pokemon.id}</Text>
            <View style={{width: 100}}>
              <Button
                title="Favorite"
                color={isFavorite ? 'black' : 'gray'}
                onPress={() => {
                  NativePokemonModule?.setFavorite(!isFavorite);
                  setFavorite(!isFavorite);
                }}
              />
            </View>
          </View>
          <Image source={{uri: pokemon.sprite}} style={styles.sprite} />
          <Text style={{...styles.sectionTitle, alignSelf: 'center'}}>
            {pokemon.name.toUpperCase()}
          </Text>
          {loading && <ActivityIndicator size="large" color="blue" />}
          {!loading &&
            (data != null ? (
              <DetailsSetion {...data} />
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Text>Unable to load data</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function AppBar(): React.JSX.Element {
  return (
    <View style={styles.appBarContainer}>
      <View style={styles.appBarLeader}>
        <Button
          title="Back"
          color={'gray'}
          onPress={() => {
            NativePokemonModule?.exit();
          }}
        />
      </View>
      <Text style={styles.appBarTitle}>React Native Demo</Text>
    </View>
  );
}

function DetailsSetion(details: PokemonDetails): React.JSX.Element {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.otherSpritesContainer}>
        <Image
          source={{uri: details.sprites.front_default}}
          style={styles.otherSprites}
        />
        <Image
          source={{uri: details.sprites.front_shiny}}
          style={styles.otherSprites}
        />
      </View>
      <View style={styles.sectionContainer}>
        <View>
          <Text style={styles.sectionTitle}>Weight</Text>
          <Text style={styles.attribute}>{details?.weight} lb</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.row}>
            {details?.types[0] != null && (
              <Text style={styles.attribute}>
                {details?.types[0]?.type.name.toUpperCase()}
              </Text>
            )}
            {details?.types[1] != null && (
              <Text style={styles.attribute}>
                {' '}
                | {details?.types[1]?.type.name.toUpperCase()}
              </Text>
            )}
          </View>
        </View>
      </View>
      <Divider />
      <Text style={styles.sectionTitle}>Stats</Text>
      {details?.stats.map(item => (
        <View key={item.stat.name} style={{marginTop: 6}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{item.stat.name.replace('-', ' ').toUpperCase()}</Text>
            <Text style={styles.statValue}>{item.base_stat}</Text>
          </View>
          <StatBar value={item.base_stat} />
        </View>
      ))}
      <Divider />
      <Text style={styles.sectionTitle}>Abilities</Text>
      <View style={styles.row}>
        {details?.abilities.map(item => (
          <View key={item.ability.name} style={styles.chip}>
            <Text>{item.ability.name.replace('-', '').toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Divider(): React.JSX.Element {
  return <View style={styles.divider} />;
}

function StatBar({value}): React.JSX.Element {
  const {width} = useWindowDimensions();
  const MAX_STAT = 255;

  const widthAnim = useAnimatedValue(0);
  const finalValue = width * (value / MAX_STAT);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: finalValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [finalValue, widthAnim]);

  return (
    <View style={{...styles.baseStatBar, width: width - 48}}>
      <Animated.View
        style={{
          ...styles.statBar,
          width: widthAnim,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  appBarContainer: {
    marginLeft: 24,
    marginTop: 18,
    flexDirection: 'row',
  },
  appBarTitle: {
    fontSize: 24,
  },
  appBarLeader: {
    width: 70,
    marginRight: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'gray',
    marginVertical: 18,
  },
  scrollview: {
    padding: 12,
    borderRadius: 12,
  },
  sprite: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  otherSprites: {
    width: 80,
    height: 80,
  },
  otherSpritesContainer: {
    width: '50%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  pokemonTitle: {
    marginTop: 8,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    marginTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    marginTop: 32,
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 22,
  },
  attribute: {
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  baseStatBar: {
    backgroundColor: 'lightgray',
    height: 8,
    borderRadius: 12,
    marginEnd: 24,
  },
  statBar: {
    backgroundColor: 'green',
    height: 8,
    borderRadius: 12,
    marginEnd: 24,
  },
  chip: {
    marginTop: 6,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    marginLeft: 8,
  },
});

export default App;
