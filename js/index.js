$(document).ready(function () {

    // 初期設定
    year = new Date().getFullYear();
    month = new Date().getMonth() + 1;
    day = new Date().getDate();

    $('#time-card-ym').val(year + "年" + month + "月");
    $('#time-card-submite-date').val(year + "年" + month + "月" + day + "日");
    createTimeCard($('#time-card-ym').val());

    $('#time-card-ym').datepicker({
        format: "yyyy年m月",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
        autoclose: true,
        language: "ja"
    });

    $('#time-card-ym').datepicker().on('changeDate', function (ev) {
        createTimeCard($('#time-card-ym').val());
    });

    $('#time-card-submite-date').datepicker({
        format: "yyyy年m月d日",
        startView: "days",
        minViewMode: "days",
        todayHighlight: true,
        autoclose: true,
        language: "ja"
    });

    $('#download').on('click', function () {
        createPDF();
    });

    $('#send').on('click', function () {
        var timeCardYm = $('#time-card-ym').val();
        var timeCardName = $('#time-card-name').val();
        var sendTitle = "勤務表";
        if (timeCardYm != null && timeCardYm != "") {
            sendTitle = sendTitle + "-" + timeCardYm;
        }
        if (timeCardName != null && timeCardName != "") {
            sendTitle = sendTitle + "-" + timeCardName;
        }
        $('#send-title').val(sendTitle);

    });

    $('#send-mail').on('click', function () {

        var sendTo = $('#send-to').val();
        var sendCc = $('#send-cc').val();
        var sendBcc = $('#send-bcc').val();
        if ((sendTo != null && sendTo != "") || (sendCc != null && sendCc != "") || (sendBcc != null && sendBcc != "")) {
            sendMail();
        } else {
            alert("宛先、CC、BCCに何かにメールアドレスを入力してください。");
        }
    });

    // 勤務時間入力がある場合
        $(document).on("change", "#time-card-table tbody tr td input", function (e) {
        var objId = this.id;
        var stringArray = objId.split("-");
        var rowNo = stringArray[stringArray.length - 1];

        var startTimeId = "start-time-" + rowNo;
        var intervalId = "interval-" + rowNo;
        var endTimeId = "end-time-" + rowNo;
        var lunchTimeId = "lunch-time-" + rowNo;
        var breakTimeId = "break-time-" + rowNo;
        var workTimeId = "work-time-" + rowNo;
        var commentTextId = "comment-text-" + rowNo;

        var startTime = "";
        var interval = "";
        var endTime = "";
        var lunchTime = "";
        var breakTime = "";
        var workTime = "";
        var commentText = "";

        if (objId == startTimeId) {
            if ($(this).val() == null || $(this).val() == "") {
                $('#' + startTimeId).val("");
                $('#' + intervalId).text("");
                $('#' + endTimeId).val("");
                $('#' + lunchTimeId).val("");
                $('#' + breakTimeId).val("");
                $('#' + workTimeId).text("");
            } else {
                $(this).val(formatTime($(this).val()));
                if ($('#' + intervalId).text() == null || $('#' + intervalId).text() == "") {
                    $('#' + intervalId).text("〜");
                }
                if ($('#' + endTimeId).val() == null || $('#' + endTimeId).val() == "") {
                    $('#' + endTimeId).val("18:00");
                }
                if ($('#' + lunchTimeId).val() == null || $('#' + lunchTimeId).val() == "") {
                    $('#' + lunchTimeId).val("1:00");
                }
            }
        } else if (objId == endTimeId) {
            if ($(this).val() == null || $(this).val() == "") {
                $('#' + startTimeId).val("");
                $('#' + intervalId).text("");
                $('#' + endTimeId).val("");
                $('#' + lunchTimeId).val("");
                $('#' + breakTimeId).val("");
                $('#' + workTimeId).text("");
            } else {
                $(this).val(formatTime($(this).val()));
                if ($('#' + startTimeId).val() == null || $('#' + startTimeId).val() == "") {
                    $('#' + startTimeId).val("9:00");
                }
                if ($('#' + intervalId).text() == null || $('#' + intervalId).text() == "") {
                    $('#' + intervalId).text("〜");
                }
                if ($('#' + lunchTimeId).val() == null || $('#' + lunchTimeId).val() == "") {
                    $('#' + lunchTimeId).val("1:00");
                }
            }
        } else if (objId == lunchTimeId) {
            if ($(this).val() == null || $(this).val() == "") {
            } else {
                $(this).val(formatTime($(this).val()));
            }
            if ($('#' + startTimeId).val() == null || $('#' + startTimeId).val() == "") {
                $('#' + startTimeId).val("9:00");
            }
            if ($('#' + intervalId).text() == null || $('#' + intervalId).text() == "") {
                $('#' + intervalId).text("〜");
            }
            if ($('#' + endTimeId).val() == null || $('#' + endTimeId).val() == "") {
                $('#' + endTimeId).val("18:00");
            }
        } else if (objId == breakTimeId) {
            if ($(this).val() == null || $(this).val() == "") {
            } else {
                $(this).val(formatTime($(this).val()));
            }
            if ($('#' + startTimeId).val() == null || $('#' + startTimeId).val() == "") {
                $('#' + startTimeId).val("9:00");
            }
            if ($('#' + intervalId).text() == null || $('#' + intervalId).text() == "") {
                $('#' + intervalId).text("〜");
            }
            if ($('#' + endTimeId).val() == null || $('#' + endTimeId).val() == "") {
                $('#' + endTimeId).val("18:00");
            }
            if ($('#' + lunchTimeId).val() == null || $('#' + lunchTimeId).val() == "") {
                $('#' + lunchTimeId).val("1:00");
            }
        }

        startTime = formatTime($('#' + startTimeId).val());
        interval = formatTime($('#' + intervalId).text());
        endTime = formatTime($('#' + endTimeId).val());
        lunchTime = formatTime($('#' + lunchTimeId).val());
        breakTime = formatTime($('#' + breakTimeId).val());
        workTime = formatTime($('#' + workTimeId).text());
        commentText = formatTime($('#' + commentTextId).val());
        totalTime = formatTime($('#total-time').text());

        newWorkTime = calWorkTime(startTime, endTime, lunchTime, breakTime);

        diffWorkTime = calWorkTime(newWorkTime, workTime, "00:00", "00:00");
        newTotalTime = calWorkTime(diffWorkTime, totalTime, "00:00", "00:00");

        $('#' + workTimeId).text(newWorkTime);
        $('#total-time').text(newTotalTime);

    })

});

