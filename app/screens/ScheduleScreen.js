import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import {
    Appbar,
    Avatar,
    Card,
    Paragraph,
    Text,
    Button,
    IconButton,
    TextInput,
} from "react-native-paper";

import sharedStyles from "../config/sharedStyles";
import utils from "../config/utils";
import colors from "../config/colors";

function renderCard({ item }) {
    const now = moment();
    const times = item.time.split("-");
    const startTime = moment(item.date + " " + times[0], "MMM Do h:mma");
    const endTime = moment(item.date + " " + times[1], "MMM Do h:mma");

    // console.log(startTime.format("dddd, MMMM Do YYYY, h:mma"));
    // console.log(endTime.format("dddd, MMMM Do YYYY, h:mma"));

    const getLabelStyle = () => {
        if (now >= endTime) {
            return styles.finishedAvatar;
        } else if (now <= startTime) {
            return styles.notFinishedAvatar;
        }
        return styles.inProgressAvatar;
    };

    return (
        <Card style={styles.card} mode="outlined">
            <Card.Title
                title={item.name}
                titleStyle={styles.cardTitle}
                titleVariant="titleLarge"
                subtitle={`${item.date}, ${item.time}`}
                left={() => (
                    <Avatar.Text
                        size={40}
                        style={getLabelStyle()}
                        labelStyle={styles.weekdayAvatar}
                        label={item.weekday}
                    />
                )}
            />
            <Card.Content>
                <Paragraph>{item.location}</Paragraph>
            </Card.Content>
        </Card>
    );
}

