import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './Contents/Forms/Login'
import Welcome from './Final/Welcome'
import HomeScreen from './Contents/Forms/HomeScreen'
import Calculator from './Contents/Forms/Calculator'
import SignUpScreen from './Final/SignUpScreen'
import SignInScreen from './Final/SignInScreen'
import Hassan from './Contents/Forms/Hassan'
import Signup from './Contents/Forms/Signup'
import Paratice from './Contents/Forms/Paratice'
import Task3p from './Contents/Forms/Task3p'
import Dropdown from './Contents/Forms/Dropdown'
import Quiz from './Contents/Forms/Quiz'
import EmployeList from './Contents/Forms/EmployeList'
import Task4 from './Contents/Forms/Task4'
import UseEffect from './Contents/Forms/UseEffect'
import RestaurantMenu from './Contents/Forms/RestaurantMenu'
import Task2 from './Contents/Forms/Task2'
import RM from './Contents/Forms/RM'
import Car_Parking from './Contents/Forms/Car_Parking'
import TestCar from './Contents/Forms/TestCar'
import PaperP from './Contents/Forms/PaperP'
import Image from './Contents/Forms/Image'
import ImagePicker from './Contents/Forms/ImagePicker'
import Database_Image from './Contents/Forms/Aftermid/Database_Image'
import Camera from './Final/Camera'
import ShowEmp from './Contents/Forms/Aftermid/ShowEmp'
import Testapi from './Contents/Forms/Aftermid/Testapi'


import AdminDashboard from './Final/AdminDashboard'
import AdminProfile from './Final/AdminProfile'

import ManageCity from './Final/ManageCity'
import AddCity from './Final/AddCity'
import DeleteCity from './Final/DeleteCity'

import ManagePlace from './Final/ManagePlace'
import AddPlace from './Final/AddPlace'
import DeletePlace from './Final/DeletePlace'

import ManageDirection from './Final/ManageDirection'
import AddDirection from './Final/AddDirection'
import DeleteDirection from './Final/DeleteDirection'

import ManageWarden from './Final/ManageWarden';
import AddTrafficWarden from './Final/AddTrafficWarden';
import DeleteTrafficWarden from './Final/DeleteTrafficWarden';
import CameraDetection from './Final/CameraDetection';


import ManageCamera from './Final/ManageCamera';
import AddCamera from './Final/AddCamera';
import DeleteCamera from './Final/DeleteCamera';



import DeleteNaka from './Final/DeleteNaka'

import ASinIn from './Contents/Forms/Aftermid/Navigation/ASinIn'
import ASignUp from './Contents/Forms/Aftermid/Navigation/ASignUp'
import AHome from './Contents/Forms/Aftermid/Navigation/AHome'
import SignInLAb from './Contents/Forms/Aftermid/Navigation/SignInLAb'
import Students from './Contents/Forms/Aftermid/Navigation/SharePraferencess/Students';
import Hassan1 from './Contents/Forms/Hassan1';
import SharedPrefrence from './Contents/Forms/Aftermid/Navigation/SharePraferencess/SharedPrefrence';
import LoginHandle, { MainScreen } from './Contents/Forms/Aftermid/Navigation/SharePraferencess/LoginHandle';
import Map from './Contents/Forms/Aftermid/Navigation/Map/Map'
import UserInfoScreen from './Contents/Forms/Aftermid/Navigation/SharePraferencess/UserInfoScreen';
import ManageNaka from './Final/ManageNaka';
import AddNaka from './Final/AddNaka';

import ManageShift from './Final/ManageShift';
import AddShift from './Final/AddShift';
import ManageViolations from './Final/ManageViolations';
import AddViolation from './Final/AddViolation';
import UpdateViolation from './Final/UpdateViolation';
import EditViolation from './Final/EditViolation';
import CameraNaka from './Final/CameraNaka';
import DutyRoster from './Final/DutyRoster';
import Role from './Final/Role';
import CameraUpload from './Final/CameraUpload';


import WardenSignInScreen from './Final/WardenSignINScreen';
import WardenDashboard from './Final/WardenDashboard';
import ViolationHistory from './Final/warden/ViolationHistory';
import ViewDetails from './Final/warden/ViewDetails';
import WardenNotification from './Final/warden/WardenNotification';

