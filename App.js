import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './Final/Welcome'



import FlatCards from './components/FlatCards'
import ElevatedCards from './components/ElevatedCards'
import FancyCard from './components/FancyCard'
import ActionCard from './components/ActionCard'
import ContactList from './components/ContactList'
import AddCity from './Final/AddCity'
import SignInScreen from './Final/SignInScreen';
import SignUpScreen from './Final/SignUpScreen';


const Stack = createStackNavigator();

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('SignUp');

  const renderScreen = () => {
    if (currentScreen === 'SignUp') {
      return <SignUpScreen navigate={setCurrentScreen} />;
    } else if (currentScreen === 'SignIn') {
      return <SignInScreen navigate={setCurrentScreen} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

    // <SafeAreaView>
    //   <AddCity/>
    //   {/* <ScrollView>
    // <View>
    //   <FlatCards />
    //   <ElevatedCards />
    //   <FancyCard />
    //   <ActionCard />
    //   <ContactList />
    // </View>
    //   </ScrollView> */}
    // </SafeAreaView>
  


export default App