function formatTime(time) {
    if (time == null || time == "") {
        return "00:00"
    }
    time = time.replace(" ", "");
    time = time.replace("　", "");
    if (time.indexOf(':') == -1) {
        if (time.indexOf('.') == -1) {
            time = time + ':00';
        } else {
            time = time.replace(".", ":")
        }
    }

    t = time.split(":");
    hour = t[0];
    min = t[1];
    // if (String(hour).length < 2) {
    //     hour = "0" + hour;
    // }
    if (String(min).length < 2) {
        min = "0" + min;
    }

    return hour + ":" + min;;
}

function calWorkTime(startTime, endTime, lunchTime, breakTime) {

    s = startTime.split(':');
    e = endTime.split(':');
    l = lunchTime.split(':');
    b = breakTime.split(':');

    min = e[1] - s[1] - l[1] - b[1];
    hour = e[0] - s[0] - l[0] - b[0];

    while (min < 0) {
        min = min + 60;
        hour = hour - 1;
    }

    // if (String(hour).length < 2) {
    //     hour = "0" + hour;
    // } 

    if (String(min).length < 2) {
        min = "0" + min;
    }

    return hour + ":" + min;
}

function createTimeCard(timeCardYm) {
    // 旧データを削除する
    deleteTableRow();

    var year = timeCardYm.substr(0, 4);
    var month = timeCardYm.replace("月", "");
    month = month.replace("年", "");
    month = month.replace("/", "");
    month = month.replace(" ", "");
    month = month.replace("　", "");
    month = month.substr(4);

    var days = getDaysOfMonth(year, month);
    var addRowContent = '<tr id="time-card-day-row" class="text-center align-middle">';
    addRowContent = addRowContent + '<td id="time-card-date">rowDay</td>';
    addRowContent = addRowContent + '<td id="time-card-week">weekDay</td>';
    addRowContent = addRowContent + '<td><input type="text" id="start-time" size="5" class="border-0" style="min-width: 100%;resize:none" value="9:00"></td>';
    addRowContent = addRowContent + '<td id="interval">〜</td>';
    addRowContent = addRowContent + '<td><input type="text" id="end-time" size="5" class="border-0" style="min-width: 100%;resize:none" value="18:00"></td>';
    addRowContent = addRowContent + '<td><input type="text" id="lunch-time" size="5" class="border-0" style="min-width: 100%;resize:none" value="1:00"></td>';
    addRowContent = addRowContent + '<td><input type="text" id="break-time" size="5" class="border-0" style="min-width: 100%;resize:none" value=""/></td>';
    addRowContent = addRowContent + '<td id="work-time">8:00</td>';
    addRowContent = addRowContent + '<td><textarea class="border-0" rows="1" id="comment-text" value="" style="min-width: 100%;resize:none"></textarea></td>';
    addRowContent = addRowContent + '</tr>';

    var addRowNoWorkContent = '<tr id="time-card-day-row" class="text-center align-middle table-secondary">';
    addRowNoWorkContent = addRowNoWorkContent + '<td id="time-card-date">rowDay</td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td id="time-card-week">weekDay</td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td><input type="text" id="start-time" size="5" class="border-0 table-secondary" style="background-color:  #e2e3e5!important;min-width: 100%;resize:none" placeholder="" value=""></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td id="interval"></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td><input type="text" id="end-time" size="5" class="border-0 table-secondary" style="background-color:  #e2e3e5!important;min-width: 100%;resize:none" placeholder="" value=""></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td><input type="text" id="lunch-time" size="5" class="border-0 table-secondary" style="background-color:  #e2e3e5!important;min-width: 100%;resize:none" placeholder="" value=""></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td><input type="text" id="break-time" size="5" class="border-0 table-secondary" style="background-color:  #e2e3e5!important;min-width: 100%;resize:none" placeholder="" value=""></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td id="work-time"></td>';
    addRowNoWorkContent = addRowNoWorkContent + '<td><textarea class="border-0 table-secondary" rows="1" id="comment-text" value="" style="background-color:  #e2e3e5!important;min-width: 100%;resize:none"></textarea></td>';
    addRowNoWorkContent = addRowNoWorkContent + '</tr>';

    addTotalContent = '<tr id="time-card-total-row" class="text-center align-middle">';
    addTotalContent = addTotalContent + '<td class="text-end" colspan="7">合計：</td>';
    addTotalContent = addTotalContent + '<td id="total-time">totalTime</td>';
    addTotalContent = addTotalContent + '<td></td>';
    addTotalContent = addTotalContent + '</tr>';

    var totalTime = 0;
    for (day = 1; day <= days; day++) {
        var temp = "";
        rowDay = month + "月" + day + "日";
        weekDay = getWeekday(year, month, day);
        holiday = getHoliday(year, month, day);

        if (weekDay == "土曜日" || weekDay == "日曜日") {
            temp = addRowNoWorkContent;
            temp = temp.replace("rowDay", rowDay);
            temp = temp.replace("weekDay", weekDay);
            temp = temp.replace('></textarea>', '>' + holiday + '</textarea>');

            temp = temp.replace("time-card-day-row", "time-card-day-row-" + day);
            temp = temp.replace("time-card-date", "time-card-date-" + day);
            temp = temp.replace("time-card-week", "time-card-week-" + day);
            temp = temp.replace("start-time", "start-time-" + day);
            temp = temp.replace("interval", "interval-" + day);
            temp = temp.replace("end-time", "end-time-" + day);
            temp = temp.replace("lunch-time", "lunch-time-" + day);
            temp = temp.replace("break-time", "break-time-" + day);
            temp = temp.replace("work-time", "work-time-" + day);
            temp = temp.replace("comment-text", "comment-text-" + day);

            $('#time-card-table tbody').append(temp);
        } else if (holiday) {
            temp = addRowNoWorkContent;
            temp = temp.replace("rowDay", rowDay);
            temp = temp.replace("weekDay", weekDay);
            temp = temp.replace('></textarea>', '>' + holiday + '</textarea>');

            temp = temp.replace("time-card-day-row", "time-card-day-row-" + day);
            temp = temp.replace("time-card-date", "time-card-date-" + day);
            temp = temp.replace("time-card-week", "time-card-week-" + day);
            temp = temp.replace("start-time", "start-time-" + day);
            temp = temp.replace("interval", "interval-" + day);
            temp = temp.replace("end-time", "end-time-" + day);
            temp = temp.replace("lunch-time", "lunch-time-" + day);
            temp = temp.replace("break-time", "break-time-" + day);
            temp = temp.replace("work-time", "work-time-" + day);
            temp = temp.replace("comment-text", "comment-text-" + day);

            $('#time-card-table tbody').append(temp);
        } else {
            temp = addRowContent;
            temp = temp.replace("rowDay", rowDay);
            temp = temp.replace("weekDay", weekDay);

            temp = temp.replace("time-card-day-row", "time-card-day-row-" + day);
            temp = temp.replace("time-card-date", "time-card-date-" + day);
            temp = temp.replace("time-card-week", "time-card-week-" + day);
            temp = temp.replace("start-time", "start-time-" + day);
            temp = temp.replace("interval", "interval-" + day);
            temp = temp.replace("end-time", "end-time-" + day);
            temp = temp.replace("lunch-time", "lunch-time-" + day);
            temp = temp.replace("break-time", "break-time-" + day);
            temp = temp.replace("work-time", "work-time-" + day);
            temp = temp.replace("comment-text", "comment-text-" + day);

            $('#time-card-table tbody').append(temp);

            totalTime = totalTime + 8;
        }

    }

    totalTime = String(totalTime) + ":00";
    $('#time-card-table tbody').append(addTotalContent.replace("totalTime", totalTime));
}

