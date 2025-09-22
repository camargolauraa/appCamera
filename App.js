import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import ModalEditImage from "./components/ModalEditImage";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function App() {
  const camRef = useRef();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("front");
  const [image, setImage] = useState();
  const [imageMirror, setImageMirror] = useState(-1);

  const [open, setOpen] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Habilitar permissão" />
      </View>
    );
  }

  async function pickImage() {
    let data = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    setImageMirror(1);

    if (!data.canceled) {
      const asset = data.assets[0]; // 🔹 pega o objeto certo
      setImage({
        uri: asset.uri, // 🔹 agora salvo no mesmo formato da câmera
        width: asset.width, // 🔹 adiciono width
        height: asset.height, // 🔹 adiciono height
      });
      setOpen(true);
    }
  }

  async function takePicture() {
    setImageMirror(facing === "front" ? -1 : 1);
    if (camRef) {
      let data = await camRef.current.takePictureAsync();
      setImage(data);
      setOpen(true);
    }
  }

  function toggleFacing() {
    setFacing((current) => (current === "front" ? "back" : "front"));
  }

  return (
    <View style={styles.container}>
      <Text
        style={{ textAlign: "center", color: "white", marginHorizontal: 16 }}
      >
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="light" />
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={camRef}>
          {/* BOTÕES */}
          <View style={styles.buttonContainer}>
            {/* GALERIA */}
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <MaterialIcons name="collections" size={36} color="white" />
            </TouchableOpacity>

            {/* TIRAR FOTO */}
            <TouchableOpacity style={styles.buttonPhoto} onPress={takePicture}>
              <View style={styles.buttonPhotoInner} />
            </TouchableOpacity>

            {/* INVERTER CÂMERA */}
            <TouchableOpacity style={styles.button} onPress={toggleFacing}>
              <MaterialIcons name="flip-camera-ios" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      {image && (
        <ModalEditImage
          image={image}
          imageMirror={imageMirror}
          visible={open}
          onClose={() => {
            setOpen(false);
            setImage(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    color: "white",
    marginHorizontal: 16,
  },
  cameraContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 32,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "black",
    opacity: 0.75,
    borderRadius: 100,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  buttonPhoto: {
    width: 80,
    height: 80,
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 100,

    padding: 8,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  buttonPhotoInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 100,
  },
});
