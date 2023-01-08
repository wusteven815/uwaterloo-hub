import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Paragraph, Text } from "react-native-paper";

import sharedStyles from "../config/sharedStyles";
import utils from "../config/utils";
import colors from "../config/colors";

function renderCard({ item }) {
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
                        style={styles.notFinishedAvatar}
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

function updateData(d) {
    const currTime = utils.generateTime(d);
    if (currTime === "12:00am") {
        console.log("New Day schedule change");
    }

    console.log(currTime + " " + currTime.charAt(currTime.length - 3));
}

function ScheduleScreen(props) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const MINUTE_MS = 60000;

    const cards = [
        {
            name: "MATH 135",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 136",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 137",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 138",
            date: "Jan 1st",
            weekday: "Mon",
            time: "7:00pm - 8:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 139",
            date: "Jan 1st",
            weekday: "Mon",
            time: "8:00pm - 9:00pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 140",
            date: "Jan 1st",
            weekday: "Mon",
            time: "9:00pm - 10:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 141",
            date: "Jan 1st",
            weekday: "Mon",
            time: "10:00pm - 11:00pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 142",
            date: "Jan 1st",
            weekday: "Mon",
            time: "11:00pm - 11:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
    ];

    // const renderCard = ({ item }) => {
    //     return (
    //         <Card style={styles.card} mode="outlined">
    //             <Card.Title
    //                 title={item.name}
    //                 titleStyle={styles.cardTitle}
    //                 titleVariant="titleLarge"
    //                 subtitle={`${item.date}, ${item.time}`}
    //                 left={() => (
    //                     <Avatar.Text
    //                         size={40}
    //                         style={styles.notFinishedAvatar}
    //                         labelStyle={styles.weekdayAvatar}
    //                         label={item.weekday}
    //                     />
    //                 )}
    //             />
    //             <Card.Content>
    //                 <Paragraph>{item.location}</Paragraph>
    //             </Card.Content>
    //         </Card>
    //     );
    // };

    const handleRefresh = () => {
        // let API_URL = "https://jsonplaceholder.typicode.com/posts";
        setLoading(true);
        setData([
            ...data,
            ...cards,
            // {
            //     name: "MATH Brasen",
            //     date: "Jan 1st",
            //     weekday: "Mon",
            //     time: "12:00pm - 12:50pm",
            //     location: "MC 4021 (Mathematics and Computer)",
            // },
        ]);
        setLoading(false);

        // fetch(API_URL)
        //   .then((res) => res.json())
        //   .then((res) => {
        //     console.log("refeshed");
        //   })
        //   .finally(() => setLoading(false));
    };

    useEffect(() => {
        const d = new Date();
        let timeoutID, intervalID;

        timeoutID = setTimeout(() => {
            updateData(new Date());
            intervalID = setInterval(() => {
                updateData(new Date());
            }, MINUTE_MS);
        }, (60 - d.getSeconds()) * 1000);

        return () => {
            clearTimeout(timeoutID);
            clearInterval(intervalID);
        };
    }, []);

    // const updateData = (d) => {
    //     const currTime = utils.generateTime(d);
    //     if (currTime === "12:00am") {
    //         console.log("New Day schedule change");
    //     }

    //     console.log(currTime + " " + currTime.charAt(currTime.length - 3));
    // };

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

            {/* <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>Coming soon!</Text>
            </View> */}

            <FlatList
                data={data}
                renderItem={renderCard}
                refreshing={isLoading}
                onRefresh={handleRefresh}
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
