import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Paragraph, Text } from "react-native-paper";

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
    const [data, setData] = useState([]);
    const MINUTE_MS = 60000;

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
        console.log("Data length: " + data.length);
        console.log(currTime + " " + currTime.charAt(currTime.length - 3));
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
                    onPress={() => console.log("add schedule")}
                />
            </Appbar.Header>
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
        backgroundColor: colors.green,
    },
    inProgressAvatar: {
        backgroundColor: colors.onYellowContainer,
    },
    notFinishedAvatar: {
        backgroundColor: colors.yellow,
    },
});

export default ScheduleScreen;
