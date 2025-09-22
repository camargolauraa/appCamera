import {
  StyleSheet,
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { height } = Dimensions.get("screen");

export default function ModalEditImage({
  image,
  visible,
  onClose,
  imageMirror,
}) {
  return (
    <Modal style={styles.container} visible={visible} animationType="slide">
      {/* IMAGEM */}
      <View style={styles.container}>
        <View style={styles.imageArea}>
          <Image
            source={{ uri: image.uri }}
            style={{
              width: (image.width * height) / image.height,
              height: height,
              transform: [{ scaleX: imageMirror }],
            }}
          />
        </View>
      </View>
      {/* BOTÕES */}
      <View style={styles.buttonContainerModal}>
        {/* BOTÃO DE FECHAR */}
        <TouchableOpacity style={styles.buttonModal} onPress={onClose}>
          <MaterialIcons size={30} name="close" color="#fff" />
        </TouchableOpacity>

        <View style={styles.buttonContainerModal2}>
          {/* BOTÃO DE ADICIONAR STICKER */}
          <TouchableOpacity style={styles.buttonModal}>
            <MaterialIcons size={30} name="filter-frames" color="#fff" />
          </TouchableOpacity>
          {/* BOTÃO DE DELETAR STICKER */}
          <TouchableOpacity style={styles.buttonModal}>
            <MaterialIcons size={30} name="delete" color="#fff" />
          </TouchableOpacity>
          {/* BOTÃO DE SALVAR */}
          <TouchableOpacity style={styles.buttonModal}>
            <MaterialIcons size={30} name="download" color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
