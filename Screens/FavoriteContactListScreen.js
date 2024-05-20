import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// Open the database
let db = openDatabase({name: 'UserDatabase.db'});
const FavoriteContactListScreen = ({navigation}) => {
  const [favList, setFavList] = useState([]);
  const isFocused = useIsFocused();
  const fetchFavoriteContacts = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user WHERE user_favorite = 1',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFavList(temp);
        },
      );
    });
  };
  useEffect(() => {
    fetchFavoriteContacts();
  }, [isFocused]);
  // Function to render each favorite contact item
  const renderFavoriteContactItem = ({item}) => (
    <View style={styles.contactItemContainer}>
      <Image source={{uri: item.user_photo}} style={styles.contactImage} />
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.user_name}</Text>
        <Text style={styles.contactNumber}>{item.user_contact}</Text>
      </View>
    </View>
  );
  const sortedFavList = favList.sort((a, b) => {
    const nameA = a.user_name.toLowerCase();
    const nameB = b.user_name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return (
    <View style={styles.container}>
      <FlatList
        // eslint-disable-next-line no-undef
        data={sortedFavList}
        renderItem={renderFavoriteContactItem}
        // keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contactItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#888',
  },
});

export default FavoriteContactListScreen;
