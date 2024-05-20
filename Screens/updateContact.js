import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'UserDatabase.db'});

const UpdateContactScreen = ({navigation, route}) => {
  const {data} = route.params;

  const [name, setName] = useState(data.name);
  const [mobile, setMobile] = useState(data.mobile_no);
  const [landline, setLandline] = useState(data.landline_no);
  const [photo, setPhoto] = useState(data.photo);
  const [nameError, setNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [landlineError, setLandlineError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(data.isFavorite);

  const updateContact = () => {
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
        'UPDATE table_user set user_name=?, user_contact=?, user_contact_landline=?, user_photo=?, user_favorite=? WHERE user_id=?',
        [name, mobile, landline, photo, isFavorite, data.id],
        (tx, res) => {
          navigation.goBack();
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        if (!image.cancelled) {
          setPhoto(image.path);
        }
      })
      .catch(error => {
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
        value={mobile.toString()}
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
        value={landline.toString()}
        onChangeText={text => setLandline(text)}
      />
      {landlineError ? (
        <Text style={{color: 'red', marginLeft: 10}}>
          Please enter valid landline number
        </Text>
      ) : null}
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
        <TouchableOpacity style={styles.updateButton} onPress={updateContact}>
          <Text style={styles.updateButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerImage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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
  updateButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateContactScreen;
