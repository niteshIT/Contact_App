import React, {useState, useEffect} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {useIsFocused} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
var db = openDatabase({name: 'UserDatabase.db'});
const AddContactScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');

  const [photo, setPhoto] = useState(
    'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-512.png',
  );
  const [nameError, setNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [landlineError, setLandlineError] = useState(false);
  const isFocused = useIsFocused();
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    return () => {
      // Reset all state variables when unmounting the component
      setName('');
      setMobile('');
      setLandline('');
      setPhoto(
        'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-512.png',
      );
      setNameError(false);
      setMobileError(false);
      setLandlineError(false);
      setIsFavorite(false);
    };
  }, [isFocused]);
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_contact_landline INT(10), user_photo TEXT, user_favorite BOOLEAN)',
              [],
            );
          } else {
            console.log('Already created');
          }
        },
      );
    });
  }, []);

  // Function to handle saving the contact
  const saveContact = () => {
    if (!name) {
      setNameError(true);
    }
    if (!mobile) {
      setMobileError(true);
    }
    if (!landline) {
      setLandlineError(true);
    }
    if (!name || !mobile || !landline) {
      return false;
    }
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_user( user_name, user_contact, user_contact_landline, user_photo, user_favorite) VALUES (?,?,?,?,?)',
        [name, mobile, landline, photo, isFavorite],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            console.log(res);
            navigation.goBack();
          } else {
            console.log(res);
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  // Function to handle selecting a photo
  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        if (!image.cancelled) {
          setPhoto(image.path);
        }
      })
      .catch(error => {
        // Handle the error here
        console.log('Image selection error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectPhoto}>
        <View style={styles.containerImage}>
          <Image source={{uri: photo}} style={styles.image} />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      {nameError ? (
        <Text style={{color: 'red', marginLeft: 10}}>
          Please enter valid name
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Mobile Phone"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={text => setMobile(text)}
      />
      {mobileError ? (
        <Text style={{color: 'red', marginLeft: 10}}>
          Please enter valid Mobile number
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Landline"
        keyboardType="phone-pad"
        value={landline}
        onChangeText={text => setLandline(text)}
      />
      {landlineError ? (
        <Text style={{color: 'red', marginLeft: 10}}>
          Please enter valid Landline number
        </Text>
      ) : null}
      {/* Favorite button */}
      <View style={{flexDirection: 'row', margin: 10}}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {backgroundColor: isFavorite ? 'red' : 'lightgrey'},
          ]}
          onPress={() => setIsFavorite(!isFavorite)}>
          <Text>{isFavorite ? 'Unfavorite' : 'Favorite'}</Text>
        </TouchableOpacity>
        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  containerImage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  image: {
    width: 100, // set your desired width
    height: 100, // set your desired height
    resizeMode: 'contain', // adjust the resizeMode as needed
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingHorizontal: 10,
  },

  favoriteButton: {
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddContactScreen;
