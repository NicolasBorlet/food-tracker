import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProductData, saveProduct } from "../utils/productUtils";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const router = useRouter();

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!isScanning) return;
    setIsScanning(false);

    try {
      const productData = await fetchProductData(data);
      if (productData) {
        await saveProduct(productData);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <Text style={styles.scanText}>
                Placez le code-barres dans le cadre
              </Text>
            </View>
          </CameraView>
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.message}>Permission non accordée</Text>
            <Button
              title="Autoriser la caméra"
              onPress={requestPermission}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
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
});