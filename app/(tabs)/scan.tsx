import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchProductData, getFridges, saveProduct } from "../utils/productUtils";

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [selectedFridge, setSelectedFridge] = useState(null);
  const [fridges, setFridges] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadFridges = async () => {
      const loadedFridges = await getFridges();
      setFridges(loadedFridges);
    };
    loadFridges();
  }, []);


  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!isScanning || !selectedFridge) return;
    setIsScanning(false);

    try {
      const productData = await fetchProductData(data);
      if (productData) {
        await saveProduct(productData, selectedFridge);
        router.push(`/products/${productData.id}`);
      } else {
        alert("Produit non trouvé");
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      alert("Erreur lors du scan du produit");
      setIsScanning(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
              style={styles.overlay}
            >
              <View style={styles.scanFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              <BlurView intensity={80} style={styles.infoBox}>
                <Text style={styles.scanText}>
                  Placez le code-barres dans le cadre
                </Text>
              </BlurView>
            </LinearGradient>
          </CameraView>
        ) : (
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color="#007AFF" />
            <Text style={styles.message}>Permission de caméra non accordée</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={requestPermission}
            >
              <Text style={styles.buttonText}>Autoriser la caméra</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
  },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTopWidth: 4, borderLeftWidth: 4, borderColor: 'white' },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTopWidth: 4, borderRightWidth: 4, borderColor: 'white' },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: 'white' },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 4, borderRightWidth: 4, borderColor: 'white' },
  infoBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});