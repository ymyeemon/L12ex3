import React,{useState, useEffect, use} from 'react';
import {TouchableOpacity, StatusBar, Button, StyleSheet, Text, View} from 'react-native';

import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 50,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },

  button: {
    backgroundColor: 'black',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});

export default function App() {

  const [isShaking, setIsShaking] = useState(false);
  const [mySound, setMySound] = useState();
  const [selectedSound, setSelectedSound] = useState(require('./323045__eitabyte__guitar_heavy_echo.wav'));

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(selectedSound);
    setMySound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const total = (x ** 2 + y ** 2 + z ** 2);
      if (total > 1.5) {
        if (!isShaking) {
          setIsShaking(true);
          playSound();
        } else {
          setIsShaking(false);
        }
      }
    });

    return () => subscription.remove();
  }, [selectedSound]);

  useEffect(() => {
    return mySound 
      ? () => {
        console.log('Unloading Sound');
        mySound.unloadAsync();
      }

      : undefined;
  }, [mySound]);

  return (
    <View style={styles.container}>
      <StatusBar />
      { isShaking && <Text style={styles.text}>SHAKE!</Text>}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => setSelectedSound(require('./288878__gellski__electrobass4.wav'))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Electro Bass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedSound(require('./323045__eitabyte__guitar_heavy_echo.wav'))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Guitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedSound(require('./555539__stwime__metallic_snare.mp3'))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Drum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
