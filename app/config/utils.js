const format = "12";

function convertTime(time24) {

        if (format === "24")
            return time24;

        const hour = Number(time24.slice(0, 2));

        if (hour < 12) {
            if (hour === 0)
                return `12${time24.slice(2, 5)}am`;
            return `${hour}${time24.slice(2, 5)}pm`;
        } else {
            if (hour === 12)
                return `12${time24.slice(2, 5)}pm`;
            return `${hour - 12}${time24.slice(2, 5)}pm`
        }

}

function generateTime(d) {

    return convertTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`)

}

function pad(number) {

    return number.toString().padStart(2, "0")

}

function getTimeFormat() {

    if (format === "12")
        return "hh:mma"
    return "HH:mm"

}

export default { convertTime, generateTime, getTimeFormat, pad }