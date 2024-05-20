import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import {Swipeable} from 'react-native-gesture-handler';

// Open the database
let db = openDatabase({name: 'UserDatabase.db'});

const ContactListScreen = props => {
  const [userList, setUserList] = useState([]);
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState('');
  const [swipeableOpen, setSwipeableOpen] = useState(null);

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM table_user', [], (tx, res) => {
        var temp = [];
        for (let i = 0; i < res.rows.length; ++i) {
          temp.push(res.rows.item(i));
        }
        temp.sort();
        setUserList(temp);
      });
    });
  };
  const rightSwipe = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          height: 100,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.swipeButton}
          onPress={() =>
            props.navigation.navigate('Update Contact', {
              data: {
                name: item.user_name,
                mobile_no: item.user_contact,
                landline_no: item.user_contact_landline,
                photo: item.user_photo,
                isFavorite: item.user_favorite,
                id: item.user_id,
              },
            })
          }>
          <Image
            source={require('../images/edit.png')}
            style={{width: 30, height: 30, tintColor: '#fff'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeButton, {backgroundColor: 'red'}]}
          onPress={() => deleteUser(item.user_id)}>
          <Image
            source={require('../images/recycle-bin-icon.png')}
            style={{width: 30, height: 30, tintColor: '#fff'}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const deleteUser = id => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM table_user WHERE user_id = ?',
        [id],
        (tx, res) => {
          getData(); // Refresh the list after deletion
        },
        error => {
          console.log(error);
        },
      );
    });
  };
  const closeSwipeableAfterTimeout = swipeableRef => {
    setTimeout(() => {
      swipeableRef.close();
      setSwipeableOpen(null);
    }, 2000); // Close swipeable after 2 seconds
  };

  const renderContactItem = ({item}) => (
    <Swipeable
      renderRightActions={() => rightSwipe({item})}
      onSwipeableWillOpen={() => setSwipeableOpen(item.user_id)}
      onSwipeableClose={() => setSwipeableOpen(null)}
      ref={ref => {
        if (ref && swipeableOpen === item.user_id) {
          closeSwipeableAfterTimeout(ref);
        }
      }}>
      <View style={styles.contactItemContainer}>
        <Image source={{uri: item.user_photo}} style={styles.contactImage} />
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.user_name}</Text>
          <Text style={styles.contactNumber}>{item.user_contact}</Text>
        </View>
      </View>
    </Swipeable>
  );

  // Filter the userList based on searchQuery
  const filteredUserList = userList.filter(user => {
    return user.user_name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const sortedFilteredUserList = filteredUserList.sort((a, b) => {
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
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      {/* FlatList to display contacts */}
      <FlatList
        data={sortedFilteredUserList}
        renderItem={renderContactItem}
        keyExtractor={item => item.user_id.toString()}
      />
      {/* Add and favorite buttons */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => props.navigation.navigate('Add Contact')}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
    marginRight: 30,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  swipeButton: {
    width: 80,
    height: 80,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    borderRadius: 5,
    marginRight: 1,
  },
});

export default ContactListScreen;