import CreateChallan from './Final/warden/CreateChallan';
import ChallanHistory from './Final/warden/ChallanHistory';
import ChallanDetail from './Final/warden/ChallanDetail';
import WardenProfile from './Final/WardenProfile';
import SelectLinkNaka from './Final/SelectLinkNaka';
import LinkNakaWithNaka from './Final/LinkNakaWithNaka';



import UserDashboard from './Final/User/UserDashboard';
import UserProfile from './Final/User/UserProfile';
import ViewChallans from './Final/User/ViewChallans';
import UserNotification from './Final/User/UserNotification';
import TrafficRules from './Final/User/TrafficRules';
import ChallanDetails from './Final/User/ChallanDetails';


const Stack = createStackNavigator();


const AppPro = () => {

  var fipAdd = '192.168.118.34:4321';
  global.furl = `http://${fipAdd}/`
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Role"
          component={Role}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DutyRoster"
          component={DutyRoster}
          options={{ title: 'Duty Roster', headerShown: false }}
        />
        <Stack.Screen
          name="AdminProfile"
          component={AdminProfile}
          options={{ title: 'Admin Profile', headerShown: false }}
        />

        <Stack.Screen
          name="ManageCity"
          component={ManageCity}
          options={{ title: 'Manage City', headerShown: false }}
        />
        <Stack.Screen
          name="AddCity"
          component={AddCity}
          options={{ title: 'Add City', headerShown: false }}
        />
        <Stack.Screen
          name="DeleteCity"
          component={DeleteCity}
          options={{ title: 'Delete City', headerShown: false }}
        />


        <Stack.Screen
          name="ManagePlace"
          component={ManagePlace}
          options={{ title: 'Manage Place', headerShown: false }}
        />
        <Stack.Screen
          name="AddPlace"
          component={AddPlace}
          options={{ title: 'Add Place', headerShown: false }}
        />
        <Stack.Screen
          name="DeletePlace"
          component={DeletePlace}
          options={{ title: 'Delete Place', headerShown: false }}
        />


        <Stack.Screen
          name="ManageDirection"
          component={ManageDirection}
          options={{ title: 'Manage Direction', headerShown: false }}
        />
        <Stack.Screen
          name="AddDirection"
          component={AddDirection}
          options={{ title: 'Add Direction', headerShown: false }}
        />
        <Stack.Screen
          name="DeleteDirection"
          component={DeleteDirection}
          options={{ title: 'Delete Direction', headerShown: false }}
        />




        <Stack.Screen
          name="ManageWarden"
          component={ManageWarden}
          options={{ title: 'Add City', headerShown: false }}
        />
        <Stack.Screen
          name="AddTrafficWarden"
          component={AddTrafficWarden}
          options={{ title: 'Add Traffic Warden', headerShown: false }}
        />
        <Stack.Screen
          name="DeleteTrafficWarden"
          component={DeleteTrafficWarden}
          options={{ title: 'Delete Traffic Warden', headerShown: false }}
        />



        <Stack.Screen
          name="ManageCamera"
          component={ManageCamera}
          options={{ title: 'Manage Camera', headerShown: false }}
        />
        <Stack.Screen
          name="AddCamera"
          component={AddCamera}
          options={{ title: 'Add Camera', headerShown: false }}
        />
         <Stack.Screen
          name="DeleteCamera"
          component={DeleteCamera}
          options={{ title: 'Delete Camera', headerShown: false }}
        />




        <Stack.Screen
          name="ManageNaka"
          component={ManageNaka}
          options={{ title: 'Manage Naka', headerShown: false }}
        />
        <Stack.Screen
          name="AddNaka"
          component={AddNaka}
          options={{ title: 'Add Naka', headerShown: false }}
        />
        <Stack.Screen
          name="DeleteNaka"
          component={DeleteNaka}
          options={{ title: 'Delete Naka', headerShown: false }}
        />
        <Stack.Screen
          name="SelectLinkNaka"
          component={SelectLinkNaka}
          options={{ title: 'Select LinkNaka', headerShown: false }}
        />
        <Stack.Screen
          name="LinkNakaWithNaka"
          component={LinkNakaWithNaka}
          options={{ title: 'Link Naka With Naka', headerShown: false }}
        />




        <Stack.Screen
          name="CameraNaka"
          component={CameraNaka}
          options={{ title: 'Camera Naka', headerShown: false }}
        />
        <Stack.Screen
          name="CameraDetection"
          component={CameraDetection}
          options={{ title: 'Camera Detection', headerShown: false }}
        />
        <Stack.Screen
          name="ManageViolations"
          component={ManageViolations}
          options={{ title: 'Manage Violations', headerShown: false }}
        />
        <Stack.Screen
          name="AddViolation"
          component={AddViolation}
          options={{ title: 'Add Violation', headerShown: false }}
        />
        <Stack.Screen
          name="UpdateViolation"
          component={UpdateViolation}
          options={{ title: 'Update Violation', headerShown: false }}
        />
        <Stack.Screen
          name="EditViolation"
          component={EditViolation}
          options={{ title: 'Edit Violation', headerShown: false }}
        />


        <Stack.Screen
          name="ManageShift"
          component={ManageShift}
          options={{ title: 'Manage Shift', headerShown: false }}
        />
        <Stack.Screen
          name="AddShift"
          component={AddShift}
          options={{ title: 'Add Shift', headerShown: false }}
        />
        <Stack.Screen
          name="CameraUpload"
          component={CameraUpload}
          options={{ title: 'Camera Upload', headerShown: false }}
        />





        <Stack.Screen
          name="WardenSignInScreen"
          component={WardenSignInScreen}
          options={{ title: 'Warden SignInScreen', headerShown: false }}
        />
        <Stack.Screen
          name="WardenDashboard"
          component={WardenDashboard}
          options={{ title: 'Warden Dashboard', headerShown: false }}
        />
        <Stack.Screen
          name="ViolationHistory"
          component={ViolationHistory}
          options={{ title: 'Violation History', headerShown: false }}
        />
        <Stack.Screen
          name="ViewDetails"
          component={ViewDetails}
          options={{ title: 'View Details', headerShown: false }}
        />
        <Stack.Screen
          name="CreateChallan"
          component={CreateChallan}
          options={{ title: 'Create Challan', headerShown: false }}
        />

        <Stack.Screen
          name="ChallanHistory"
          component={ChallanHistory}
          options={{ title: 'Challan History', headerShown: false }}
        />
        <Stack.Screen
          name="ChallanDetail"
          component={ChallanDetail}
          options={{ title: 'Challan Detail', headerShown: false }}
        />

        <Stack.Screen
          name="WardenProfile"
          component={WardenProfile}
          options={{ title: 'Warden Profile', headerShown: false }}
        />
        <Stack.Screen
          name="WardenNotification"
          component={WardenNotification}
          options={{ title: 'Warden Notification', headerShown: false }}
        />





        <Stack.Screen
          name="UserDashboard"
          component={UserDashboard}
          options={{ title: 'User Dashboard', headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: 'User Profile', headerShown: false }}
        />
        <Stack.Screen
          name="UserNotification"
          component={UserNotification}
          options={{ title: 'User Notification', headerShown: false }}
        />
        <Stack.Screen
          name="TrafficRules"
          component={TrafficRules}
          options={{ title: 'TrafficRules', headerShown: false }}
        />
        <Stack.Screen
          name="ViewChallans"
          component={ViewChallans}
          options={{ title: 'View Challans', headerShown: false }}
        />
        <Stack.Screen
          name="ChallanDetails"
          component={ChallanDetails}
          options={{ title: 'Challan Details', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>




    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="SignIn">
    //     <Stack.Screen name="SignIn" component={ASinIn} />
    //     <Stack.Screen name="SignUp" component={ASignUp} />
    //     <Stack.Screen name="Home" component={AHome} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="SignInLAb">
    //     <Stack.Screen name="SignInLAb" component={SignInLAb} options={{headerShown: false}} />
    //     <Stack.Screen name="SignUp" component={ASignUp} />
    //     <Stack.Screen name="Home" component={AHome} />
    //   </Stack.Navigator>
    // </NavigationContainer>



    //<Login/>
    //<HomeScreen />
    //<Calculator />


    //<Welcome/>
    //<SignUpScreen/>
    //<SignInScreen/>


    //<AddCity/>
    //<AddPlace/>
    //<AddDirection/>
    //<AdminDashboard/>


    //<Signup/>
    // <Task2/>
    //<Dropdown/>
    //<Paratice/>
    //<Task3p/>
    //<Quiz/>
    //<EmployeList/>
    //<Task4/>
    //<UseEffect/>
    //<RestaurantMenu/>
    //<RM/>
    //<Car_Parking />
    //<TestCar />
    //<PaperP/>
    //<Image/>
    //<ImagePicker/>
    //<Database_Image/>
    //<ShowEmp/>
    //<Camera/>
    // <Testapi/>

  )
}



export default AppPro