/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ToastAndroid,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useLazyQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-spinkit';
import {CHECK_USER} from '../graphql/Queries';

import {useTheme} from '@react-navigation/native';

const SignInScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const showToast = () => {
    ToastAndroid.show('User not found', ToastAndroid.SHORT);
  };
  const {colors} = useTheme();

  const [getData] = useLazyQuery(CHECK_USER, {
    onCompleted: (data) => {
      if (data !== undefined) {
        if (data.Users.length === 0) {
          showToast();
        } else {
          // let Username = data.Users[0].usename;
          // let Password = data.Users[0].password;

          setLoading(false);
          _saveEmail();
          navigation.navigate('homePage');
        }
      }
    },
  });
  const _saveEmail = async () => {
    try {
      await AsyncStorage.setItem('username', data.username);
      await AsyncStorage.setItem('password', data.password);
      readData();
    } catch (error) {
      console.log(error);
    }
  };

  const readData = async () => {
    try {
      const userdata = await AsyncStorage.getItem('username');
      const userpassword = await AsyncStorage.getItem('password');

      if (userdata !== null) {
        console.log(userdata);
        console.log(userpassword);
      }
    } catch (e) {
      console.log(e);
      alert('Failed to fetch the data from storage');
    }
  };
  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const loginHandle = () => {
    setLoading(true);
    if (data.username.length == 0 || data.password.length == 0) {
      Alert.alert(
        'Wrong Input!',
        'Username or password field cannot be empty.',
        [{text: 'Okay'}],
      );
    } else {
      getData({variables: {username: data.username, password: data.password}});
    }
  };

  if (loading) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Spinner color={'#000'} isVisible={true} size={50} type="ThreeBounce" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#734b6d" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
            },
          ]}>
          <Text
            style={[
              styles.text_footer,
              {
                color: colors.text,
              },
            ]}>
            Username
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Username"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Username must be 4 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text
            style={[
              styles.text_footer,
              {
                color: colors.text,
                marginTop: 35,
              },
            ]}>
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Password"
              placeholderTextColor="#666666"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must be 8 characters long.
              </Text>
            </Animatable.View>
          )}

          <TouchableOpacity>
            <Text style={{color: '#42275a', marginTop: 15}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                loginHandle(data.username, data.password);
              }}>
              <LinearGradient
                colors={['#42275a', '#734b6d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}
              style={[
                styles.signIn,
                {
                  borderColor: '#734b6d',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#734b6d',
                  },
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#734b6d',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
