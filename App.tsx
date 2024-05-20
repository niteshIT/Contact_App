import React from 'react';
import ContactListScreen from './Screens/ContactListScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UpdateContactScreen from './Screens/updateContact';
import AddContactScreen from './Screens/AddContactScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FavoriteContactListScreen from './Screens/FavoriteContactListScreen';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
const StackNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="contactlist" component={ContactListScreen} />
      <Stack.Screen name="UpdateContact" component={UpdateContactScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
      <Stack.Screen
        name="FavoriteContact"
        component={FavoriteContactListScreen}
      />
    </Stack.Navigator>
  );
};
const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Contact List" component={ContactListScreen} />

      <Drawer.Screen
        name="Update Contact"
        component={UpdateContactScreen}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="Add Contact"
        component={AddContactScreen}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="Favorite Contact List"
        component={FavoriteContactListScreen}
      />
    </Drawer.Navigator>
  );
};
const App = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <DrawerNav />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
