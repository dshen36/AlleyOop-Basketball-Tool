function whichDataClass(classString) {
    for (var c of dataClassList) {
        if (classString.includes(c)) {
            return c;
        }
        console.log(c);
    }

    return null;
}

function getDataClass(classString) {
    var start = classString.indexOf("data");
    var end = classString.indexOf(" ", start);
    end = (end < 0) ? classString.length : end;
    return classString.substring(start, end);
}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}