import { StyleSheet } from "react-native";

export const imageAdMargin = 6;
export const imageAdToWidthRatio = 0.9;

export default StyleSheet.create({
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  bold: {
    fontWeight: "700"
  },
  price: {
    flex: 1
  },

  userContainer: { marginVertical: 20 },
  usernameContainer: { flexDirection: "row" },
  username: { flex: 1, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  locationContainer: { flexDirection: "row" },
  office: { flex: 1 },
  officeLocation: {},

  descriptionContainer: { marginVertical: 12 },
  description: { fontSize: 18 },

  info: { marginVertical: 12 },
  infoRow: { flexDirection: "row" },
  infoLabel: { flex: 1 }
});
