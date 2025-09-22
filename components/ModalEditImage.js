import {
  StyleSheet,
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Gesture,
  GestureHandlerRootView,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import StickerPicker from "./stickerPicker";
import { useState, useRef } from "react";
import Sticker from "./Sticker";
import { captureRef } from "react-native-view-shot";

const { width, height } = Dimensions.get("screen");
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function ModalEditImage({
  image,
  visible,
  onClose,
  imageMirror,
}) {
  const [modalSticker, setModalSticker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState();

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  // Zoom imagem
  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.3,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Mover imagem
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX / scale.value;
    translateY.value += event.changeY / scale.value;
  });

  // Rotacionar imagem
  const angle = useSharedValue(1);
  const startAngle = useSharedValue(0);

  const rotation = Gesture.Rotation()
    .onStart(() => {
      startAngle.value = angle.value;
    })
    .onUpdate((event) => {
      angle.value = startAngle.value + event.rotation;
    })
    .runOnJS(true);

  const imageAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scaleX: imageMirror },
      { scale: scale.value },
      { translateX: imageMirror === -1 ? -translateX.value : translateX.value },
      { translateY: translateY.value },
      {
        rotate: imageMirror === -1 ? `${-angle.value}rad` : `${angle.value}rad`,
      },
    ],
  }));

  const gestures = Gesture.Simultaneous(drag, pinch, rotation);

  async function saveImage() {
    try {
      const data = await captureRef(imageRef, { quality: 1 });
      console.log(data);

      await MediaLibrary.saveToLibraryAsync(data);

      if (data) {
        alert("Imagem foi salva com sucesso!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal style={styles.container} visible={visible} animationType="slide">
      {/* IMAGEM */}
      <GestureHandlerRootView>
        <GestureDetector gesture={gestures}>
          <View style={styles.container}>
            <View style={styles.imageArea}>
              {selectedSticker && <Sticker stickerSource={selectedSticker} />}
              <Animated.Image
                source={{ uri: image.uri }}
                style={[
                  {
                    width: (image.width * height) / image.height,
                    height: height,
                  },
                  imageAnimatedStyles,
                ]}
              />
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
      {/* BOTÕES */}
      <View style={styles.buttonContainerModal}>
        {/* BOTÃO DE FECHAR */}
        <TouchableOpacity style={styles.buttonModal} onPress={onClose}>
          <MaterialIcons size={30} name="close" color="#fff" />
        </TouchableOpacity>

        <View style={styles.buttonContainerModal2}>
          {/* BOTÃO DE ADICIONAR STICKER */}
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() => setModalSticker(true)}
          >
            <MaterialIcons size={30} name="filter-frames" color="#fff" />
          </TouchableOpacity>
          {/* BOTÃO DE DELETAR STICKER */}
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() => setSelectedSticker(null)}
          >
            <MaterialIcons size={30} name="delete" color="#fff" />
          </TouchableOpacity>
          {/* BOTÃO DE SALVAR */}
          <TouchableOpacity style={styles.buttonModal} onPress={saveImage}>
            <MaterialIcons size={30} name="download" color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <StickerPicker
        isVisible={modalSticker}
        onClose={() => setModalSticker(false)}
        onSelect={setSelectedSticker}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0c0c0c",
    alignItems: "center",
    justifyContent: "center",
  },
  imageArea: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0c0c0c",
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainerModal: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",

    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  buttonContainerModal2: {
    flexDirection: "row",
    gap: 8,
  },
  buttonModal: {
    width: 48,
    height: 48,
    backgroundColor: "black",
    opacity: 0.75,
    borderRadius: 100,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});
