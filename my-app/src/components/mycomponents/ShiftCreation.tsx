import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
  
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleConfirmStart = (selectedTime: Date) => {
    setStartTime(selectedTime);
    setShowStartPicker(false);
  }

  const handleConfirmEnd = (selectedTime: Date) => {
    setEndTime(selectedTime);
    setShowEndPicker(false);
  }

  const handleSubmit = async () => {
    console.log("submitting form")
    try{
      const email = 'info@downtownsmile.com'; // THIS IS HARDCODED
      const payload: ShiftFormData = {
        email,
        title: shiftTitle,
        date,
        startTime,
        endTime,
        skillsRequired,
        jobDescription,
      };
      
      const res = await fetch(`${API_URL}/api/shifts/creation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("api returned")

      const data = await res.json();

      if(!res.ok){
        console.error("Backend Error Details:", data);
        throw new Error("There was an error submitting your shift.")
      }

      console.log("changing page")
      router.push({
        pathname: '/shiftAIRecommendations',
        params: { shiftId: data.shift.shiftId }
      })
    }catch(err){
      return(
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
        <Text style={styles.header}>New Shift</Text>
        <Text>There was an error submitting your shift.</Text>
        </ ScrollView>
      )
    }



  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.header}>New Shift</Text>

      <Text style={styles.label}>Shift Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Dental Assistant"
        placeholderTextColor="#665567"
        value={shiftTitle}
        onChangeText={setShiftTitle}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity 
          style={styles.inputBox} 
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
      >
          <Text style={styles.inputText}>{formattedDate}</Text>
          <Ionicons name="calendar-outline" size={20} color="#4B2E83" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setShowDatePicker(false)}
        date={date}
        buttonTextColorIOS="#4B2E83"
      />

      {/* Time */}
      <View style={styles.timeSectionContainer}>
          <Text style={styles.label}>Time</Text>

          <View style={styles.row}>
              <TouchableOpacity 
                  style={styles.inputBox} 
                  onPress={() => setShowStartPicker(true)}
                  activeOpacity={0.8}
              >
                  <Text style={styles.inputText}>{formatTime(startTime)}</Text>
                  <Ionicons name="time-outline" size={18} color="#4B2E83" />
              </TouchableOpacity>

              <Text style={styles.hyphen}>-</Text>

              <TouchableOpacity 
                  style={styles.inputBox} 
                  onPress={() => setShowEndPicker(true)}
                  activeOpacity={0.8}
              >
                  <Text style={styles.inputText}>{formatTime(endTime)}</Text>
                  <Ionicons name="time-outline" size={18} color="#4B2E83" />
              </TouchableOpacity>
          </View>

          <DateTimePickerModal
              isVisible={showStartPicker}
              mode="time"
              onConfirm={handleConfirmStart}
              onCancel={() => setShowStartPicker(false)}
              date={startTime}
              buttonTextColorIOS="#4B2E83"
          />

          <DateTimePickerModal
              isVisible={showEndPicker}
              mode="time"
              onConfirm={handleConfirmEnd}
              onCancel={() => setShowEndPicker(false)}
              date={endTime}
              buttonTextColorIOS="#4B2E83"
          />
      </View>

      <Text style={styles.label}>Skills Requirement</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. X-Ray, Sterilization"
        placeholderTextColor="#665567"
        value={skillsRequired}
        onChangeText={setSkillsRequired}
      />

      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe the shift responsibilities..."
        placeholderTextColor="#665567"
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

const INPUT_BG = '#C4B3C5';
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
    marginBottom: 8,
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#A894A9',
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
  timeSectionContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hyphen: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 3,
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  inputBox: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#A894A9',
      backgroundColor: WHITE,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 14,
  },
  inputText: {
      fontSize: 15,
      color: '#665567',
  },
});