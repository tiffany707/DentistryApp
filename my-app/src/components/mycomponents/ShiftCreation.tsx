import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// npm install @react-native-community/datetimepicker

export interface ShiftFormData {
  email: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  skillsRequired: string;
  jobDescription: string;
}

interface ShiftApplicationFormProps {
  onSubmit?: (data: ShiftFormData) => void;
}


export default function ShiftApplicationForm() {

  const API_URL ="http://192.168.151.93:5000"

  const [shiftTitle, setShiftTitle] = useState<string>('');
  const [skillsRequired, setSkillsRequired] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const formatDate = (d: Date): string =>
    d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (d: Date): string =>
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS === 'android') setShowDatePicker(false);
  };

  const onChangeStartTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedTime) setStartTime(selectedTime);
    if (Platform.OS === 'android') setShowStartPicker(false);
  };

  const onChangeEndTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedTime) setEndTime(selectedTime);
    if (Platform.OS === 'android') setShowEndPicker(false);
  };



  const handleSubmit = async () => {
    const email = 'info@downtownsmile.com'; // THIS IS HARDCODED
    const payload: ShiftFormData = {
      email,
      title: shiftTitle,
      date,
      startTime,
      endTime,
      skillsRequired ,
      jobDescription,
    };
    
    const res = await fetch(`${API_URL}/api/shifts/creation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    //return the shift id and then pass the url
  
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.header}>New Shift</Text>

      <Text style={styles.label}>Shift Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Weekend Barista"
        placeholderTextColor="#B399D4"
        value={shiftTitle}
        onChangeText={setShiftTitle}
      />

      <Text style={styles.label}>Date</Text>
     <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
  <Text style={styles.pickerButtonText}>{formatDate(date)}</Text>
</TouchableOpacity>

{true && (
  <DateTimePicker
    value={date}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Forces an immediate clean modal style
    onChange={onChangeDate}
  />
)}

      <Text style={styles.label}>Time</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity
          style={[styles.pickerButton, styles.timeButton]}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.pickerButtonText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>

        <Text style={styles.hyphen}>-</Text>

        <TouchableOpacity
          style={[styles.pickerButton, styles.timeButton]}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.pickerButtonText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>
      {true && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={onChangeStartTime}
        />
      )}
      {true && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={onChangeEndTime}
        />
      )}

      <Text style={styles.label}>Skills Requirement</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. POS experience, food handling"
        placeholderTextColor="#B399D4"
        value={skillsRequired}
        onChangeText={setSkillsRequired}
      />

      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe the shift responsibilities..."
        placeholderTextColor="#B399D4"
        value={jobDescription}
        onChangeText={setJobDescription}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const PURPLE = '#8A5FD1';
const LIGHT_PURPLE = '#EDE4FA';
const LIGHT_PURPLE_BORDER = '#D9C7F0';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#4B2E83';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: PURPLE,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: LIGHT_PURPLE,
    borderWidth: 1,
    borderColor: LIGHT_PURPLE_BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT_DARK,
  },
  multilineInput: {
    minHeight: 110,
    paddingTop: 12,
  },
  pickerButton: {
    backgroundColor: LIGHT_PURPLE,
    borderWidth: 1,
    borderColor: LIGHT_PURPLE_BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickerButtonText: {
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeButton: {
    flex: 1,
    alignItems: 'center',
  },
  hyphen: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: PURPLE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});