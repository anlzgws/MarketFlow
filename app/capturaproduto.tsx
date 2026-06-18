import { useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CapturaProduto() {
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permita o acesso à câmera</Text>
        <Button
          title="Permitir câmera"
          onPress={requestPermission}
        />
      </View>
    );
  }

  async function tirarFoto() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();

    setFoto(photo.uri);
  }

  return (
    <View style={styles.container}>
      {!foto ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
          />

          <Button
            title="Tirar Foto"
            onPress={tirarFoto}
          />
        </>
      ) : (
        <>
          <Image
            source={{ uri: foto }}
            style={styles.preview}
          />

          <Button
            title="Tirar Outra"
            onPress={() => setFoto(null)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  preview: {
    flex: 1,
    resizeMode: "contain",
  },
});