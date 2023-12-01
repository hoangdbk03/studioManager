import { StyleSheet } from "react-native";

export const styleModal = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: 'center',
    borderRadius: 10,
    width: '100%'
  },
  buttonModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button1: {
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    width: "50%",
    padding: 15,
    alignItems: "center",
    borderColor: "#dbdbdb",
  },
  button2: {
    borderTopWidth: 0.5,
    width: "50%",
    padding: 15,
    alignItems: "center",
    borderColor: "#dbdbdb",
  },
  textButton1: {
    fontWeight: 'bold',
  },
  textButton2: {
    color: "#0E55A7",
    fontWeight: 'bold',
  },
  titleModal: {
    fontSize: 20,
    color: "white",
    fontWeight: "500",
  },
  frameTitleModal: {
    backgroundColor: "#0E55A7",
    padding: 12,
    marginTop: 10,
    width: '90%',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
