import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Button, RadioButton, Checkbox } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';  // Importing SelectList

const PaperP = () => {
  const [checkedNews, setCheckedNews] = useState(false);
  const [checkedSports, setCheckedSports] = useState(false);
  const [checkedPolitics, setCheckedPolitics] = useState(false);
  const [checkedCricket, setCheckedCricket] = useState(false);
  const [checkedHockey, setCheckedHockey] = useState(false);
  const [checkedFootball, setCheckedFootball] = useState(false);

  const handleSubmit = () => {
    // Collect selected options and handle them
    console.log({
      Interests: {
        News: checkedNews,
        Sports: checkedSports,
        Politics: checkedPolitics,
        Cricket: checkedCricket,
        Hockey: checkedHockey,
        Football: checkedFootball,
      },
    });
    alert('Form Submitted!');
  };

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.headertxt}>Social App</Text>
      </View>
      <Text style={styles.text}>Registration</Text>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" />

      {/* Radio Button Section */}
      <View style={styles.radiobuttoncontainer}>
        <View style={styles.radiobutton}>
          <RadioButton />
          <Text style={styles.radioText}>Male</Text>
        </View>
        <View style={styles.radiobutton}>
          <RadioButton />
          <Text style={styles.radioText}>Female</Text>
        </View>
      </View>

      {/* Country Dropdown */}
      <Text style={styles.text}>Select Country</Text>
      <SelectList
        placeholder="Pakistan"
        boxStyles={styles.selectBox} // Custom box styles
        dropdownStyles={styles.dropdown} // Custom dropdown styles
      />

      {/* Checkbox Section Row 1 */}
      <Text style={styles.text}>Your Interest</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedNews ? 'checked' : 'unchecked'}
            onPress={() => setCheckedNews(!checkedNews)}
          />
          <Text style={styles.checkboxText}>News</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedSports ? 'checked' : 'unchecked'}
            onPress={() => setCheckedSports(!checkedSports)}
          />
          <Text style={styles.checkboxText}>Sports</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedPolitics ? 'checked' : 'unchecked'}
            onPress={() => setCheckedPolitics(!checkedPolitics)}
          />
          <Text style={styles.checkboxText}>Politics</Text>
        </View>
      </View>

      {/* Checkbox Section Row 2 */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedCricket ? 'checked' : 'unchecked'}
            onPress={() => setCheckedCricket(!checkedCricket)}
          />
          <Text style={styles.checkboxText}>Cricket</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedHockey ? 'checked' : 'unchecked'}
            onPress={() => setCheckedHockey(!checkedHockey)}
          />
          <Text style={styles.checkboxText}>Hockey</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={checkedFootball ? 'checked' : 'unchecked'}
            onPress={() => setCheckedFootball(!checkedFootball)}
          />
          <Text style={styles.checkboxText}>Football</Text>
        </View>
      </View>

      {/* Submit Button */}
      <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  headertxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  radiobutton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    fontSize: 18,
  },
  radiobuttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  dropdown: {
    borderRadius: 5,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 18,
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: 'blue',
  },
});

export default PaperP;