function deleteTableRow() {
    $('#time-card-table tbody tr').remove();
    $('#time-card-total-row').remove();
}

function getDaysOfMonth(year, month) {
    return new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();
}

function getWeekday(year, month, day) {
    // 日付を指定してフォーマット
    var today = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    // 曜日（日本語）の配列を作成
    var weekday_list = ['日', '月', '火', '水', '木', '金', '土'];

    // 日付から曜日を算出
    var weekday = weekday_list[today.getDay()] + '曜日';
    return weekday;
}

function getHoliday(year, month, day) {
    // 日付を指定してフォーマット
    var today = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    var holiday = JapaneseHolidays.isHoliday(today);
    if (holiday) {
        return holiday;
    } else {
        return "";
    }

}

function createPDF(downLoadFlag = true) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.setFont('Koruri-Regular', 'normal');
    doc.setFontSize(12);

    var pageWidth = doc.internal.pageSize.getWidth()
    doc.text("勤務表", pageWidth / 2, 10, { align: 'center' });

    var inputBody = []
    var inputRow1 = [
        { content: $('#time-card-ym').val() + "　度", colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "", colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "提出日:" + $('#time-card-submite-date').val(), colSpan: 1, styles: { halign: 'left', fillColor: null } }
    ];
    inputBody.push(inputRow1);
    var inputRow2 = [
        { content: "作業名:" + $('#time-card-task').val(), colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "", colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "所　属:" + $('#time-card-group').val(), colSpan: 1, styles: { halign: 'left', fillColor: null } }
    ];
    inputBody.push(inputRow2);
    var inputRow3 = [
        { content: "", colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "", colSpan: 1, styles: { halign: 'left', fillColor: null } },
        { content: "氏　名:" + $('#time-card-name').val(), colSpan: 1, styles: { halign: 'left', fillColor: null } }
    ];
    inputBody.push(inputRow3);

    doc.autoTable({
        body: inputBody,
        styles: {
            font: 'Koruri-Regular',
            fontStyle: 'normal',
            fontSize: 9,
            minCellWidth: 40
        }
    });

    var head = [[
        { content: '日付', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: '曜日', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: '勤務時間', colSpan: 3, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: '昼休', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: 'その他休憩', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: '実稼働時間', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } },
        { content: '備考', colSpan: 1, styles: { halign: 'center', fillColor: null, fontStyle: 'bold', textColor: 20 } }
    ]];

    var timeCardYm = $('#time-card-ym').val();
    var year = timeCardYm.substr(0, 4);
    var month = timeCardYm.replace("月", "");
    month = month.replace("年", "");
    month = month.replace("/", "");
    month = month.replace(" ", "");
    month = month.replace("　", "");
    month = month.substr(4);

    var days = getDaysOfMonth(year, month);

    var body = [];
    var data = [];
    for (day = 1; day <= days; day++) {

        weekDay = getWeekday(year, month, day);
        holiday = getHoliday(year, month, day);

        var timeCardDate = $('#' + "time-card-date-" + day).text();
        var timeCardWeek = $('#' + "time-card-week-" + day).text();
        var startTime = $('#' + "start-time-" + day).val();
        var interval = $('#' + "interval-" + day).text();
        var endTime = $('#' + "end-time-" + day).val();
        var lunchTime = $('#' + "lunch-time-" + day).val();
        var breakTime = $('#' + "break-time-" + day).val();
        var workTime = $('#' + "work-time-" + day).text();
        var commentText = $('#' + "comment-text-" + day).val();

        if (weekDay == "土曜日" || weekDay == "日曜日" || holiday) {
            var row = [
                { content: timeCardDate, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: timeCardWeek, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: startTime, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: interval, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: endTime, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: lunchTime, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: breakTime, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: workTime, colSpan: 1, styles: { halign: 'center', fillColor: [214, 216, 219] } },
                { content: commentText, colSpan: 1, styles: { halign: 'left', fillColor: [214, 216, 219] } }
            ];
        } else {
            var row = [
                { content: timeCardDate, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: timeCardWeek, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: startTime, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: interval, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: endTime, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: lunchTime, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: breakTime, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: workTime, colSpan: 1, styles: { halign: 'center', fillColor: null } },
                { content: commentText, colSpan: 1, styles: { halign: 'left', fillColor: null } }
            ];
        }

        body.push(row);
    }

    var totalRow = [
        { content: "合計：", colSpan: 7, styles: { halign: 'right' } },
        { content: $('#total-time').text(), colSpan: 1, styles: { halign: 'center' } },
        { content: "", colSpan: 1, styles: { halign: 'center' } }
    ];

    body.push(totalRow);

    doc.autoTable({
        head: head,
        body: body,
        styles: {
            font: 'Koruri-Regular',
            fontStyle: 'normal',
            fontSize: 9,
            lineWidth: 0.2,
            minCellWidth: 15
        }
    });

    var timeCardYm = $('#time-card-ym').val();
    var timeCardName = $('#time-card-name').val();
    var timeCardPDFName = "勤務表";
    if (timeCardYm != null && timeCardYm != "") {
        timeCardPDFName = timeCardPDFName + "-" + timeCardYm;
    }
    if (timeCardName != null && timeCardName != "") {
        timeCardPDFName = timeCardPDFName + "-" + timeCardName;
    }
    timeCardPDFName = timeCardPDFName + ".pdf"

    if (downLoadFlag) {
        if ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))) {
            alert("モバイル端末でPDFダウンロードを対応しているため、メール送信よりPDFを取得してください。")
        } else {
            doc.save(timeCardPDFName);
        }
    }

    return btoa(doc.output());

}

function sendMail() {

    var toList = $('#send-to').val() == "" ? null : [$('#send-to').val()]
    var ccList = $('#send-cc').val() == "" ? null : [$('#send-cc').val()];
    var bccList = $('#send-bcc').val() == "" ? null : [$('#send-bcc').val()];
    var mailTitle = $('#send-title').val();
    var mailContent = $('#send-content').val();

    var data = {
        title: mailTitle,
        content: mailContent,
        toList: toList,
        ccList: ccList,
        bccList: bccList,
        fileName: mailTitle + ".pdf",
        fileBytes: createPDF(false)
    };

    $.ajax({
        type: 'POST',
        url: 'https://formsendbox.com/sendSimpleMailWtihAttachment',
        // url: 'http://localhost:8080/sendSimpleMailWtihAttachment',
        data: JSON.stringify(data),
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        crossDomain: true,
        success: function (result) {
            if (result == "true") {
                location.href = "success.html";
            } else {
                alert("\n送信失敗しました。fromsendbox@apasys.co.jpまでご連絡ください。");
            }
        },
        error: function (data) {
            alert("\n送信失敗しました。fromsendbox@apasys.co.jpまでご連絡ください。");
        },
        complete: function (data) {
        }
    })
}
