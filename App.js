import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [values, setValues] = useState([]);
  const [messageError, setMessageError] = useState('');

  async function handleAsyncStorage() {
    try {
      if (!inputValue) {
        setMessageError("Insira um valor!");
        return;
      }

      if (isNaN(inputValue)) {
        setMessageError("Insira um valor numérico!");
        return;
      }

      const newValue = {
        id: Date.now().toString(),
        value: inputValue,
        date: new Date().toLocaleDateString(),
      };

      const updatedValues = [...values, newValue];
      await AsyncStorage.setItem("@valores", JSON.stringify(updatedValues));
      setValues(updatedValues);
      setInputValue('');
      setMessageError("");
    } catch (error) {
      console.error(error);
      setMessageError("Erro ao salvar os dados.");
    }
  }

  async function removeValue(id) {
    try {
      const updatedValues = values.filter(item => item.id !== id);
      await AsyncStorage.setItem("@valores", JSON.stringify(updatedValues));
      setValues(updatedValues);
    } catch (error) {
      console.error(error);
      setMessageError("Erro ao remover os dados.");
    }
  }

  async function getData() {
    try {
      const res = await AsyncStorage.getItem("@valores");
      const storedValues = res ? JSON.parse(res) : [];
      setValues(storedValues);
      setMessageError("");
    } catch (error) {
      console.error(error);
      setMessageError("Erro ao buscar os dados.");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 26, marginTop: 80, fontWeight: "600" }}>Bem-Vindo</Text>
      </View>
      <View style={styles.containerValue}>
        <View style={styles.containerBox}>
          <Text>Insira o valor da semana:</Text>
          <View style={styles.containerBoxInput}>
            <TextInput
              placeholder='Valor R$:'
              style={styles.input}
              value={inputValue}
              onChangeText={(value) => setInputValue(value)}
              keyboardType="numeric" // Permite apenas a entrada de números
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleAsyncStorage}
            >
              <Text style={{ color: "white", fontSize: 14 }}>Enviar</Text>
            </TouchableOpacity>
          </View>
          {
            messageError && <Text style={{ color: "red", marginTop: 5 }}>{messageError}</Text>
          }
          <View style={styles.containerTextObv}>
            <Text style={{ color: "red" }}>OBS: Para inserir valores quebrados, use ponto e não vírgula</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerDash}>
        <View style={{ display: "flex", flexDirection: "row", padding: 20, justifyContent: "space-between", borderBottomWidth: 1 }}>
          <Text>Id:</Text>
          <Text>Data:</Text>
          <Text>Valor:</Text>
          <Text>Ação:</Text>
        </View>
        <ScrollView>
          {values.map((item, index) => (
            <View key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: 20, flexDirection: "row" }}>
              <Text>{index + 1}</Text>
              <Text>{item.date}</Text>
              <Text style={{ color: "green" }}>R$: {item.value}</Text>
              <TouchableOpacity onPress={() => removeValue(item.id)} style={styles.deleteButton}>
                <Text style={{ color: "white", fontSize: 12 }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.containerResult}>
        <Text style={{ fontSize: 24, color: "white" }}>TOTAL: R$ {values.reduce((total, item) => total + parseFloat(item.value || 0), 0).toFixed(2).replace('.', ',')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '75%',
    marginRight: 10,
    fontSize: 16,
  },
  containerTextObv: {
    marginBottom: 20,
  },
  deleteButton: {
    width: 80,
    height: 30,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 80,
    height: 45,
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2, // For Android
  },
  containerValue: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  containerDash: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    maxHeight: 350,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 20,
  },
  containerBox: {
    display: "flex",
    width: '100%',
    gap: 10,
  },
  containerBoxInput: {
    display: "flex",
    flexDirection: "row"
  },

  containerResult: {
    width: '100%',
    backgroundColor: "#3498db",
    paddingVertical: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // For Android shadow
  },
  textTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: '#333',
    marginVertical: 40,
  },
  textLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  textError: {
    color: "#e74c3c",
    marginTop: 5,
    fontSize: 14,
  },
  textTotal: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  dashHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  dashItem: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    color: '#333',
  },
});