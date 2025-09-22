import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

export default function StickerPicker({ isVisible, onClose, onSelect }) {
  const [stickers] = useState([
    require("../assets/stickers/emoji1.png"),
    require("../assets/stickers/emoji10.png"),
    require("../assets/stickers/emoji11.png"),
    require("../assets/stickers/emoji12.png"),
  ]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      {/* View para o modal inteiro */}
      <View style={styles.modal}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Escolha um sticker</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons size={22} name="close" color={"white"} />
          </TouchableOpacity>
        </View>
        {/* ScrollView para os stickers */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stickersContainer}>
            {stickers.map((sticker, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelect(sticker);
                    onClose();
                  }}
                >
                  <Image source={sticker} key={index} style={styles.sticker} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    height: "75%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#0c0c0c",
    opacity: 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stickersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "space-between",
  },
  sticker: {
    width: 90,
    height: 90,
    objectFit: "contain",
    marginVertical: 8,
  },
});
