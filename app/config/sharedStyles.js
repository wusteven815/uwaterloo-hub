import { Platform, StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({

    bold: Platform.OS === "android" ? "bold" : "600",
    divider: {
        backgroundColor: colors.outline,
        marginVertical: 15
    },
    loadingAnimation: {
        marginVertical: 20
    },
    mainContainer: {
        flexGrow: 1,
        marginHorizontal: 15
    },
    screen: {
        flex: 1,
    },
    subtitle: {
        marginBottom: 15,
        fontStyle: "italic"
    },

})