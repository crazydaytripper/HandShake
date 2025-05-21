import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image as Upload } from 'lucide-react-native';
import { useLoanStore } from '@/stores/loan-store';
import { colors } from '@/constants/colors';
import { Currency } from '@/types/loan';

const formatNumber = (num: string) => {
  // Remove any existing commas first
  const number = num.replace(/,/g, '');
  // Only proceed if it's a valid number
  if (/^\d*$/.test(number)) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return num;
};

const unformatNumber = (str: string) => str.replace(/,/g, '');

export default function AddLoanScreen() {
  const addLoan = useLoanStore((state) => state.addLoan);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('THB');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  const handleAmountChange = (text: string) => {
    const formatted = formatNumber(text);
    setAmount(formatted);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !amount || !interestRate || !monthlyPayment || !month || !day || !year) {
      return;
    }

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    addLoan({
      title,
      amount: parseFloat(unformatNumber(amount)),
      currency,
      interestRate: parseFloat(interestRate),
      monthlyPayment: parseFloat(monthlyPayment),
      startDate: date.toISOString(),
      nextPaymentDue: date.toISOString(),
      receiptUrl: receiptUri || undefined,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Loan Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter loan title"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Enter amount"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencies}>
            {(['THB', 'USD', 'EUR'] as Currency[]).map((curr) => (
              <Pressable
                key={curr}
                style={[
                  styles.currencyButton,
                  currency === curr && styles.currencyButtonActive
                ]}
                onPress={() => setCurrency(curr)}
              >
                <Text style={[
                  styles.currencyText,
                  currency === curr && styles.currencyTextActive
                ]}>
                  {curr}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="Enter interest rate"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Monthly Payment</Text>
          <TextInput
            style={styles.input}
            value={monthlyPayment}
            onChangeText={setMonthlyPayment}
            placeholder="Enter monthly payment"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.dateInputs}>
            <TextInput
              style={styles.dateInput}
              value={month}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (text === '' || (num >= 1 && num <= 12)) {
                  setMonth(text);
                }
              }}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.dateSeparator}>/</Text>
            <TextInput
              style={styles.dateInput}
              value={day}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (text === '' || (num >= 1 && num <= 31)) {
                  setDay(text);
                }
              }}
              placeholder="DD"
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.dateSeparator}>/</Text>
            <TextInput
              style={[styles.dateInput, styles.yearInput]}
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Upload Receipt</Text>
          <Pressable style={styles.uploadButton} onPress={pickImage}>
            <Upload size={24} color={colors.text} />
            <Text style={styles.uploadText}>
              {receiptUri ? 'Change Receipt' : 'Select Receipt'}
            </Text>
          </Pressable>
          {receiptUri && (
            <Image 
              source={{ uri: receiptUri }} 
              style={styles.receiptPreview}
              resizeMode="cover"
            />
          )}
        </View>

        <Pressable 
          style={styles.button} 
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Add Loan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencies: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyText: {
    color: colors.text,
    fontWeight: '500',
  },
  currencyTextActive: {
    color: colors.text,
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    width: 60,
    textAlign: 'center',
  },
  yearInput: {
    width: 80,
  },
  dateSeparator: {
    color: colors.text,
    fontSize: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadText: {
    color: colors.text,
    fontSize: 16,
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});