function ScheduleScreen(props) {
    // Data states:
    const [data, setData] = useState([]);
    const MINUTE_MS = 60000;
    let classObject = {};

    // Add class modal states:
    const [scheduleModalVisible, setModalVisible] = useState(false);
    const [subject, setSubject] = useState("");
    const [classCode, setClassCode] = useState("");
    const [submitOff, setSubmitOff] = useState(true);

    // Class dropdown list states:
    // This the the most stupid thing ever made who designed this dumb dropdown menu component
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const [items, setItems] = useState([]);
    const [value, setValue] = useState(null);
    const [open, setOpen] = useState(false);

    const cards = [
        {
            name: "MATH 135",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm-12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 136",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm-12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 137",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm-12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 138",
            date: "Jan 11th",
            weekday: "Mon",
            time: "7:00pm-8:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 139",
            date: "Jan 8th",
            weekday: "Mon",
            time: "8:00pm-9:00pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 140",
            date: "Jan 7th",
            weekday: "Mon",
            time: "9:00pm-10:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 141",
            date: "Jan 7th",
            weekday: "Mon",
            time: "10:00pm-11:00pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 142",
            date: "Jan 8th",
            weekday: "Mon",
            time: "11:00pm-11:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
    ];

    useEffect(() => {
        const now = moment();

        let timeoutID, intervalID;

        timeoutID = setTimeout(() => {
            refreshCards(moment());
            intervalID = setInterval(() => {
                refreshCards(moment());
            }, MINUTE_MS);
        }, (60 - now.seconds()) * 1000);

        return () => {
            clearTimeout(timeoutID);
            clearInterval(intervalID);
        };
    }, []);

    function refreshCards(now) {
        const currTime = now.format("h:mma");
        if (currTime === "12:00am") {
            console.log("New Day schedule change");
        }
        setData([...data, ...cards]);

        console.log(currTime + " " + currTime.charAt(currTime.length - 3));
    }

    function addData(subjectD, classCodeD) {
        const url =
            "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?sess=1231&level=under&subject=" +
            subjectD +
            "&cournum=" +
            classCodeD;

        JSDOM.fromURL(url)
            .then((dom) => {
                const document = dom.window.document;
                const rows = document.querySelectorAll("tr");
                let data = [];
                rows.forEach((row) => {
                    const cellArr = row.querySelectorAll("td");
                    if (cellArr[1].textContent === "LEC") {
                        let cell = {};
                        cell["Comp sec"] = cellArr[1].textContent;
                        cell["Time Days/Date"] = cellArr[10].textContent;
                        cell["Bldg Room"] = cellArr[11].textContent;
                        cell["Instructor"] = cellArr[12].textContent;
                        data.push(cell);
                    }
                });
                console.log(data);
            })
            .catch((err) => {
                console.log("Error: ${err}");
            });
    }

    function closeModal() {
        // resets the entries
        setSubject("");
        setClassCode("");

        // resets the class/dropdown list entries
        setItems([]);
        setValue(null);
        setOpen(false);
        console.log(
            "Subject on close is: " +
                subject +
                " and code on close is: " +
                classCode
        );

        // resets the submit button, and closes the modal
        setSubmitOff(true);
        setModalVisible(false);
    }

    return (
        <View style={sharedStyles.screen}>
            <Appbar.Header mode="small">
                <Appbar.Content title="Schedule" />
                <Appbar.Action
                    icon="magnify"
                    onPress={() => console.log("search schedule")}
                />
                <Appbar.Action
                    icon="plus"
                    onPress={() => setModalVisible(true)}
                />
            </Appbar.Header>
            <Modal
                transparent={true}
                visible={scheduleModalVisible}
                onRequestClose={() => closeModal()}
            >
                <Pressable
                    onPress={() => closeModal()}
                    style={{ flex: 1, backgroundColor: "transparent" }}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderContent}>
                                <Text style={{ fontSize: 24 }}>
                                    Add new course
                                </Text>
                            </View>
                            <IconButton
                                icon="close"
                                iconColor="red"
                                style={styles.button}
                                onPress={() => closeModal()}
                            />
                        </View>
                        <View style={styles.modalContent}>
                            <TextInput
                                label="Subject"
                                value={subject}
                                style={styles.inputBox}
                                onChangeText={(subject) => {
                                    setSubject(subject.toUpperCase());
                                }}
                            />
                            <TextInput
                                label="Class"
                                value={classCode}
                                style={styles.inputBox}
                                onChangeText={(classCode) => {
                                    setClassCode(classCode);
                                }}
                            />
                            <DropDownPicker
                                placeholder="Select a class section"
                                style={styles.inputBox}
                                schema={{
                                    label: "classLabel",
                                    value: "classSection",
                                }}
                                open={open}
                                value={value}
                                items={items}
                                onSelectItem={(item) => {
                                    console.log(item);
                                }}
                                onChangeValue={(value) => {
                                    console.log("Value: " + value);
                                }}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                //closeAfterSelecting={true}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    mode="contained"
                                    disabled={!submitOff}
                                    onPress={() => {
                                        console.log(
                                            "Subject on submit is: " +
                                                subject +
                                                " and code on submit is: " +
                                                classCode
                                        );
                                        addData(subject, classCode);
                                    }}
                                >
                                    Submit1
                                </Button>
                                <Button
                                    mode="contained"
                                    disabled={submitOff}
                                    onPress={() => {
                                        console.log(value);
                                        console.log(classObject);
                                        closeModal();
                                    }}
                                >
                                    Submit2
                                </Button>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            <FlatList
                data={data}
                renderItem={renderCard}
                showsVerticalScrollIndicator={false}
                style={sharedStyles.mainContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
    },
    cardTitle: {
        fontWeight: sharedStyles.bold,
    },
    weekdayAvatar: {
        fontSize: 14,
        fontWeight: sharedStyles.bold,
    },
    finishedAvatar: {
        backgroundColor: colors.greenContainer,
    },
    inProgressAvatar: {
        backgroundColor: colors.onYellowContainer,
    },
    notFinishedAvatar: {
        backgroundColor: colors.yellow,
    },
    modal: {
        margin: 50,
        marginTop: 110,
        borderRadius: 20,
        paddingLeft: 35,
        paddingRight: 35,
        paddingBottom: 35,
        backgroundColor: colors.background,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
    },
    modalHeaderContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flexGrow: 1,
        alignContent: "space-around",
    },
    button: {
        alignSelf: "flex-end",
        paddingLeft: 5,
        paddingRight: 5,
    },
    inputBox: {
        marginBottom: 15,
    },
});

export default ScheduleScreen;
