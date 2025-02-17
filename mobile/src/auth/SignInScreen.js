import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Button, Title } from "react-native-paper";
import MasterPassword from "../password/MasterPassword";
import TextInput from "../ui/TextInput";
import Styles from "../ui/Styles";
import { addError } from "../errors/errorsActions";
import { signIn } from "./authActions";
import routes from "../routes";

export class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  render() {
    const { email, password, isLoading } = this.state;
    const { navigation, settings, addError, signIn } = this.props;
    const { encryptMasterPassword } = settings;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={Styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={Styles.innerContainer}>
            <Title>Connect to Lesspass Database</Title>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(text) => this.setState({ email: text.trim() })}
            />
            <MasterPassword
              label={encryptMasterPassword ? "Master Password" : "Password"}
              masterPassword={password}
              hideFingerprint={!encryptMasterPassword}
              onChangeText={(password) => this.setState({ password })}
            />
            <Button
              compact
              icon={"account-circle"}
              mode="contained"
              style={Styles.loginSignInButton}
              disabled={isEmpty(email) || isEmpty(password) || isLoading}
              onPress={() => {
                this.setState({ isLoading: true });
                signIn(
                  {
                    email,
                    password,
                  },
                  encryptMasterPassword
                )
                  .then(() => navigation.navigate(routes.PASSWORD_GENERATOR))
                  .catch(() => {
                    this.setState({ isLoading: false });
                    let errorMessage =
                      "Unable to log in with provided credentials.";
                    if (encryptMasterPassword) {
                      errorMessage +=
                        " Your master password is encrypted. Uncheck this option in your settings if you don't use it.";
                    }
                    addError(errorMessage);
                  });
              }}
            >
              Sign In
            </Button>
            <Text>Don't have an account?</Text>
            <Button
              compact
              icon="account-circle"
              mode="outlined"
              style={Styles.loginSignUpButton}
              onPress={() => navigation.navigate(routes.SIGN_UP)}
            >
              Sign Up
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addError: (message) => dispatch(addError(message)),
    signIn: (credentials, encryptMasterPassword) =>
      dispatch(signIn(credentials, encryptMasterPassword)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
